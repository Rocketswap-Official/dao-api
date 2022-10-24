import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, PrimaryColumn} from "typeorm";
import { log } from "../utils/logger";

@Entity()
export class LastBlockEntity extends BaseEntity {
	@PrimaryColumn()
	id: number;

	@Column({ unique: true })
	last_block: number;
}

export async function updateLastBlock(args: { block_num: number }) {
	const { block_num } = args;
	let entity = await LastBlockEntity.findOne({ where: { last_block: block_num}})
	if(!entity){
		let entity_new = new LastBlockEntity()
		entity_new.last_block = block_num;
		await entity_new.save();
		log.log(`saved block_num: ${block_num}`);	
	}

	// try {
	// 	const { block_num } = args;
	// 	let entity = new LastBlockEntity();
	// 	entity.last_block = block_num;
	// 	await entity.save();
	// 	log.log(`saved block_num: ${block_num}`);
	// } catch (err) {
	// 	log.warn({ err });
	// }
}

export async function getLastProcessedBlock() {
	const last_block_num = await LastBlockEntity.find({
		order: { last_block: "DESC" },
		take: 1
	})[0]

	if(!last_block_num) return 0;
	return last_block_num;
	
}

export async function startTrimLastBlocksTask() {
	setInterval(async () => {
		const blocks = await LastBlockEntity.find({
			order: { last_block: "DESC" }
		});
		if (blocks.length > 1) {
			for (let i = 1; i <= blocks.length; i++) {
				if (blocks[i]) {
					await blocks[i].remove();
				}
			}
		}
	}, 1000000);
}
