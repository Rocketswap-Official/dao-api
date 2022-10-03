import { Controller, Get, Query, Param} from '@nestjs/common';
import { ProposalService, UserService } from './app.service';

@Controller('proposals')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService){}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  //retrieve all proposals
  @Get()
  getProposals(): object {
    return this.proposalService.getProposals();
    //return 'getProposals'
  }

  // retrieve only proposals of open state
  @Get('open')
  getOpenedProposals(): object {
    return this.proposalService.getOpenProposals();
    //return 'getOpenedProposals'
  }

  // retrieve only proposals of close state
  @Get('concluded')
  getClosedProposals(): object {
    return this.proposalService.getCloseProposals();
    //return 'getClosedProposals'
  }

  // retrieve a specific proposal in descending order
  @Get()
  getLatestProposals(@Query('id') id: number, ): object {
    return this.proposalService.getProposal(id);
    //return {limit};
    
  }
  
}

// router for user related stuff
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService){}
  
  @Get()
  getUser(@Query('vk') vk: string): object {
    return this.userService.getUser(vk);
  }

  @Get()
  getUsers(): object {
    return this.userService.getUsers();
  }

}

  
