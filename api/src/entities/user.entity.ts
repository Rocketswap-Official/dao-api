import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from "typeorm";
//import { I_OhlcData, T_Resolution } from "../types";


@Entity()
//export class CandleEntity extends BaseEntity implements I_OhlcData {
export class UserEntity extends BaseEntity{    
    @PrimaryGeneratedColumn()
    id: number;

    //@Column()
    //proposal_id: number;  //do we need this column?

    @Column({nullable: true})
    vk: string;

    @Column({type: "simple-array", nullable: true})
    ballot_idx: string[];

    @Column({type: "simple-array", nullable: true})
    choice_idx: string[]

    @Column({type: "simple-array", nullable: true })
    weight: string[]

    @Column({type: "simple-array", nullable: true })
    proposals: string[]

    @Column({ default: 0 })
    rswp_balance: number;

    @Column({ default: 0 })
    rocket_fuel: number;

    @Column({ default: 0 })
    staked_rswp: number;

    @Column({type: "simple-array", nullable: true })
    staked_lp_value: string[];

    @Column({type: "simple-array", nullable: true })
    lp_value: string[];
}