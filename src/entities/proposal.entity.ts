import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from "typeorm";
//import { I_OhlcData, T_Resolution } from "../types";


@Entity()
//export class CandleEntity extends BaseEntity implements I_OhlcData {
export class ProposalEntity extends BaseEntity{    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    proposal_id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column("simple-json")
    date_decision: {__time__: string};

    @Column("simple-array")
    choices: []

    @Column()
    state: string;

    @Column({ default: 0 })
    ballot_count: number

    @Column({ nullable: true })
    counted: boolean

    @Column({ nullable: true })
    verified: boolean

    @Column("simple-json")
    results: {}
}