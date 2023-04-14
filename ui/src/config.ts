import type {
	I_ProposalInfo,
	I_CountObj,
	I_TransactionObj,
	I_BallotInfo,
	I_RSWPApprovalInfo
} from './lib/types/imported-types';

export const contracts = {
	rswp: 'con_rswp_lst001',
	dao: 'con_lite_dao_test'
};

export const blockserviceUrls = {
	testnet: [
		'testnet-v2-bs-lon.lamden.io',
		'testnet-v2-bs-sf.lamden.io',
		'testnet-v2-bs-bang.lamden.io'
	],
	mainnet: ['arko-bs-1.lamden.io', 'arko-bs-2.lamden.io', 'arko-bs-3.lamden.io']
};

export const arkoUrls = {
	testnet: '',
	mainnet: ''
};

export const apiUrl = 'localhost:2001';

export const connectionRequest = {
	appName: 'Lite DAO',
	version: '1.0.0',
	logo: 'dao.svg',
	contractName: contracts.dao,
	networkType: 'mainnet',
	networkName: 'arko'
};

export let proposalInfo: I_ProposalInfo = {
	title: '',
	description: '',
	date_decision: '',
	choices: []
};

export let ballotInfo: I_BallotInfo = {
	proposal_idx: '',
	choice_idx: ''
};

export let RSWPApprovalInfo: I_RSWPApprovalInfo = {
	amount: 0,
	to: ''
};

export let CounInfo = {
	proposal_idx: 0
};

export let proposalTxnInfo: I_TransactionObj = {
	networkName: 'arko',
	networkType: 'mainnet',
	methodName: 'create_proposal',
	kwargs: proposalInfo,
	stampLimit: 100
};

export let ballotTxnInfo: I_TransactionObj = {
	networkName: 'arko',
	networkType: 'mainnet',
	methodName: 'cast_ballot',
	kwargs: ballotInfo,
	stampLimit: 100
};

export let countTxnInfo: I_TransactionObj = {
	networkName: 'arko',
	networkType: 'mainnet',
	methodName: 'create_proposal',
	kwargs: CounInfo,
	stampLimit: 100 //TODO: we need a good estimate for stamps
};

export let RswpApprovalTxnInfo: I_TransactionObj = {
	contractName: 'con_rswp_lst001',
	networkName: 'arko',
	networkType: 'mainnet',
	methodName: 'approve',
	kwargs: RSWPApprovalInfo,
	stampLimit: 100
};

export const walletError = {
	authError: `You must be an authorized dApp to send this message type. Send 'lamdenWalletConnect' event first to authorize.`,
	existError: `contractName: '${connectionRequest.contractName}' does not exists on '${connectionRequest.networkType}' network.`
};

export const toastWalletMessage = {
	existError: 'dapp contract does not exist or check your internet',
	initialiseError: 'Connection request not initialised!',
	installError: 'Install Wallet'
};
