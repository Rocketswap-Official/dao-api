import { io } from "socket.io-client";
import { updateLastBlock } from "../entities/last-block.entity";
import { IKvp } from "../types/types";
import { log } from "../utils/logger";
import { BlockService } from "./block.service";

let init = false;

export function initSocket(parseBlockFn: T_ParseBlockFn) {
	const block_service_url = `http://${BlockService.get_block_service_url()}`;
	const socket = io(block_service_url, {
		reconnectionDelayMax: 10000
	});
	socket.on("connect", () => {
		log.log(`Connected to Blockservice via socket.io @ ${block_service_url}`);
		log.log({ init });
		if (!init) {
			socket.emit("join", "new-block");

			socket.on("new-block", async (payload) => {
				const parsed: IBsSocketBlockUpdate = JSON.parse(payload);
				const bs_block = parsed.message;
				await handleNewBlock(bs_block, parseBlockFn);
			});
			init = true;
		}
	});

	socket.io.on("reconnect", (attempt) => {
		log.log({ attempt });
	});

	socket.io.on("reconnect_attempt", (attempt) => {
		log.log({ attempt });
	});

	socket.io.on("error", (error) => {
		log.log({ error })
	});
}

export async function handleNewBlock(block: IBsBlock, parseBlockFn: T_ParseBlockFn) {

	const has_transaction = block.subblocks.length && block.subblocks[0].transactions.length;

	if (!has_transaction) return;
	const { subblocks, number: block_num } = block;
	for (let sb of subblocks) {
		const { transactions } = sb;
		for (let t of transactions) {
			const { state, hash, transaction } = t;
			const fn = transaction.payload.function;
			const contract  = transaction.payload.contract;
			const timestamp  = transaction.metadata.timestamp;
			const block_obj: BlockDTO = { state, hash, fn, contract, timestamp };

			if (Object.keys(state)?.length) {
				await parseBlockFn(block_obj);
			}
		}
	}
	
	await updateLastBlock({ block_num });
}

export class BlockDTO {
	state: IKvp[];
	fn: string;
	contract: string;
	timestamp: number;
	hash: string;
	block_num?: number;
}

 export interface IBsSocketBlockUpdate {
 	message: IBsBlock;
}

export interface IBsBlock {
	hash: string;
	number: number;
	previous: string;
	subblocks: IBsSubBlock[];
}

export interface IBsSubBlock {
	input_hash: string;
	merkle_leaves: string[];
	signatures: ISignature[];
	subblock: number;
	transactions: ITransaction[];
}

export interface ISignature {
	signature: string;
	signer: string;
}

export interface ITransaction {
	hash: string;
	result: string;
	stamps_user: number;
	state: IKvp[];
	status: number;
	transaction: ITransactionInner;
}

export interface ITransactionInner {
	metadata: any;
	payload: any;
}

export type T_ParseBlockFn = (args: BlockDTO) => Promise<any>;
