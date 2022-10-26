import { Controller, Get, Query, Param } from '@nestjs/common';
import { ProposalService, UserService } from './app.service';
import { ProposalEntity } from './entities/proposal.entity';
import { I_Proposal } from './types/shared-types';

@Controller('proposals')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) { }

  //return all proposals
  // @Get()
  // async getProposals(): Promise<ProposalEntity[]> {
  //   return await this.proposalService.getProposals();
  // }

  @Get('all_proposals')
  async getAllProposals(): Promise<ProposalEntity[]> {
    return await this.proposalService.getProposals();
  }

  // return only proposals with open state
  @Get('open')
  getOpenedProposals(): object {
    return this.proposalService.getOpenProposals();
  }

  // return only proposals with concluded state
  @Get('concluded')
  getClosedProposals(): any {
    return this.proposalService.getConcludedProposals();
  }

  @Get('verified')
  getVerifiedProposals(): any {
    return this.proposalService.getVerifiedProposals();
  }

  // return latest proposal
  @Get('latest')
  getLatestProposal(): any {
    return this.proposalService.getLatestProposal();

  }

  // return a specific proposal by id
  @Get(':id')
  getProposal(@Param() param): any {
    if (isNaN(param.id) === false) {
      const id = parseInt(param.id)
      return this.proposalService.getProposal(id);
    }


  }

}

// router for user related stuff
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  getUsers(): object {
    return this.userService.getUsers();
  }

  @Get(':vk')
  getUser(@Param() param): object {
    //console.log(vk)
    return this.userService.getUser(param.vk);
  }

}




