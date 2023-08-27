import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { icon, latLng, LeafletMouseEvent, marker, Marker, tileLayer } from 'leaflet';
import { Coordinate } from '../../../interfaces/coordinate';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  options: any;

  layers: Marker<any>[] = [];

  @Output() onSelectedCoordinate: EventEmitter<Coordinate>;

  @Input() initialCoordinates: Coordinate[] = [];

  constructor() { 
    this.onSelectedCoordinate = new EventEmitter<Coordinate>();
  }

  ngOnInit(): void {

    this.layers = this.initialCoordinates.map(value => {

      this.options = {
        layers: [
          tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
        ],
        zoom: 12,
        center: latLng(Number(value.latitude), Number(value.longitude))
      };
      
      if (value.marker) {
        return marker([Number(value.latitude), Number(value.longitude)], { draggable: true }).on('dragend', (event) => this.markerDragEnd(event));
      }
      else return marker([0, 0]);
    });
  }

  handleClick(event: LeafletMouseEvent): void {
    const latitude = event.latlng.lat;
    const longitude = event.latlng.lng;

    this.layers = [];

    this.layers.push(marker([latitude, longitude], {
      icon: icon({
        iconSize: [25, 40],
        iconAnchor: [13, 41],
        iconUrl: 'marker-icon.png',
        iconRetinaUrl: 'marker-icon-2x.png',
        shadowUrl: 'assets/images/marker-shadow.png'
      }),
      draggable: true
    }).on('dragend', (event) => this.markerDragEnd(event)));

    const coordinate: Coordinate = {
      latitude: latitude.toString(),
      longitude: longitude.toString()
    };

    this.onSelectedCoordinate.emit(coordinate);
  }

  markerDragEnd($event: any) {
    const latitude = $event.target._latlng.lat;
    const longitude = $event.target._latlng.lng;

    const coordinate: Coordinate = {
      latitude: latitude.toString(),
      longitude: longitude.toString()
    };

    this.onSelectedCoordinate.emit(coordinate);
  } 
}
