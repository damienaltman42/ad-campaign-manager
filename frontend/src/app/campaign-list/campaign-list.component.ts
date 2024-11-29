import { Component, OnInit } from '@angular/core';
import { CampaignService, Campaign } from '../campaign.service';

type SortDirection = 'asc' | 'desc';

interface SortState {
  column: keyof Campaign;
  direction: SortDirection;
}

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.css']
})
export class CampaignListComponent implements OnInit {
  campaigns: Campaign[] = [];
  filteredCampaigns: Campaign[] = [];
  searchTerm: string = '';
  sortState: SortState = {
    column: 'id',
    direction: 'asc'
  };

  constructor(private campaignService: CampaignService) { }

  ngOnInit(): void {
    this.loadCampaigns();
  }

  loadCampaigns(): void {
    this.campaignService.getCampaigns().subscribe(
      campaigns => {
        this.campaigns = campaigns;
        this.filteredCampaigns = campaigns;
        this.sortData();
      },
      error => {
        console.error('Error loading campaigns:', error);
      }
    );
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCampaigns = this.campaigns;
      return;
    }

    const searchTerm = this.searchTerm.toLowerCase().trim();
    this.filteredCampaigns = this.campaigns.filter(campaign => 
      campaign.id.toLowerCase().includes(searchTerm)
    );
    this.sortData();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredCampaigns = this.campaigns;
    this.sortData();
  }

  sort(column: keyof Campaign): void {
    if (this.sortState.column === column) {
      this.sortState.direction = this.sortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortState.column = column;
      this.sortState.direction = 'asc';
    }
    this.sortData();
  }

  getSortIcon(column: keyof Campaign): string {
    if (this.sortState.column !== column) {
      return 'bi bi-arrow-down-up';
    }
    return this.sortState.direction === 'asc' 
      ? 'bi bi-arrow-up' 
      : 'bi bi-arrow-down';
  }

  private compareValues(valueA: any, valueB: any, column: keyof Campaign): number {
    // Handle date fields
    if (column === 'startDate' || column === 'endDate') {
      const dateA = new Date(valueA).getTime();
      const dateB = new Date(valueB).getTime();
      return dateA - dateB;
    }
    
    // Handle numeric fields
    if (column === 'targetImpressions') {
      return valueA - valueB;
    }
    
    // Handle string fields (like id)
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return valueA.localeCompare(valueB);
    }
    
    // Fallback comparison
    if (valueA < valueB) return -1;
    if (valueA > valueB) return 1;
    return 0;
  }

  private sortData(): void {
    const { column, direction } = this.sortState;
    
    this.filteredCampaigns = [...this.filteredCampaigns].sort((a, b) => {
      const comparison = this.compareValues(a[column], b[column], column);
      return direction === 'asc' ? comparison : -comparison;
    });
  }
}