import { Module } from '@nestjs/common';
import { ProposalController, UserController } from './app.controller';
import { ProposalService, UserService } from './app.service';
import { DataSyncProvider } from './services/data-sync.provider';
import { BlockService } from './services/block.service';
import { ProposalEntity } from './entities/proposal.entity'
import { UserEntity } from './entities/user.entity';
import { UserVoteEntity } from './entities/userVote.entity'
import { LastBlockEntity } from './entities/last-block.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [ProposalEntity, UserEntity, LastBlockEntity],
      //shouldn't be used in production
      synchronize: true,
      autoLoadEntities: true
    })
  ],
  controllers: [ProposalController, UserController],
  providers: [ProposalService, UserService, DataSyncProvider, BlockService, ]
})
export class AppModule {}
