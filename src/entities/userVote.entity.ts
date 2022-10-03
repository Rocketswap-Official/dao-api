import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from "typeorm";
//import { I_OhlcData, T_Resolution } from "../types";


@Entity()
//export class CandleEntity extends BaseEntity implements I_OhlcData {
export class UserVoteEntity extends BaseEntity{    
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ unique: true})
    proposal_id: number;

    @Column()
    vk: string ;

    @Column({nullable: true})
    choice_id:  number | null;

    @Column()
    ballot_id: number;

    @Column({default: 0})
    counted_weight: number;
}