import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { CampaignListComponent } from './campaign-list.component';
import { CampaignService } from '../campaign.service';
import { of, throwError } from 'rxjs';
import { Campaign } from '../campaign.service';

describe('CampaignListComponent', () => {
  let component: CampaignListComponent;
  let fixture: ComponentFixture<CampaignListComponent>;
  let campaignService: jasmine.SpyObj<CampaignService>;

  const mockCampaigns: Campaign[] = [
    {
      id: 'campaign-1',
      startDate: 1701216000000, // 2023-11-29
      endDate: 1701302400000,   // 2023-11-30
      targetImpressions: 1000
    },
    {
      id: 'campaign-2',
      startDate: 1701388800000, // 2023-12-01
      endDate: 1701475200000,   // 2023-12-02
      targetImpressions: 2000
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CampaignService', ['getCampaigns']);
    spy.getCampaigns.and.returnValue(of(mockCampaigns));

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule
      ],
      declarations: [ CampaignListComponent ],
      providers: [
        { provide: CampaignService, useValue: spy }
      ]
    }).compileComponents();

    campaignService = TestBed.inject(CampaignService) as jasmine.SpyObj<CampaignService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load campaigns on init', () => {
    expect(campaignService.getCampaigns).toHaveBeenCalled();
    expect(component.campaigns).toEqual(mockCampaigns);
    expect(component.filteredCampaigns).toEqual(mockCampaigns);
  });

  it('should handle error when loading campaigns', fakeAsync(() => {
    campaignService.getCampaigns.and.returnValue(throwError(() => new Error('API Error')));
    spyOn(console, 'error');
    
    component.loadCampaigns();
    tick();

    expect(console.error).toHaveBeenCalledWith('Error loading campaigns:', jasmine.any(Error));
  }));

  describe('search functionality', () => {
    it('should filter campaigns by ID', () => {
      component.searchTerm = 'campaign-1';
      component.onSearch();
      
      expect(component.filteredCampaigns.length).toBe(1);
      expect(component.filteredCampaigns[0].id).toBe('campaign-1');
    });

    it('should show all campaigns when search term is empty', () => {
      component.searchTerm = '';
      component.onSearch();
      
      expect(component.filteredCampaigns).toEqual(mockCampaigns);
    });

    it('should clear search and reset filters', () => {
      component.searchTerm = 'campaign-1';
      component.onSearch();
      component.clearSearch();
      
      expect(component.searchTerm).toBe('');
      expect(component.filteredCampaigns).toEqual(mockCampaigns);
    });
  });

  describe('sorting functionality', () => {
    it('should sort by ID in ascending order', () => {
      component.sort('id');
      expect(component.filteredCampaigns[0].id).toBe('campaign-2');
      expect(component.filteredCampaigns[1].id).toBe('campaign-1');
    });

    it('should sort by ID in descending order', () => {
      component.sort('id');
      expect(component.filteredCampaigns[0].id).toBe('campaign-2');
      expect(component.filteredCampaigns[1].id).toBe('campaign-1');
      component.sort('id'); // Second click for descending
      expect(component.filteredCampaigns[0].id).toBe('campaign-1');
      expect(component.filteredCampaigns[1].id).toBe('campaign-2');

    });

    it('should sort by targetImpressions', () => {
      component.sort('targetImpressions');
      expect(component.filteredCampaigns[0].targetImpressions).toBe(1000);
      expect(component.filteredCampaigns[1].targetImpressions).toBe(2000);
    });

    it('should sort dates correctly', () => {
      component.sort('startDate');
      expect(component.filteredCampaigns[0].startDate).toBe(1701216000000);
      expect(component.filteredCampaigns[1].startDate).toBe(1701388800000);
    });
  });

  describe('sort icons', () => {
    it('should return correct icon for unsorted column', () => {
      expect(component.getSortIcon('id')).toBe('bi bi-arrow-up');
    });

    it('should return correct icon for ascending sort', () => {
      component.sort('id');
      expect(component.getSortIcon('id')).toBe('bi bi-arrow-down');
    });

    it('should return correct icon for descending sort', () => {
      component.sort('id');
      component.sort('id');
      expect(component.getSortIcon('id')).toBe('bi bi-arrow-up');
    });
  });
});