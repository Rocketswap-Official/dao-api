import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
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
    choices: [];

    @Column()
    state: string;

    @Column({ default: 0 })
    ballot_count: number;

    @Column({ default: "false"})
    counted: string;

    @Column({ default: "false" })
    verified: string;

    @Column({ default: 0 })
    lp_weight: number;

    @Column("simple-json")
    results: {};
}