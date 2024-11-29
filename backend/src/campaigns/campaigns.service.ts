import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Campaign } from './interfaces/campaign.interface';
import { API_CONFIG } from './config/api.config';
import { createCampaignFormData } from './utils/http.utils';

@Injectable()
export class CampaignsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private getHeaders() {
    return {
      'X-API-Key': this.configService.get('API_KEY'),
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  }

  async addCampaign(campaign: Campaign): Promise<string> {
    const response = await firstValueFrom(
      this.httpService.post(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.campaigns}`,
        createCampaignFormData(campaign),
        { headers: this.getHeaders() },
      ),
    );

    return response.data;
  }

  async getCampaigns(): Promise<Campaign[]> {
    const response = await firstValueFrom(
      this.httpService.get(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.allCampaigns}`,
        { headers: this.getHeaders() },
      ),
    );

    return response.data;
  }
}