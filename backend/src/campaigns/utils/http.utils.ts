import { Campaign } from '../interfaces/campaign.interface';

export const createCampaignFormData = (campaign: Campaign): any => ({
  id: campaign.id,
  startDate: campaign.startDate,
  endDate: campaign.endDate,
  targetImpressions: campaign.targetImpressions,
});
