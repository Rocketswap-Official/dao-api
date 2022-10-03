import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from "typeorm";
//import { I_OhlcData, T_Resolution } from "../types";


@Entity()
//export class CandleEntity extends BaseEntity implements I_OhlcData {
export class VerifiedEntity extends BaseEntity{    
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ unique: true})
    proposal_id: number;

    @Column({ default: 0 })  //processed
    ballot_count: number;

    @Column({ default: false }) //processed
    ballot_counted: boolean

    @Column({ default: false })  //verified
    ballot_verified: boolean

    @Column("simple-json")  //verified
    choice_weight: {}


}