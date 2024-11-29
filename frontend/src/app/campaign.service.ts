import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Campaign {
  id: string;
  startDate: number;
  endDate: number;
  targetImpressions: number;
}

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) { }

  addCampaign(campaign: Campaign): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/add-campaign`, campaign);
  }

  getCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.apiUrl}/get-campaigns`);
  }
}