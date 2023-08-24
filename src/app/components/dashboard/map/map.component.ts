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

  // Para utilizar marcadores en el mapa
  layers: Marker<any>[] = [];

  // Emitter para poder pasar en el evento emitido las coordenadas seleccionadas
  // en el mapa al componente padre
  @Output() onSelectedCoordinate: EventEmitter<Coordinate>;

  // Variable que contendrá las coordenadas que serán pintadas en el mapa en modo
  // edición. Su valor será enviado desde el componente padre.
  @Input() initialCoordinates: Coordinate[] = [];

  constructor() { 
    this.onSelectedCoordinate = new EventEmitter<Coordinate>();
  }

  ngOnInit(): void {

    this.layers = this.initialCoordinates.map(value => {
      // Opciones que crearan el mapa
      this.options = {
        layers: [
          tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
        ],
        zoom: 12,
        // Centra la ubicación (latitud, longitud)
        center: latLng(Number(value.latitude), Number(value.longitude))
      };
      
      // Si necesitamoa marcador en el mapa
      if (value.marker) {
        // Genera el marcador si lo hubiera
        return marker([Number(value.latitude), Number(value.longitude)], { draggable: true }).on('dragend', (event) => this.markerDragEnd(event));
      }
      else return marker([0, 0]); // No crea ningun marcador
    });
  }

  handleClick(event: LeafletMouseEvent): void {
    // Obtencion de las coordenadas al hacer doble click en el mapa
    const latitude = event.latlng.lat;
    const longitude = event.latlng.lng;

    // Para que al hacer click solo haya un marcador en el mapa
    this.layers = [];

    // Asignamos un marcador según latitud y longitud
    // icon: es para que trabaje con marker-shadow.png, previamente copiado de
    // node_modules/leaflet a assets
    this.layers.push(marker([latitude, longitude], {
      icon: icon({
        iconSize: [25, 40],
        iconAnchor: [13, 41],
        iconUrl: 'assets/images/marker-icon.png',
        iconRetinaUrl: 'assets/images/marker-icon-2x.png',
        shadowUrl: 'assets/images/marker-shadow.png'
      }),
      draggable: true
    }).on('dragend', (event) => this.markerDragEnd(event)));

    // Emitimos un evento que contendrá las coordenadas seleccionadas por el
    // usuario a traves del marcador
    const coordinate: Coordinate = {
      latitude: latitude.toString(),
      longitude: longitude.toString()
    };

    this.onSelectedCoordinate.emit(coordinate);
  }

  markerDragEnd($event: any) {
    // Obtencion de las coordenadas al finalizar el arrastre
    const latitude = $event.target._latlng.lat;
    const longitude = $event.target._latlng.lng;

    const coordinate: Coordinate = {
      latitude: latitude.toString(),
      longitude: longitude.toString()
    };

    this.onSelectedCoordinate.emit(coordinate);
  } 
}
