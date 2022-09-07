import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { tileLayer, latLng, LeafletMouseEvent, Marker, marker, icon, Icon } from 'leaflet';
import { Coordinates, CoordinatesWithMessage } from './coordinates';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Input() initialCoordinates: CoordinatesWithMessage[] |Coordinates[] = [];
  @Input() editMode: boolean = true; 
  @Output() onSelectLocation = new EventEmitter<Coordinates>();

  public options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
        maxZoom: 18, 
        attribution: 'Angular Movies'
      })
    ],
    zoom: 14,
    center: latLng(40.56742971475398, -74.53283786773683)
  };

  public layers: Marker<any>[] = [];

  private markerOptions = {
    icon: icon({
      ...Icon.Default.prototype.options,
      iconUrl: 'assets/marker-icon.png',
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      shadowUrl: 'assets/marker-shadow.png'      
    })
  };

  constructor() { }

  ngOnInit(): void {    
    if(this.initialCoordinates.length > 0) {
      const {latitude, longitude} = this.initialCoordinates[0];
      this.options.center = latLng(latitude, longitude);
      this.layers = this.initialCoordinates.map( ({latitude,longitude,message}) => {
        const m = marker([latitude, longitude], this.markerOptions);
        if(message) m.bindPopup(message, { autoClose: false, autoPan: false });
        return m;
      });
    }
  }

  public handleMapClick(event: LeafletMouseEvent) {
    if(!this.editMode) return;

    const {lat:latitude, lng:longitude} = event.latlng;    
    if(this.layers.length > 0) this.layers.pop();    
    this.layers.push(marker([latitude, longitude], this.markerOptions));
    this.onSelectLocation.emit({latitude, longitude});
  }
}
