import axios from 'axios';
import { apiUrl, contracts, blockserviceUrls } from '../../config';
import {
	proposals_store,
	users_store,
	choice_array_store,
	balances_store,
	rswp_approval_store
} from '../store';
import { get } from 'svelte/store';
import type { I_Proposal, I_User, I_Choice } from '../types/imported-types';
//Mock Data
//import proposals from '../mock-data/proposals.json'
//import users from '../mock-data/users.json'

const selectBlockservice = () => {
	const min = Math.ceil(0);
	const max = Math.floor(2);
	let index = Math.floor(Math.random() * (max - min + 1) + min);
	return blockserviceUrls.mainnet[index];
};

export const syncProposals = async () => {
	try {
		const proposals = (await axios.get(`http://${apiUrl}/proposals/all_proposals`))
			.data as I_Proposal[];
		// const proposals = []
		proposals_store.set(proposals);
		// return proposals;
	} catch (err) {
		console.log(err);
	}
};

export const syncUsers = async () => {
	try {
		const users = (await axios.get(`http://${apiUrl}/users`)).data as I_User[];
		// const users = []
		users_store.set(users);
		// return users;
	} catch (err) {
		console.log(err);
	}
};

export const checkVerified = async (proposal: I_Proposal, proposalChoices: I_Choice[]) => {
	let verified = proposal.verified;
	let results = proposal.results;
	let total = 0;
	//check for verified state here
	if (verified === 'true') {
		const choice_idx = Object.keys(results);

		for (let idx of choice_idx) {
			total += results[idx]; //could be an object with __fixed__ key
		}
		for (let choice of proposalChoices) {
			let vw: number = choice.voteWeight;
			choice.voteWeight = parseFloat(((vw / total) * 100).toFixed(2));
			if (vw === 0 || total === 0) {
				choice.voteWeight = 0;
			}
		}
	}

	return proposalChoices;
};

export const initSyncDaoData = async () => {
	await Promise.all([await syncProposals(), await syncUsers()]);

	const proposals: I_Proposal[] = get(proposals_store);
	const users: I_User[] = get(users_store);

	let choiceArray: any = [];
	let proposalChoices: I_Choice[] = [];

	if (proposals.length > 0) {
		// LEVEL 4
		for (let proposal of proposals) {
			let choices: string[] = proposal.choices;

			let total = 0;
			let choiceIndex = 0;
			// LEVEL 3
			for (let s of choices) {
				proposalChoices.push({
					proposalId: proposal.proposal_id,
					choiceIdx: choiceIndex,
					choice: s,
					voteWeight: 0,
					total: total
				});
				choiceIndex += 1;
			}

			if (Object.keys(users).length > 0) {
				// LEVEL 2
				for (let u of users) {
					// LEVEL 1
					for (let up of u.proposals) {
						//up type is string
						let upp: number = parseInt(up);
						if (upp === proposal.proposal_id) {
							//proposal.proposal_id type is number
							let indx = u.proposals.indexOf(up);
							let c = u.choice_idx[indx];
							const weights = [
								u.rswp_balance,
								u.rocket_fuel,
								u.staked_rswp,
								u.staked_lp_value ? parseFloat(u.staked_lp_value[indx]) : 0,
								Object.is(u.lp_value, null) ? 0 : parseFloat(u.staked_lp_value[indx])
							];
							let cWeight = weights.reduce((a, b) => {
								Number.isNaN(a) ? 0 : a;
								return a + b;
							});

							// LEVEL 0
							for (let uc of proposalChoices) {
								if (uc.choiceIdx === parseInt(c)) {
									uc.voteWeight += cWeight;
									uc.vk = u.vk;
								}
							}
							// LEVEL 0
							total += cWeight;
						}
					}
					// LEVEL 1
				}
				// LEVEL 2

				for (let uc of proposalChoices) {
					let vw: any = uc.voteWeight;

					uc.voteWeight = parseFloat(((vw / total) * 100).toFixed(2));
					if (vw === 0 || total === 0) {
						uc.voteWeight = 0;
					}
					uc.total = total;
				}
				// LEVEL 2
			}
			// LEVEL 3

			proposalChoices = await checkVerified(proposal, proposalChoices);
			choiceArray.push(proposalChoices);
			proposalChoices = [];
			// proposals[proposals.indexOf(proposal)] = proposal.date_decision.__time__ as const
		}
		// LEVEL 4
		choice_array_store.set(choiceArray);

		return [proposals, choiceArray];
	}

	return [];
};

export const filterProposals = async (state: string) => {
	const processedData = await initSyncDaoData();
	if (processedData.length > 0) {
		const [proposals, choiceArray] = processedData;
		if (proposals.length > 0 && choiceArray.length > 0) {
			let filteredProposals: any[] = [];
			let filteredChoice: any[] = [];

			for (let p of proposals) {
				if (p.state === state) {
					filteredProposals.push(p);
					filteredChoice.push(choiceArray[proposals.indexOf(p)]);
				}
			}
			return [filteredProposals, filteredChoice];
		} else {
			return [];
		}
	} else {
		return [];
	}
};

export const isAnyProposalCounted = (proposal): boolean => {
	if (proposal.state === 'open' && proposal.counted === false) return false;
	return true;
};

//remove this function to an appropriate place
const get_fixed_value = (obj: any) => {
	let value: number;
	if (obj === null) return 0;
	obj.__fixed__ ? (value = parseFloat(obj.__fixed__)) : (value = parseFloat(obj));
	return value;
};

export const getTauBalance = async (vk: string) => {
	try {
		const balance: any = (
			await axios.get(`https://${selectBlockservice()}/current/one/currency/balances/${vk}`)
		).data;

		balances_store.set({ TAU: get_fixed_value(balance.value) });
	} catch (err) {
		console.log(err);
	}
};

export const getApprovalBalance = async (vk: string) => {
	try {
		const rswp_approval_amount = (
			await axios.get(
				`https://${selectBlockservice()}/current/one/${contracts.rswp}/balances/${vk}:${
					contracts.dao
				}`
			)
		).data;

		rswp_approval_store.set(get_fixed_value(rswp_approval_amount.value));
	} catch (err) {
		console.log(err);
	}
};
