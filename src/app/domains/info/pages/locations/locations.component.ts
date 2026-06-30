import {
  afterNextRender,
  Component,
  inject,
  resource,
  signal,
} from '@angular/core';
import { LocationsService } from '@shared/services/locations.service';

@Component({
  selector: 'app-locations',
  imports: [],
  templateUrl: './locations.component.html',
})
export default class LocationsComponent {
  locationsService = inject(LocationsService);

  locations = resource({
    request: () => ({ origin: this.$origin() }),
    loader: ({ request }) => this.locationsService.getLocations(request),
  });

  $origin = signal('');

  constructor() {
    afterNextRender(() => {
      navigator.geolocation.getCurrentPosition(position => {
        const originValue = `${position.coords.latitude},${position.coords.longitude}`;
        this.$origin.set(originValue);
      });
    });
  }
}
