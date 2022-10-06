import { Injectable, OnModuleInit } from "@nestjs/common";
import { DataSource } from "typeorm";
import { ProposalEntity } from "src/entities/proposal.entity";
import { UserEntity } from "src/entities/user.entity";
import { config } from "../config";
import { getLastProcessedBlock, startTrimLastBlocksTask } from "../entities/last-block.entity";
import { getLatestSyncedBlock, fillBlocksSinceSync, getAllVariableStates, getContractMeta } from "../utils/blockservice-utils";
import { log } from "../utils/logger";
import { initSocket, BlockDTO } from "./socket-client.provider";

@Injectable()
export class DataSyncProvider implements OnModuleInit{
	manager: any;
	contract: string;

	constructor(private dataSource: DataSource){
		const { dao_contract } = config;
		this.manager = dataSource.manager;
		this.contract = dao_contract;
	}
	
	async onModuleInit() {

		const entities = [ProposalEntity, UserEntity]
		
		try {

			//wipe all database tables
			for (let ent of entities){
				await this.manager.clear(ent)
			}
			log.log(`wiped all database tables!`)

		} catch(err){
			log.warn({ err })
		}

		const last_block_saved_db = await getLastProcessedBlock(); //from app storage
		const latest_synced_block_bs = await getLatestSyncedBlock(); //from blockservice
		const start_sync_block = last_block_saved_db || latest_synced_block_bs;

		await fillBlocksSinceSync(start_sync_block, this.parseBlock);

		
		//save proposals and user data on startup
		await this.startFillUpDatabase()

		initSocket(this.parseBlock);
		
		startTrimLastBlocksTask();

	}

	/**
	 * ALL NEW BLOCKS ARE PASSED THROUGH THIS FUNCTION FOR PROCESSING
	 */

	public parseBlock = async (block: BlockDTO) => {
		const { state, contract} = block;

		let proposals, ballotCount;
		let ballots = []; 
		let processedBallots = [];
		

		if(contract == this.contract){
			//loop through states
			for (let s of state){
				const { key, value} = s;
				if(key.includes(`${this.contract}.Proposals`)){
					proposals = [key, value]
				}
				if(key.includes(`${this.contract}.BallotCount`)){
					ballotCount = [key, value]
				}
				if(key.includes(`${this.contract}.Ballots`)){
					ballots.push([key, value])
				}
				if(key.includes(`${this.contract}.ProcessedBallots`)){
					processedBallots.push([key, value])
				}
			}

			if(proposals && Object.keys(proposals).length > 0){

				const keyArray = proposals[0].split(":")
				const proposalObj = proposals[1]
				const proposal_id = parseInt(keyArray[keyArray.length-1])
				const results = proposalObj.results

				let proposal_entity = await ProposalEntity.findOne({where: {proposal_id: proposal_id}})	
				
				if(!proposal_entity){
					proposal_entity = new ProposalEntity();
					proposal_entity.proposal_id = proposal_id;
					proposal_entity.title = proposalObj.title;
					proposal_entity.description = proposalObj.description;
					proposal_entity.date_decision = proposalObj.date_decision;
					proposal_entity.choices =  proposalObj.choices;	
					proposal_entity.state = proposalObj.state;
					proposal_entity.results = results?results:{};
					await proposal_entity.save();

					log.log("new block: proposal saved")
					return
				}
				if(proposalObj.state !== proposal_entity.state){
					proposal_entity.state = proposalObj.state;
				}

				if(proposalObj.results !== proposal_entity.results){
					proposal_entity.results = proposalObj.results;
				}

				await proposal_entity.save();
			
			}

			if(ballotCount &&Object.keys(ballotCount).length > 0){
				const keyArray = ballotCount[0].split(":")
				const ballotCountValue = ballotCount[1]
				const proposal_id = parseInt(keyArray[1])
				const ballot_counts = parseInt(ballotCountValue)

				const proposal_entity = await ProposalEntity.findOne({where: {proposal_id: proposal_id}});	
				proposal_entity.ballot_count = ballot_counts;
				await proposal_entity.save();
				log.log("new block: proposal ballot count updated")
			}

			if(ballots && Object.keys(ballots).length > 0){
				let proposal_id;
				let vk;
				let ballot_id;
				let choice_idx;
				let counted;
				let verified;
				let weight;

				for(let b of ballots){
					const keyArray = b[0].split(":")
					const ballotsObjValue = b[1]
					proposal_id = parseInt(keyArray[1])

					if(keyArray[keyArray.length - 2] === "backwards_index"){
						vk = keyArray[keyArray.length-1];
						ballot_id = parseInt(ballotsObjValue);
					}
					if(keyArray[keyArray.length - 1] === "choice"){
						choice_idx = parseInt(ballotsObjValue);
					}
					if(keyArray[keyArray.length - 1] === "counted"){
						counted = ballotsObjValue;
						
					}
					if(keyArray[keyArray.length - 1] === "verified"){
						verified = ballotsObjValue;
					}	 
				}

				//console.log(processedBallots)
				if(processedBallots && Object.keys(processedBallots).length > 0){
					
					for(let p of processedBallots){
						const keyArray = p[0].split(":")
						const processedBallotsObjValue = p[1]
	
						if(keyArray[keyArray.length - 1] === "user_vk"){
							vk = processedBallotsObjValue;
							log.log(vk)
						}
						if(keyArray[keyArray.length - 1] === "weight"){
							if(Object.keys(processedBallotsObjValue).length > 0){
								weight = parseFloat(processedBallotsObjValue.__fixed__);
							} else{
								weight = parseInt(processedBallotsObjValue);
							}
							
						}
								
					}

				}



				if(vk){
					const proposal_entity = await ProposalEntity.findOne({where: {proposal_id: proposal_id}});
					let user_entity = await UserEntity.findOne({where: { vk: vk }});
					if(!user_entity){ 
					 	user_entity = new UserEntity();
						user_entity.vk = vk;
						user_entity.ballot_idx = [ballot_id]
						user_entity.choice_idx = [choice_idx];
						user_entity.proposals = [proposal_id];
						user_entity.weight = [weight];

						if(counted !== undefined && counted === true){	
							proposal_entity.counted = "true";		
						}
						if(verified !== undefined && verified === true){
							proposal_entity.verified = "true";	
						}

						await user_entity.save()
						await proposal_entity.save()
						return
					}

					if(ballot_id && user_entity.ballot_idx.length >= 0){
						user_entity.ballot_idx.push(ballot_id);
					}
					if(choice_idx && user_entity.choice_idx.length >= 0){
						user_entity.choice_idx.push(choice_idx);
					}
					if(proposal_id && user_entity.proposals.length >= 0){
						user_entity.proposals.push(proposal_id);
					}
					if(counted !== undefined && counted === true){
						proposal_entity.counted = "true";	
					}
					if(verified !== undefined && verified === true){
						proposal_entity.verified = "true";	
					}
					if(weight && user_entity.weight.length !== null){
						user_entity.weight.push(weight);
					}
					await proposal_entity.save()
					log.log("new block: proposal processed and verified state updated")
					await user_entity.save()
					log.log("new block: user data updated")
				}
				
			}





			// if(processedBallots && Object.keys(processedBallots).length > 0){
			// 	let vk;
			// 	let weight;
				
			// 	for(let p of ballots){
			// 		const keyArray = p[0].split(":")
			// 		const processedBallotsObjValue = p[1]

			// 		if(keyArray[keyArray.length - 1] === "user_vk"){
			// 			vk = processedBallotsObjValue;
			// 		}
			// 		if(keyArray[keyArray.length - 1] === "weight"){
			// 			if(Object.keys(processedBallotsObjValue).length > 0){
			// 				weight = parseFloat(processedBallotsObjValue.__fixed__);
			// 			} else{
			// 				weight = parseInt(processedBallotsObjValue);
			// 			}
						
			// 		}
						 
			// 	}

			// 	if(vk){
			// 		let user_entity = await UserEntity.findOne({where: { vk: vk }});
			// 		if(!user_entity){
			// 			user_entity = new UserEntity();
			// 			user_entity.vk = vk
			// 		}
			// 		if(weight){
			// 			if(weight !== null && user_entity.weight.length >= 0){
			// 				user_entity.weight.push(weight);
			// 			}
						
			// 		}

			// 		await user_entity.save()
			// 		log.log("new block: user weight updated")
			// 	}

			// }		

		}	
	}


	public startFillUpDatabase = async()=> {

		//fetch data from blockservice
		const contractMeta = await getContractMeta(this.contract)

		if(Object.keys(contractMeta).length > 0){
			//Proposals
			const proposals = contractMeta.con_lite_dao.Proposals
			//BallotCount
			const ballotCount = contractMeta.con_lite_dao.BallotCount
			//Ballots
			const ballots = contractMeta.con_lite_dao.Ballots
			//ProcessedBallots
			const processedBallots = contractMeta.con_lite_dao.ProcessedBallots

			let proposalArray = []
			let userArray = []
			let proposalObj;
			let userObj;


			if(proposals){
				if(Object.keys(proposals).length > 0){
					const proposal_ids = Object.keys(proposals)

					for (let p of proposal_ids){
						const proposal_id = parseInt(p)
						const results = proposals[proposal_id].results

						proposalObj = {
							proposal_id: proposal_id,
							title: proposals[proposal_id].title,
							description: proposals[proposal_id].description,
							date_decision: proposals[proposal_id].date_decision,
							choices: proposals[proposal_id].choices,
							state: proposals[proposal_id].state,
							results: results?results:{}
						}
						
						if(ballotCount){
							if(Object.keys(ballotCount).length > 0){
								const ballot_counts = ballotCount[proposal_id] //a string or numb?

								if(ballot_counts !== undefined){
									proposalObj.ballot_count = ballot_counts;
								}
								
							}
						}
						
						if(ballots){
							if(Object.keys(ballots).length > 0){
								const ballots_proposal_id = ballots[proposal_id]
			
								if(ballots_proposal_id){
								
									const counted = ballots_proposal_id.counted; 
									const verified = ballots_proposal_id.verified;
									if(counted !== undefined && counted === true){
										proposalObj.counted = "true";
									}
									if(verified !== undefined && verified === true){
										proposalObj.verified = "true";
									}
								}
							}
						}


						if(proposalObj && Object.keys(proposalObj).length > 0){
							proposalArray.push(proposalObj);
						}
						
					}

					await ProposalEntity.insert(proposalArray);
					log.log(`saved all current proposal data`)
					
				}
			} 


			if(ballots){
				if(Object.keys(ballots).length > 0){
					
					const proposal_ids = Object.keys(ballots)
					
					for (let p of proposal_ids){
						const ballots_proposal_id = ballots[p]

						//backwards_index
						if(Object.keys(ballots_proposal_id.backwards_index).length > 0){
							const vkObj = ballots_proposal_id.backwards_index;
							const vk = Object.keys(vkObj)[0];
							const ballot_id = parseInt(vkObj[vk]);

							//forwards_index
							const ballotForwardObj = ballots_proposal_id.forwards_index;	
							const choice_idx = parseInt(ballotForwardObj[ballot_id].choice);
							let counted_weight;
							
							if(processedBallots){
								if(Object.keys(processedBallots).length > 0){
									
									if(processedBallots[p]){
										
										const ballot_id = parseInt(Object.keys(processedBallots[p])[0]);
										counted_weight = processedBallots[p][ballot_id].weight;
										
										if(Object.keys(counted_weight).length > 0){
											counted_weight = parseFloat(counted_weight.__fixed__);
										}else{
											counted_weight = parseInt(counted_weight)
										}

									}
								
								}
				
							}
							
							let found = false;

							if(userArray.length > 0){
								for (let ent of userArray){
									if(ent.vk === vk){
										ent.proposals.push(parseInt(p)); 
										ent.ballot_idx.push(ballot_id); 
										ent.choice_idx.push(choice_idx);
										if(counted_weight){
											ent.weight.push(counted_weight);
										}
										
										found = true;
									} 
								}
								if(found){
									await UserEntity.insert(userArray);
									log.log("saved all current user data")
									return
								}	
								
							}
							
							if(!found){
								userObj = {
									vk: vk,
									ballot_idx: [ballot_id],
									choice_idx: [choice_idx],
									weight: counted_weight?[counted_weight]:[],
									proposals: [parseInt(p)]
		
								}
								
							}
							
						}
						
						
						if(userObj && Object.keys(userObj).length > 0){

							userArray.push(userObj);
						}
						
					} 


					//UserEntity stuff
					if(userArray.length > 0){
						await UserEntity.insert(userArray);
						log.log(`saved all current user data `)
					}
				
				}
				
			} // ballots ends here

			

		}	
	}	



	// BALLOTCOUNT STATE GIVES US THE NUMBER OF VOTERS FOR A PARTICULAR PROPOSAL

	
	//blockservice data structure

	/* *
	con_lite_dao

		Ballots

			{proposal_idx}
				"backwards_index"
					{{vk}: ballot_idx}

			{proposal_idx}
				"forwards_index"
					{ballot_idx}
						{"choice" : choice_idx}

			{proposal_idx}
				{"counted" : false}

			{proposal_idx}
				{"verified" : false}

	* */
	
};