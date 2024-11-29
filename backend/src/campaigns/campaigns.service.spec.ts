import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CampaignsService } from './campaigns.service';
import { Campaign } from './interfaces/campaign.interface';
import { of, throwError } from 'rxjs';
import { API_CONFIG } from './config/api.config';
import { AxiosResponse } from 'axios';

describe('CampaignsService', () => {
  let service: CampaignsService;
  let httpService: HttpService;
  let configService: ConfigService;

  const mockApiKey = 'test-api-key';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignsService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(mockApiKey),
          },
        },
      ],
    }).compile();

    service = module.get<CampaignsService>(CampaignsService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('addCampaign', () => {
    it('should successfully add a campaign', async () => {
      const campaign = {
        id: 'test-1',
        startDate: Date.now(),
        endDate: Date.now() + 86400000,
        targetImpressions: 1000,
      };

      const expectedResponse: AxiosResponse = {
        data: campaign.id,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
      };
      jest.spyOn(httpService, 'post').mockReturnValue(of(expectedResponse));

      const result = await service.addCampaign(campaign);

      expect(result).toBe(campaign.id);
      expect(httpService.post).toHaveBeenCalledWith(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.campaigns}`,
        expect.any(Object),
        expect.objectContaining({
          headers: {
            'X-API-Key': mockApiKey,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );
    });

    it('should handle errors when adding a campaign', async () => {
      const campaign: Campaign = {
        id: 'test-1',
        startDate: Date.now(),
        endDate: Date.now() + 86400000,
        targetImpressions: 1000,
      };

      jest
        .spyOn(httpService, 'post')
        .mockReturnValue(throwError(() => new Error('API Error')));

      await expect(service.addCampaign(campaign)).rejects.toThrow('API Error');
    });
  });

  describe('getCampaigns', () => {
    it('should successfully retrieve campaigns', async () => {
      const mockCampaigns: Campaign[] = [
        {
          id: 'test-1',
          startDate: Date.now(),
          endDate: Date.now() + 86400000,
          targetImpressions: 1000,
        },
      ];

      const expectedResponse = {
        data: mockCampaigns,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
      };
      jest.spyOn(httpService, 'get').mockReturnValue(of(expectedResponse));

      const result = await service.getCampaigns();

      expect(result).toEqual(mockCampaigns);
      expect(httpService.get).toHaveBeenCalledWith(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.allCampaigns}`,
        expect.objectContaining({
          headers: {
            'X-API-Key': mockApiKey,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );
    });

    it('should handle errors when retrieving campaigns', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(throwError(() => new Error('API Error')));

      await expect(service.getCampaigns()).rejects.toThrow('API Error');
    });
  });
});
