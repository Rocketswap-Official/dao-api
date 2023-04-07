import { io } from "socket.io-client";
import { updateLastBlock } from "../entities/last-block.entity";
import { IKvp } from "../types/types";
import { log } from "../utils/logger";
import { BlockService } from "./block.service";

let init = false;

export function initSocket(parseBlockFn: T_ParseBlockFn) {
	const block_service_url = `https://${BlockService.get_block_service_url()}`;
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

	// const has_transaction = block.subblocks.length && block.subblocks[0].transactions.length;
	const has_transaction = Object.keys(block.processed).length > 0 && Object.keys(block.processed.transaction).length > 0;

	if (!has_transaction) return;
	// const { subblocks, number: block_num } = block;
	// for (let sb of subblocks) {
	// 	const { transactions } = sb;
	// 	for (let t of transactions) {
	// 		const { state, hash, transaction } = t;
	// 		const fn = transaction.payload.function;
	// 		const contract  = transaction.payload.contract;
	// 		const timestamp  = transaction.metadata.timestamp;
	// 		const block_obj: BlockDTO = { state, hash, fn, contract, timestamp };

	// 		if (Object.keys(state)?.length) {
	// 			await parseBlockFn(block_obj);
	// 		}
	// 	}
	// }
	const { processed, number: block_num } = block;
	const { state, hash, transaction } = processed
	const fn = transaction.payload.function;
	const contract  = transaction.payload.contract;
	const block_obj: BlockDTO = { state, hash, fn, contract };

	if (Object.keys(state)?.length) {
		await parseBlockFn(block_obj);
	}

	await updateLastBlock({ block_num });
}

// export class BlockDTO {
// 	state: IKvp[];
// 	fn: string;
// 	contract: string;
// 	timestamp: number;
// 	hash: string;
// 	block_num?: number;
// }

export class BlockDTO {
	state: IKvp[];
	fn: string;
	contract: string;
	// timestamp: number;
	hash: string;
	block_num?: number;
}

 export interface IBsSocketBlockUpdate {
 	message: IBsBlock;
}

// export interface IBsBlock {
// 	hash: string;
// 	number: number;
// 	previous: string;
// 	subblocks: IBsSubBlock[];
// }

export interface IBsMinted{
	minter: string;
	signature: string;
}

export interface IProofs{
	signature: string;
	signer: string;
}

export interface IProcessed {
	hash: string;
	result: string;
	stamps_used: number;
	state: IKvp[];
	status: number;
	transaction: ITransactionInner;
}

export interface IRewards {
	key: string;
	value: any;
	reward: any;
}

export interface IOrigin{
	signature: string;
	sender: string;
}

export interface IBsBlock {
	hash: string;
	number: number;
	hlc_timestamp: string;
	previous: string;
	minted: IBsMinted;
	proofs: IProofs[];
	processed: IProcessed;
	rewards: IRewards[];
	origin: IOrigin;
}

// export interface IBsSubBlock {
// 	input_hash: string;
// 	merkle_leaves: string[];
// 	signatures: ISignature[];
// 	subblock: number;
// 	transactions: ITransaction[];
// }

// export interface ISignature {
// 	signature: string;
// 	signer: string;
// }

// export interface ITransaction {
// 	hash: string;
// 	result: string;
// 	stamps_user: number;
// 	state: IKvp[];
// 	status: number;
// 	transaction: ITransactionInner;
// }


export interface ITransactionInner {
	metadata: any;
	payload: any;
}

export type T_ParseBlockFn = (args: BlockDTO) => Promise<any>;
