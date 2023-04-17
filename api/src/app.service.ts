import { Injectable } from '@nestjs/common';
import { ProposalEntity } from './entities/proposal.entity'
import { UserEntity } from './entities/user.entity'
import { I_Proposal } from './types/shared-types';

@Injectable()
export class ProposalService {

  async getProposals(): Promise<ProposalEntity[]> {
    return await ProposalEntity.find()
  }

  async getOpenProposals(): Promise<any> {
    return await ProposalEntity.find({ where: { state: "open" } })
  }

  async getConcludedProposals(): Promise<any> {
    return await ProposalEntity.find({ where: { state: "concluded" } })
  }

  async getVerifiedProposals(): Promise<any> {
    return await ProposalEntity.find({ where: { verified: true } })
  }

  async getLatestProposal(): Promise<any> {
    return await ProposalEntity.find({
      order: { proposal_id: "DESC" },
      take: 1
    })
  }

  async getProposal(id: number): Promise<any> {
    return await ProposalEntity.find({ where: { proposal_id: id } })
  }

}

@Injectable()
export class UserService {
  async getUser(vk: string): Promise<object> {
    return await UserEntity.find({ where: { vk: vk } });
  }

  async getUsers(): Promise<object> {
    return await UserEntity.find();
  }
}

