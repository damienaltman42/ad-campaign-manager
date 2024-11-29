import { Controller, Post, Get, Body } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { Campaign } from './campaign.interface';

@Controller('api')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post('add-campaign')
  async addCampaign(@Body() campaign: Campaign): Promise<string> {
    return this.campaignsService.addCampaign(campaign);
  }

  @Get('get-campaigns')
  async getCampaigns(): Promise<Campaign[]> {
    return this.campaignsService.getCampaigns();
  }
}
