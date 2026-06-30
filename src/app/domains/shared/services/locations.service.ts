import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Location } from '@shared/models/location.model';

@Injectable({
  providedIn: 'root',
})
export class LocationsService {
  async getLocations(request: { origin?: string }): Promise<Location[]> {
    const url = new URL(`${environment.apiUrl}/api/v1/locations`);

    if (request.origin) {
      url.searchParams.set('origin', request.origin);
    }

    const response = await fetch(url);

    return (await response.json()) as Location[];
  }
}
