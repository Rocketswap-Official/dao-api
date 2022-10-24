import { BlockService } from "../services/block.service";
import { handleNewBlock, T_ParseBlockFn } from "../services/socket-client.provider";
import { log } from "./logger";

const axiosDefaultConfig = {
	proxy: false
};

const axios = require("axios").create(axiosDefaultConfig);

export const getVariableChanges = async (contractName: string, variableName: string, last_tx_uid: string | number, limit: number = 10) => {
	let endpoint = "variable_history";
	let query = [`contract=${contractName}`, `variable=${variableName}`, `last_tx_uid=${last_tx_uid}`, `limit=${limit}`].join("&");
	let res = await axios.get(`http://${BlockService.get_block_service_url()}/${endpoint}?${query}`);
	return res.data;
};

export const getCurrentKeyValue = async (contractName: string, variableName: string, key: string) => {
	try {
		let endpoint = "current/one";
		let res = await axios(`http://${BlockService.get_block_service_url()}/${endpoint}/${contractName}/${variableName}/${key}`);
		return res.data;
	} catch (e) {
		return e;
	}
};

export const getContractChanges = async (contractName: string, last_tx_uid: string, limit: number = 10) => {
	let endpoint = "contract_history";
	let query = [`contract=${contractName}`, `last_tx_uid=${last_tx_uid}`, `limit=${limit}`].join("&");
	let res = await axios(`http://${BlockService.get_block_service_url()}/${endpoint}?${query}`);
	return res.data;
};

export const getContractState = async (contractName: string) => {
	try {
		let endpoint = "current/all";
		// current/all/con_mint
		const url = `http://${BlockService.get_block_service_url()}/${endpoint}/${contractName}`;
		let res = await axios(url);
		return res.data;
	} catch (err) {
		log.warn(err);
	}
};

export const getRootKeyChanges = async (args: {
	contractName: string;
	variableName: string;
	root_key: string;
	last_tx_uid: number | string;
	limit: number;
}) => {
	try {
		const { contractName, variableName, root_key, last_tx_uid, limit } = args;
		let endpoint = "rootkey_history";
		let query = [
			`contract=${contractName}`,
			`variable=${variableName}`,
			`root_key=${root_key}`,
			`last_tx_uid=${last_tx_uid}`,
			`limit=${limit}`
		].join("&");
		let res = await axios.get(`http://${BlockService.get_block_service_url()}/${endpoint}?${query}`);
		return res.data;
	} catch (err) {
		log.warn(err);
	}
};

export async function getCurrentSyncedBlock() {
	const res = await axios.get(`http://${BlockService.get_block_service_url()}/latest_synced_block`);
	return res.data?.latest_synced_block;
}

export const getNumberFromFixed = (value: any) => (value.__fixed__ ? Number(value.__fixed__) : Number(value));

export const getAllContracts = async () => {
	const res = await axios.get(`http://${BlockService.get_block_service_url()}/contracts`);
	return res.data;
};

export const getContractSource = async (contract_name: string) => {
	const endpoint = "current/one";
	const res = await axios.get(`http://${BlockService.get_block_service_url()}/${endpoint}/${contract_name}/__code__`);
	return res.data;
};

export const getContractMeta = async (contract_name: string) => {
	const endpoint = "current/all";
	const res = await axios.get(`http://${BlockService.get_block_service_url()}/${endpoint}/${contract_name}`);
	return res.data;
};

export const getAllCurrentKeyValue = async (contract_name: string, variableName: string, key: string) => {
	const endpoint = "current/all";
	const res = await axios.get(`http://${BlockService.get_block_service_url()}/${endpoint}/${contract_name}/${variableName}/${key}`);
	return res.data;
};

export const getAllVariableStates = async (contract_name: string, variableName: string) => {
	const endpoint = "current/all";
	const res = await axios.get(`http://${BlockService.get_block_service_url()}/${endpoint}/${contract_name}/${variableName}`);
	return res.data;
};


export const examineTxState = (history: any[]) => {
	const price_affected = history.filter((hist) => hist.state_changes_obj?.con_rocketswap_official_v1_1?.prices);
	const methods = {};
	price_affected.forEach((hist) => {
		const tx_type = hist.txInfo.transaction.payload.function;
		if (!methods[tx_type]) {
			methods[tx_type] = 1;
		} else methods[tx_type]++;
	});
	const last_tx = price_affected[price_affected.length - 1];
	const last_tx_time = new Date(last_tx.txInfo.transaction.metadata.timestamp * 1000);
};


export async function getLatestSyncedBlock(): Promise<any> {
	const res = await axios(`http://${BlockService.get_block_service_url()}/latest_synced_block`);
	return res.data?.latest_synced_block;
}


export async function getBlock(num: number): Promise<any> {
	const res = await axios(`http://${BlockService.get_block_service_url()}/blocks/${num}`);	
	return res.data
}


export async function fillBlocksSinceSync(block_to_sync_from: number, parseBlock: T_ParseBlockFn): Promise<void> {
	try {
		let current_block = await getLatestSyncedBlock();
		if (block_to_sync_from === current_block) {
			log.log("Finished syncing historical blocks");
			return;
		}
		let next_block_to_sync = block_to_sync_from + 1;
		//const block = await getBlock(next_block_to_sync)
		//await handleNewBlock(block,parseBlock)
		if (next_block_to_sync <= current_block) return await fillBlocksSinceSync(next_block_to_sync, parseBlock);
	} catch (err) {
		log.warn({ err });
	}
}

