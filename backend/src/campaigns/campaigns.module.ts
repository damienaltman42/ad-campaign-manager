import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';

@Module({
  imports: [HttpModule],
  controllers: [CampaignsController],
  providers: [CampaignsService],
})
export class CampaignsModule {}