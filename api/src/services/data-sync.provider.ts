import { Injectable, OnModuleInit } from "@nestjs/common";
import { DataSource } from "typeorm";
import { ProposalEntity } from "src/entities/proposal.entity";
import { UserEntity } from "src/entities/user.entity";
import { config } from "../config";
import { getLastProcessedBlock, startTrimLastBlocksTask } from "../entities/last-block.entity";
import { getLatestSyncedBlock, fillBlocksSinceSync, getContractMeta, getCurrentKeyValue } from "../utils/blockservice-utils";
import { getNumberFromFixed } from "../utils/misc-utils";
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

		let proposals: [string, any];
		let lpWeight: [string, any];
		let ballotCount: [string, any];
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
						if (parseInt(lpWeight[0].split(":")[1]) === proposal_id){

							lp_weight = getNumberFromFixed(lpWeight[1])
						}

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
				const ballot_counts = ballotCountValue

				const proposal_entity = await ProposalEntity.findOne({where: {proposal_id: proposal_id}});	
				proposal_entity.ballot_count = ballot_counts;
				await proposal_entity.save();
				log.log("new block: proposal ballot count updated")
			}

			if(ballots && Object.keys(ballots).length > 0){
				let proposal_id: number;
				let vk;
				let ballot_id: string;
				let choice_idx;
				let counted;
				let verified;
				let weight;

				for(let b of ballots){
					const keyArray = b[0].split(":")
					const ballotsObjValue = b[1]

					if(keyArray[keyArray.length - 2] === "backwards_index"){
						vk = keyArray[keyArray.length-1];
						ballot_id = ballotsObjValue;
					}
					if(keyArray[keyArray.length - 1] === "choice"){
						proposal_id = keyArray[1]
						choice_idx = ballotsObjValue;
					}
					if(keyArray[keyArray.length - 1] === "counted"){
						proposal_id = keyArray[1]
						counted = ballotsObjValue;
						
					}
					if(keyArray[keyArray.length - 1] === "verified"){
						proposal_id = keyArray[1]
						verified = ballotsObjValue;
					}	 
				}

				if(processedBallots && Object.keys(processedBallots).length > 0){
					
					for(let p of processedBallots){
						const keyArray = p[0].split(":")
						const processedBallotsObjValue = p[1]
	
						if(keyArray[keyArray.length - 1] === "user_vk"){
							vk = processedBallotsObjValue;
						}
						if(keyArray[keyArray.length - 1] === "weight"){
							if(Object.keys(processedBallotsObjValue).length > 0){

								weight = getNumberFromFixed(processedBallotsObjValue);

							}
						}			
					}
				}

				let proposal_entity = await ProposalEntity.findOne({where: {proposal_id: proposal_id}});
				
				if(counted){	
					proposal_entity.counted = true;		
				}
				
				if(verified){
					proposal_entity.verified = true;
				}

				await proposal_entity.save()
				log.log("new block: proposal counted/verified state updated")

				if(vk){

					try {
						const [rswpBalanceCurrent, rocketFuelCurrent, lpCurrent, stakedRswpCurrent, stakedLpCurrent] = await Promise.all([
							getCurrentKeyValue(this.dex_native_token, "balances", vk),
							getCurrentKeyValue(this.dex_contract, "staked_amount", `${vk}:${this.dex_native_token}`),
							getCurrentKeyValue(this.dex_contract, "lp_points", `${this.dex_native_token}:${vk}`),
							getCurrentKeyValue(this.staking_contract, "balances", vk),
							getCurrentKeyValue(this.lp_staking_contract, "balances", vk)
						])
					

						let user_entity = await UserEntity.findOne({where: { vk: vk }});
						if(!user_entity){ 
							user_entity = new UserEntity();
							user_entity.vk = vk;
							user_entity.ballot_idx = [ballot_id]
							user_entity.choice_idx = [choice_idx];
							user_entity.proposals = [proposal_id.toString()];
							user_entity.weight = weight?[weight]:[];
							user_entity.rswp_balance = getNumberFromFixed(rswpBalanceCurrent.value) 
							user_entity.rocket_fuel = getNumberFromFixed(rocketFuelCurrent.value) 
							user_entity.staked_rswp = getNumberFromFixed(stakedRswpCurrent.value) 

							proposal_entity = await ProposalEntity.findOne({where: {proposal_id: proposal_id}});
							if (proposal_entity){
								let lp_weight = proposal_entity.lp_weight;

								user_entity.staked_lp_value = [(getNumberFromFixed(stakedLpCurrent.value) * lp_weight).toString()];
								user_entity.lp_value = [(getNumberFromFixed(lpCurrent.value) * lp_weight).toString()];
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
								user_entity.proposals.push(proposal_id.toString());
							}
						}
						
						if(weight && user_entity.weight?.length >= 0){
							user_entity.weight.push(weight);
						}

						user_entity.rswp_balance = getNumberFromFixed(rswpBalanceCurrent.value);
						user_entity.rocket_fuel = getNumberFromFixed(rocketFuelCurrent.value);
						user_entity.staked_rswp = getNumberFromFixed(stakedRswpCurrent.value);
						
						let staked_lp_value = []
						let lp_value = []
						
						for (let p of user_entity.proposals){
							let proposal_entity = await ProposalEntity.findOne({where: { proposal_id: parseInt(p)}});
							if (proposal_entity){
								let lp_weight = proposal_entity.lp_weight;
								staked_lp_value.push(getNumberFromFixed(stakedLpCurrent.value) * lp_weight)
								lp_value.push(getNumberFromFixed(lpCurrent.value) * lp_weight)	
							}
						}
						user_entity.lp_value = Object.keys(lp_value).length>0?lp_value:user_entity.lp_value;
						user_entity.staked_lp_value = Object.keys(staked_lp_value).length>0?staked_lp_value:user_entity.staked_lp_value;
						
						await user_entity.save()
						log.log("new block: user data updated")

					} catch(err){
						log.warn({ err })
					}
				}
				
			}		

		} 
		
	}

	public startFillUpDatabase = async()=> {

		//fetch data from blockservice

		try {

			const [daoMeta, rswpBalanceMeta, dexMeta, stakingMeta, lpStakingMeta] = await Promise.all([
				getContractMeta(this.dao_contract),
				getContractMeta(this.dex_native_token),
				getContractMeta(this.dex_contract),
				getContractMeta(this.staking_contract),
				getContractMeta(this.lp_staking_contract)
			])
			
			if(Object.keys(daoMeta).length > 0){
				//Proposals
				const proposals = daoMeta.con_lite_dao_test20.Proposals
				//LPWeight
				const lpWeight = daoMeta.con_lite_dao_test20.LPWeight
				//BallotCount
				const ballotCount = daoMeta.con_lite_dao_test20.BallotCount
				//Ballots
				const ballots = daoMeta.con_lite_dao_test20.Ballots
				//ProcessedBallots
				const processedBallots = daoMeta.con_lite_dao_test20.ProcessedBallots

				let proposalArray = []
				let userArray = []
				let proposalObj;
				let userObj;

				if(proposals && Object.keys(proposals).length > 0){
					const proposal_ids_ = Object.keys(proposals)
					const proposal_ids = proposal_ids_.map(i=>parseInt(i))

					for (let p of proposal_ids){
						const proposal_id = p
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
							if(lpWeightArray.length > 0 && lpWeight[proposal_id]){
								let lp_weight;
								
								proposalObj.lp_weight = getNumberFromFixed(lpWeight[proposal_id].con_rswp_lst001) 	
							}
						}
						
						if(ballotCount && Object.keys(ballotCount).length > 0){
							const ballot_counts = ballotCount[proposal_id] //a string or numb?

							if(ballot_counts !== undefined){
								proposalObj.ballot_count = ballot_counts;
							}
						}
						
						if(ballots && Object.keys(ballots).length > 0){
							const ballots_proposal_id = ballots[proposal_id]
		
							if(ballots_proposal_id){
							
								const counted = ballots_proposal_id.counted; 
								const verified = ballots_proposal_id.verified;
								if(counted){
									proposalObj.counted = true;
								}
								if(verified){
									proposalObj.verified = true;
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

				if(ballots && Object.keys(ballots).length > 0){
					
					const proposal_ids_ = Object.keys(ballots)
					const proposal_ids = proposal_ids_.map(i=>parseInt(i))
					
					for (let p of proposal_ids){ // convert p to number type?
						const proposal_id = p
						const ballots_proposal_id = ballots[proposal_id]
						let vk;
						//backwards_index
						if(Object.keys(ballots_proposal_id.backwards_index).length > 0){
							const vkObj = ballots_proposal_id.backwards_index;
							vk = Object.keys(vkObj)[0];
							const ballot_id = vkObj[vk];

							//forwards_index
							const ballotForwardObj = ballots_proposal_id.forwards_index;	
							const choice_idx = ballotForwardObj[ballot_id].choice;
							let counted_weight;
							
							if(processedBallots && Object.keys(processedBallots).length > 0){
								
								if(processedBallots[proposal_id]){
				
									const ballot_id = Object.keys(processedBallots[proposal_id])[0];
									counted_weight = processedBallots[proposal_id][ballot_id].weight;
									vk = processedBallots[proposal_id][ballot_id].user_vk;
									if(Object.keys(counted_weight).length > 0){
									
										counted_weight = getNumberFromFixed(counted_weight)
									}
								}
							}
							
							let found = false;
							if(userArray.length > 0){
								for (let ent of userArray){
									if(ent.vk === vk){
										ent.proposals.push(proposal_id); 
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
									proposals: [proposal_id]
		
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
			
			if (Object.keys(rswpBalanceMeta).length > 0){
				const rswpBalances = rswpBalanceMeta.con_rswp_lst001.balances
				
				if (rswpBalances){
					const vks = Object.keys(rswpBalances)
					
					for (let vk of vks){
						let user_entity = await UserEntity.findOne({where: {vk: vk}});
						if (user_entity){
							user_entity.rswp_balance = getNumberFromFixed(rswpBalances[vk].__hash_self__);
							await user_entity.save();
						}
					}
				}

			}

			if (Object.keys(dexMeta).length > 0){
				const dexLp = dexMeta.con_rocketswap_official_v1_1.lp_points
				const dexStakedAmount = dexMeta.con_rocketswap_official_v1_1.staked_amount
				if(dexStakedAmount){
					const vks = Object.keys(dexStakedAmount)
					for (let vk of vks){
						let user_entity = await UserEntity.findOne({where: {vk: vk}});
						if (user_entity){
							
							user_entity.rocket_fuel = getNumberFromFixed(dexStakedAmount[vk].con_rswp_lst001);
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
										let proposal_entity = await ProposalEntity.findOne({where: { proposal_id: parseInt(p)}});
										if (proposal_entity){
											let lp_weight = proposal_entity.lp_weight;
											lp_value.push(getNumberFromFixed(dexLp.con_rswp_lst001[vk]) * lp_weight)	
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

			if (Object.keys(stakingMeta).length > 0){
				const staking = stakingMeta.con_staking_rswp_rswp_interop_v2.balances;
				if(staking){
					const vks = Object.keys(staking) //check if it contains stuff
					for (let vk of vks){
						let user_entity = await UserEntity.findOne({where: {vk: vk}});
						if (user_entity){
							user_entity.staked_rswp = getNumberFromFixed(staking[vk]);
							await user_entity.save();
						}
					}
				}
			}


			if (Object.keys(lpStakingMeta).length > 0){
				const lpStaking = lpStakingMeta.con_liq_mining_rswp_rswp.balances
				if(lpStaking){
					const vks = Object.keys(lpStaking)
					for (let vk of vks){
						let user_entity = await UserEntity.findOne({where: {vk: vk}});
						if (user_entity){
							let staked_lp_value = []
							for (let p of user_entity.proposals){
								let proposal_entity = await ProposalEntity.findOne({where: { proposal_id: parseInt(p)}});
								if (proposal_entity){
									let lp_weight = proposal_entity.lp_weight;
									staked_lp_value.push(getNumberFromFixed(lpStaking[vk])*lp_weight)	
								}
							}
							user_entity.staked_lp_value = Object.keys(staked_lp_value).length>0?staked_lp_value:user_entity.staked_lp_value;

							await user_entity.save();

						}
					}
					
				}
			}

		} catch(err){
			log.warn({ err })
		}
	}
	
	//blockservice data structure

	/* *
	con_lite_dao_test20

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