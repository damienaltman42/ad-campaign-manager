import { Test, TestingModule } from '@nestjs/testing';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { Campaign } from './interfaces/campaign.interface';

describe('CampaignsController', () => {
  let controller: CampaignsController;
  let service: CampaignsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignsController],
      providers: [
        {
          provide: CampaignsService,
          useValue: {
            addCampaign: jest.fn(),
            getCampaigns: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CampaignsController>(CampaignsController);
    service = module.get<CampaignsService>(CampaignsService);
  });

  describe('addCampaign', () => {
    it('should create a new campaign', async () => {
      const campaign: Campaign = {
        id: 'test-1',
        startDate: Date.now(),
        endDate: Date.now() + 86400000,
        targetImpressions: 1000,
      };

      jest.spyOn(service, 'addCampaign').mockResolvedValue(campaign.id);

      const result = await controller.addCampaign(campaign);
      expect(result).toBe(campaign.id);
      expect(service.addCampaign).toHaveBeenCalledWith(campaign);
    });

    it('should handle errors when creating campaign', async () => {
      const campaign: Campaign = {
        id: 'test-1',
        startDate: Date.now(),
        endDate: Date.now() + 86400000,
        targetImpressions: 1000,
      };

      jest
        .spyOn(service, 'addCampaign')
        .mockRejectedValue(new Error('API Error'));

      await expect(controller.addCampaign(campaign)).rejects.toThrow(
        'API Error',
      );
    });
  });

  describe('getCampaigns', () => {
    it('should return an array of campaigns', async () => {
      const campaigns: Campaign[] = [
        {
          id: 'test-1',
          startDate: Date.now(),
          endDate: Date.now() + 86400000,
          targetImpressions: 1000,
        },
      ];

      jest.spyOn(service, 'getCampaigns').mockResolvedValue(campaigns);

      const result = await controller.getCampaigns();
      expect(result).toEqual(campaigns);
      expect(service.getCampaigns).toHaveBeenCalled();
    });

    it('should handle errors when fetching campaigns', async () => {
      jest
        .spyOn(service, 'getCampaigns')
        .mockRejectedValue(new Error('API Error'));

      await expect(controller.getCampaigns()).rejects.toThrow('API Error');
    });
  });
});
