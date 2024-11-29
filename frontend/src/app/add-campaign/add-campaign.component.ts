import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CampaignService } from '../campaign.service';

@Component({
  selector: 'app-add-campaign',
  templateUrl: './add-campaign.component.html',
  styleUrls: ['./add-campaign.component.css']
})
export class AddCampaignComponent {
  campaignForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private campaignService: CampaignService,
    private router: Router
  ) {
    this.campaignForm = this.fb.group({
      id: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      targetImpressions: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.campaignForm.valid) {
      const formValue = this.campaignForm.value;
      const campaign = {
        ...formValue,
        startDate: new Date(formValue.startDate).getTime(),
        endDate: new Date(formValue.endDate).getTime()
      };

      this.campaignService.addCampaign(campaign).subscribe(
        () => {
          this.router.navigate(['/campaigns']);
        },
        error => {
          console.error('Error adding campaign:', error);
        }
      );
    }
  }
}