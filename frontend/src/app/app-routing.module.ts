import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCampaignComponent } from './add-campaign/add-campaign.component';
import { CampaignListComponent } from './campaign-list/campaign-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/campaigns', pathMatch: 'full' },
  { path: 'campaigns', component: CampaignListComponent },
  { path: 'add-campaign', component: AddCampaignComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }