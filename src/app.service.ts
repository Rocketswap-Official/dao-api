import { Injectable } from '@nestjs/common';
import { ProposalEntity } from './entities/proposal.entity'
import { UserEntity } from './entities/user.entity'
import { UserVoteEntity } from './entities/userVote.entity'

@Injectable()
export class ProposalService {

  async getProposals(): Promise<any> {
    return await ProposalEntity.find()
  }

  async getOpenProposals(): Promise<any> {
    return await ProposalEntity.find({ where: { state: "open" } })
  }

  async getCloseProposals(): Promise<any> {
    return await ProposalEntity.find({ where: { state: "concluded" } })
  }

  async getProposal( id: number): Promise<any> {
    return await ProposalEntity.find({ where: { proposal_id: id } })
    // return await ProposalEntity.find({
    //   order: {proposal_id: "DESC"}, 
    //   take: limit
    // })
  }

}

@Injectable()
export class UserService {
  async getUser(vk: string): Promise<object> {
    const entity = await UserEntity.findOne({ where: { vk : vk}});
    return {
      vk: entity.vk,
      ballot_idx: entity.ballot_idx,
      choice_idx: entity.choice_idx,
      proposals: entity.proposals
      
    }
  }

  async getUsers(): Promise<object> {
    
    return await UserEntity.find()
  }
}

