import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CampaignsModule } from './campaigns/campaigns.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CampaignsModule,
  ],
})
export class AppModule {}