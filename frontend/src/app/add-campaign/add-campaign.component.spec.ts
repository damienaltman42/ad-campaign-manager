import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AddCampaignComponent } from './add-campaign.component';
import { CampaignService } from '../campaign.service';

describe('AddCampaignComponent', () => {
  let component: AddCampaignComponent;
  let fixture: ComponentFixture<AddCampaignComponent>;
  let campaignService: jasmine.SpyObj<CampaignService>;
  let router: Router;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CampaignService', ['addCampaign']);
    spy.addCampaign.and.returnValue(of('campaign-1'));

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [ AddCampaignComponent ],
      providers: [
        { provide: CampaignService, useValue: spy }
      ]
    }).compileComponents();

    campaignService = TestBed.inject(CampaignService) as jasmine.SpyObj<CampaignService>;
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.campaignForm.get('id')?.value).toBe('');
    expect(component.campaignForm.get('startDate')?.value).toBe('');
    expect(component.campaignForm.get('endDate')?.value).toBe('');
    expect(component.campaignForm.get('targetImpressions')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const form = component.campaignForm;
    expect(form.valid).toBeFalsy();
    
    form.controls['id'].setValue('test-1');
    form.controls['startDate'].setValue('2023-12-01T10:00');
    form.controls['endDate'].setValue('2023-12-02T10:00');
    form.controls['targetImpressions'].setValue(1000);
    
    expect(form.valid).toBeTruthy();
  });

  it('should validate targetImpressions minimum value', () => {
    const control = component.campaignForm.controls['targetImpressions'];
    
    control.setValue(0);
    expect(control.errors?.['min']).toBeTruthy();
    
    control.setValue(1);
    expect(control.errors).toBeNull();
  });

  it('should submit valid form data', fakeAsync(() => {
    spyOn(router, 'navigate');
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    component.campaignForm.patchValue({
      id: 'test-1',
      startDate: now.toISOString().slice(0, 16),
      endDate: tomorrow.toISOString().slice(0, 16),
      targetImpressions: 1000
    });

    component.onSubmit();
    tick();

    expect(campaignService.addCampaign).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/campaigns']);
  }));

  it('should handle API error on submit', fakeAsync(() => {
    spyOn(console, 'error');
    campaignService.addCampaign.and.returnValue(throwError(() => new Error('API Error')));
    
    component.campaignForm.patchValue({
      id: 'test-1',
      startDate: '2023-12-01T10:00',
      endDate: '2023-12-02T10:00',
      targetImpressions: 1000
    });

    component.onSubmit();
    tick();

    expect(console.error).toHaveBeenCalledWith('Error adding campaign:', jasmine.any(Error));
  }));

  it('should not submit invalid form', fakeAsync(() => {
    component.onSubmit();
    tick();
    
    expect(campaignService.addCampaign).not.toHaveBeenCalled();
  }));
});