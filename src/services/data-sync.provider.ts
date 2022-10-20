import { Injectable, OnModuleInit } from "@nestjs/common";
import { DataSource } from "typeorm";
import { ProposalEntity } from "src/entities/proposal.entity";
import { UserEntity } from "src/entities/user.entity";
import { config } from "../config";
import { getLastProcessedBlock, startTrimLastBlocksTask } from "../entities/last-block.entity";
import { getLatestSyncedBlock, fillBlocksSinceSync, getContractMeta, getCurrentKeyValue } from "../utils/blockservice-utils";
import { log } from "../utils/logger";
import { initSocket, BlockDTO } from "./socket-client.provider";

@Injectable()
export class DataSyncProvider implements OnModuleInit{
	manager: any;
	dao_contract: string;
	dex_contract: string
	staking_contract: string;
	lp_staking_contract: string;
	dex_native_token: string;

	constructor(private dataSource: DataSource){
		const { dao_contract, dex_contract,  staking_contract, lp_staking_contract, dex_native_token} = config;
		this.manager = dataSource.manager;
		this.dao_contract = dao_contract;
		this.dex_contract = dex_contract;
    	this.staking_contract = staking_contract;
		this.lp_staking_contract = lp_staking_contract;
    	this.dex_native_token = dex_native_token;
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

		let proposals, lpWeight, ballotCount;
		let ballots = []; 
		let processedBallots = [];
		

		if(contract == this.dao_contract){
			//loop through states
			for (let s of state){
				const { key, value} = s;
				if(key.includes(`${this.dao_contract}.Proposals`)){
					proposals = [key, value]
				}
				if(key.includes(`${this.dao_contract}.LPWeight`)){
					lpWeight = [key, value]
				}
				if(key.includes(`${this.dao_contract}.BallotCount`)){
					ballotCount = [key, value]
				}
				if(key.includes(`${this.dao_contract}.Ballots`)){
					ballots.push([key, value])
				}
				if(key.includes(`${this.dao_contract}.ProcessedBallots`)){
					processedBallots.push([key, value])
				}
			}

			if(proposals && Object.keys(proposals).length > 0){

				const keyArray = proposals[0].split(":");
				const proposalObj = proposals[1];
				
				const proposal_id = parseInt(keyArray[keyArray.length-1]);
				const results = proposalObj.results;
				let proposal_entity = await ProposalEntity.findOne({where: {proposal_id: proposal_id}});
				
				if(!proposal_entity){
					proposal_entity = new ProposalEntity();
					proposal_entity.proposal_id = proposal_id;
					proposal_entity.title = proposalObj.title;
					proposal_entity.description = proposalObj.description;
					proposal_entity.date_decision = proposalObj.date_decision;
					proposal_entity.choices =  proposalObj.choices;	
					proposal_entity.state = proposalObj.state;
					proposal_entity.results = results?results:{};
					if (Object.keys(lpWeight).length > 0){
						let lp_weight;
						parseFloat(lpWeight[0].split(":")[1]) === proposal_id?lp_weight=parseFloat(lpWeight[1].__fixed__):lp_weight=0;
						proposal_entity.lp_weight = lp_weight;
					}
					
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
				log.log("new block: proposal state/results updated")
			
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
					//proposal_id = parseInt(keyArray[1])

					if(keyArray[keyArray.length - 2] === "backwards_index"){
						vk = keyArray[keyArray.length-1];
						ballot_id = parseInt(ballotsObjValue);
					}
					if(keyArray[keyArray.length - 1] === "choice"){
						proposal_id = parseInt(keyArray[1])
						choice_idx = parseInt(ballotsObjValue);
					}
					if(keyArray[keyArray.length - 1] === "counted"){
						proposal_id = parseInt(keyArray[1])
						counted = ballotsObjValue;
						
					}
					if(keyArray[keyArray.length - 1] === "verified"){
						proposal_id = parseInt(keyArray[1])
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

				let proposal_entity = await ProposalEntity.findOne({where: {proposal_id: proposal_id}});
				
				if(counted){	
					proposal_entity.counted = "true";		
				}
				
				if(verified){
					proposal_entity.verified = "true";
				}

				await proposal_entity.save()
				log.log("new block: proposal counted/verified state updated")

				if(vk){
					const rswpBalanceCurrent = await getCurrentKeyValue(this.dex_native_token, "balances", vk);
					

					const rocketFuelCurrent = await getCurrentKeyValue(this.dex_contract, "staked_amount", `${vk}:${this.dex_native_token}`);
					

					const lpCurrent = await getCurrentKeyValue(this.dex_contract, "lp_points", `${this.dex_native_token}:${vk}`);
					

					const stakedRswpCurrent = await getCurrentKeyValue(this.staking_contract, "balances", vk);
					

					const stakedLpCurrent = await getCurrentKeyValue(this.staking_contract, "balances", vk);
					

					let user_entity = await UserEntity.findOne({where: { vk: vk }});
					if(!user_entity){ 
					 	user_entity = new UserEntity();
						user_entity.vk = vk;
						user_entity.ballot_idx = [ballot_id]
						user_entity.choice_idx = [choice_idx];
						user_entity.proposals = [proposal_id];
						user_entity.weight = weight?[weight]:[];
						user_entity.rswp_balance = rswpBalanceCurrent.value;
						user_entity.rocket_fuel = rocketFuelCurrent.value;
						user_entity.staked_rswp = stakedRswpCurrent.value;

						proposal_entity = await ProposalEntity.findOne({where: {proposal_id: proposal_id}});
						if (proposal_entity){
							let lp_weight = proposal_entity.lp_weight;

							user_entity.staked_lp_value = [stakedLpCurrent.value * lp_weight];
							user_entity.lp_value = [lpCurrent.value * lp_weight];
						}
						
						await user_entity.save()
						log.log("new block: user data saved")
						return
					}

					if(ballot_id && user_entity.ballot_idx.length >= 0){
						user_entity.ballot_idx.push(ballot_id);
					}
					
					if(choice_idx !== undefined&& user_entity.choice_idx.length >= 0){
						user_entity.choice_idx.push(choice_idx);
					}
					if(proposal_id && user_entity.proposals.length >= 0){
						if(counted || verified){	
						}else{
							user_entity.proposals.push(proposal_id);
						}
					}
					
					if(weight && user_entity.weight?.length >= 0){
						user_entity.weight.push(weight);
					}

					user_entity.rswp_balance = rswpBalanceCurrent.value;
					user_entity.rocket_fuel = rocketFuelCurrent.value;
					user_entity.staked_rswp = stakedRswpCurrent.value;
					
					let staked_lp_value = []
					let lp_value = []
					
					for (let p of user_entity.proposals){
						let proposal_entity = await ProposalEntity.findOne({where: { proposal_id: p}});
						if (proposal_entity){
							let lp_weight = proposal_entity.lp_weight;
							staked_lp_value.push(stakedLpCurrent.value * lp_weight)
							lp_value.push(lpCurrent.value * lp_weight)	
						}
					}
					user_entity.lp_value = Object.keys(lp_value).length>0?lp_value:user_entity.lp_value;
					user_entity.staked_lp_value = Object.keys(staked_lp_value).length>0?staked_lp_value:user_entity.staked_lp_value;
					
					await user_entity.save()
					log.log("new block: user data updated")
				}
				
			}		

		}
		
		
		

		


		// let rocket_fuel;
		// let lp_points;

		// if (contract === this.dex_contract){
		// 	for (let s of state){
		// 		const { key, value} = s;

		// 		if(key.includes(`${this.staking_contract}.staked_amount`)){
		// 			rocket_fuel = [key, value];
		// 		}
		// 		if(key.includes(`${this.staking_contract}.lp_points`)){
		// 			lp_points = [key, value];
		// 		}
		// 	}

		// 	if(rocket_fuel){
		// 		const keyArray = rocket_fuel[0].split(":");
				
		// 		if (keyArray[keyArray.length - 1] === this.dex_native_token){
		// 			const vk = keyArray[1];
		// 			let user_entity = await UserEntity.findOne({where: { vk: vk }});
		// 			if(user_entity){ 
		// 				user_entity.rocket_fuel = parseFloat(rocket_fuel[1]);

		// 				await user_entity.save();
		// 				log.log(`new block: ${vk} rocket fuel updated`);
		// 			}
		// 		}
		// 	}

		// 	if (lp_points){
		// 		const keyArrayLp = lp_points[0].split(":");
				
		// 		if (keyArrayLp[1] === this.dex_native_token){
		// 			const vkLp = keyArrayLp[keyArrayLp.length - 1];
		// 			let user_entity = await UserEntity.findOne({where: { vk: vkLp }});
		// 			if(user_entity){ 
		// 				let lp_value = []
		// 				for (let p of user_entity.proposals){
		// 					let proposal_entity = await ProposalEntity.findOne({where: { proposal_id: p}});
		// 					if (proposal_entity){
		// 						let lp_weight = proposal_entity.lp_weight;
		// 						lp_value.push(parseFloat(lp_points[1])*lp_weight)
								
		// 					}
		// 				}
		// 				user_entity.lp_value = Object.keys(lp_value).length>0?lp_value:user_entity.lp_value;

		// 				await user_entity.save();
		// 				log.log(`new block: ${vkLp} lp value updated`);
		// 			}
		// 		}
		// 	}
			
		// }

		// let staked_rswp;

		// if (contract === this.staking_contract){
		// 	for (let s of state){
		// 		const { key, value} = s;

		// 		if(key.includes(`${this.staking_contract}.balances`)){
		// 			staked_rswp = [key, value];
		// 		}
		// 	}

		// 	if (staked_rswp){
		// 		const keyArray = staked_rswp[0].split(":");
		// 		const vk = keyArray[keyArray.length - 1];

		// 		let user_entity = await UserEntity.findOne({where: { vk: vk }});
		// 		if(user_entity){ 
		// 			user_entity.staked_rswp = parseFloat(staked_rswp[1]);

		// 			await user_entity.save();
		// 			log.log(`new block: ${vk} staked balance updated`);
		// 		}
		// 	}
		// } 

		// let staked_lp;

		// if (contract === this.lp_staking_contract){
		// 	for (let s of state){
		// 		const { key, value} = s;
		// 		if(key.includes(`${this.lp_staking_contract}.balances`)){
		// 			staked_lp = [key, value];
		// 		}
		// 	}

		// 	if (staked_lp){
		// 		const keyArray = staked_lp[0].split(":");
		// 		const vk = keyArray[keyArray.length - 1];

		// 		let user_entity = await UserEntity.findOne({where: { vk: vk }});
		// 		if(user_entity){ 
		// 			let staked_lp_value = []
		// 			for (let p of user_entity.proposals){
		// 				let proposal_entity = await ProposalEntity.findOne({where: { proposal_id: p}});
		// 				if (proposal_entity){
		// 					let lp_weight = proposal_entity.lp_weight;
		// 					staked_lp_value.push(parseFloat(staked_lp[1])*lp_weight)	
		// 				}
		// 			}
		// 			user_entity.staked_lp_value = Object.keys(staked_lp_value).length>0?staked_lp_value:user_entity.staked_lp_value;

		// 			await user_entity.save();
		// 			log.log(`new block: ${vk} staked lp value updated`);
		// 		}
		// 	}
		// } 

		// let rswp_balance;

		// if (contract === this.dex_native_token){

		// 	for (let s of state){
		// 		const { key, value} = s;
		// 		if(key.includes(`${this.dex_native_token}.balances`)){
		// 			rswp_balance = [key, value];
		// 		}
		// 	}

		// 	if (rswp_balance){
		// 		const keyArray = rswp_balance[0].split(":");
		// 		const vk = keyArray[keyArray.length - 1];

		// 		let user_entity = await UserEntity.findOne({where: { vk: vk }});
		// 		if(user_entity){ 
		// 			console.log(rswp_balance[1])
		// 			user_entity.rswp_balance = parseFloat(rswp_balance[1]);

		// 			await user_entity.save();
		// 			log.log(`new block: ${vk} balance updated`);
		// 		}
		// 	}
		// } 
		
	}





	public startFillUpDatabase = async()=> {

		//fetch data from blockservice
		const daoMeta = await getContractMeta(this.dao_contract);
		//const rswpBalanceMeta = await getContractMeta(this.dex_native_token);
		// const dexMeta = await getContractMeta(this.dex_contract);
		// const stakingMeta = await getContractMeta(this.staking_contract);
		// const lpStakingMeta = await getContractMeta(this.lp_staking_contract);
    	
		

		if(Object.keys(daoMeta).length > 0){
			//Proposals
			const proposals = daoMeta.con_lite_dao.Proposals
			//LPWeight
			const lpWeight = daoMeta.con_lite_dao.LPWeight
			//BallotCount
			const ballotCount = daoMeta.con_lite_dao.BallotCount
			//Ballots
			const ballots = daoMeta.con_lite_dao.Ballots
			//ProcessedBallots
			const processedBallots = daoMeta.con_lite_dao.ProcessedBallots

			let proposalArray = []
			let userArray = []
			let proposalObj;
			let userObj;


			if(proposals){
				if(Object.keys(proposals).length > 0){
					const proposal_ids = Object.keys(proposals)

					for (let p of proposal_ids){
						const proposal_id = parseInt(p)
						//log.log(`ballots id: ${proposal_id}`)
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

						if(lpWeight){
							const lpWeightArray = Object.keys(lpWeight);
							if(lpWeightArray.length > 0){
								let lp_weight;
								
								//(lpWeightArray[0]) === proposal_id?lp_weight = lpWeight[proposal_id].con_rswp_lst001:lp_weight = 0;
								lpWeight[proposal_id]?lp_weight = lpWeight[proposal_id].con_rswp_lst001.__fixed__:lp_weight = 0;
								proposalObj.lp_weight = parseFloat(lp_weight); 
								
							}
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
									if(counted){
										proposalObj.counted = "true";
									}
									if(verified){
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
						//console.log(proposal_ids)
						let vk;
						//backwards_index
						if(Object.keys(ballots_proposal_id.backwards_index).length > 0){
							const vkObj = ballots_proposal_id.backwards_index;
							vk = Object.keys(vkObj)[0];
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
										vk = processedBallots[p][ballot_id].user_vk;
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
							if(userArray.length > 0){
								let last_obj = userArray[userArray.length - 1]
								if(last_obj.vk !== userObj.vk){
									userArray.push(userObj);
								}
							}else{
								userArray.push(userObj);
							}
							
								
						}
						
					} 

					if(userArray.length > 0){

						await UserEntity.insert(userArray);
						log.log(`saved all current user data `)
					}
				
				}
				
			} 
		}

		//CHECK FOR __FIXED__ AND NOT __FIXED__

		const rswpBalanceMeta = await getContractMeta(this.dex_native_token);
		
		if (Object.keys(rswpBalanceMeta).length > 0){
			const rswpBalances = rswpBalanceMeta.con_rswp_lst001.balances
			
			if (rswpBalances){
				const vks = Object.keys(rswpBalances)
				
				for (let vk of vks){
					let user_entity = await UserEntity.findOne({where: {vk: vk}});
					if (user_entity){
						user_entity.rswp_balance = parseFloat(rswpBalances[vk].__hash_self__);
						await user_entity.save();
					}
				}
			}

		}

		const dexMeta = await getContractMeta(this.dex_contract);

		if (Object.keys(dexMeta).length > 0){
			const dexLp = dexMeta.con_rocketswap_official_v1_1.lp_points
			const dexStakedAmount = dexMeta.con_rocketswap_official_v1_1.staked_amount
			if(dexStakedAmount){
				const vks = Object.keys(dexStakedAmount)
				for (let vk of vks){
					let user_entity = await UserEntity.findOne({where: {vk: vk}});
					if (user_entity){
						
						user_entity.rocket_fuel = parseFloat(dexStakedAmount[vk].con_rswp_lst001);
						//console.log(parseFloat(dexStakedAmount[vk].con_rswp_lst001))
						await user_entity.save();
					}
				}
			}
			if(dexLp){
				const contracts = Object.keys(dexLp)
				for (let con of contracts){
					if (con === this.dex_native_token){
						const vks = Object.keys(dexLp[con]);
						for (let vk of vks){
							let user_entity = await UserEntity.findOne({where: {vk: vk}});
							if (user_entity){
								let lp_value = []
								for (let p of user_entity.proposals){
									let proposal_entity = await ProposalEntity.findOne({where: { proposal_id: p}});
									if (proposal_entity){
										let lp_weight = proposal_entity.lp_weight;
										lp_value.push(parseFloat(dexLp.con_rswp_lst001[vk])*lp_weight)	
									}
								}
								user_entity.lp_value = Object.keys(lp_value).length>0?lp_value:user_entity.lp_value;

								await user_entity.save();
							}
						}
					}
				}
			}
			
		}

		const stakingMeta = await getContractMeta(this.staking_contract);

		if (Object.keys(stakingMeta).length > 0){
			const staking = stakingMeta.con_staking_rswp_rswp_interop_v2.balances;
			if(staking){
				const vks = Object.keys(staking) //check if it contains stuff
				for (let vk of vks){
					let user_entity = await UserEntity.findOne({where: {vk: vk}});
					if (user_entity){
						user_entity.staked_rswp = parseFloat(staking[vk]);
						await user_entity.save();
					}
				}
			}
		}

		const lpStakingMeta = await getContractMeta(this.lp_staking_contract);

		if (Object.keys(lpStakingMeta).length > 0){
			const lpStaking = lpStakingMeta.con_liq_mining_rswp_rswp.balances
			if(lpStaking){
				const vks = Object.keys(lpStaking)
				for (let vk of vks){
					let user_entity = await UserEntity.findOne({where: {vk: vk}});
					if (user_entity){
						let staked_lp_value = []
						for (let p of user_entity.proposals){
							let proposal_entity = await ProposalEntity.findOne({where: { proposal_id: p}});
							if (proposal_entity){
								let lp_weight = proposal_entity.lp_weight;
								staked_lp_value.push(parseFloat(lpStaking[vk])*lp_weight)	
							}
						}
						user_entity.staked_lp_value = Object.keys(staked_lp_value).length>0?staked_lp_value:user_entity.staked_lp_value;

						await user_entity.save();

					}
				}
				
			}
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