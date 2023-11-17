import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import ImageLayer from 'ol/layer/Image';
import Static from 'ol/source/ImageStatic';
import { Coordinate } from 'ol/coordinate';
import { toStringXY } from 'ol/coordinate';
import { createStringXY } from 'ol/coordinate';
import { unByKey } from 'ol/Observable';
import ImageStatic from 'ol/source/ImageStatic';
import { MapBrowserEvent } from 'ol';

@Component({
  selector: 'app-geomap',
  templateUrl: './geomap.component.html',
  styleUrls: ['./geomap.component.css']
})
export class GeomapComponent implements OnInit {
  map!: Map;
  clickListener: any;

  ngOnInit() {
    const extent = [0, 0, 2000, 2000];
    const projection = 'EPSG:3857';

    const imageSource = new Static({
      url: 'assets/AA.jpg',
      imageExtent: extent,
      projection: projection,
    });
  
    this.map = new Map({
      layers: [
        new ImageLayer({
          source: imageSource,
        }),
      ],
      target: 'map',
      view: new View({
        center: [1000, 1000],
        zoom: 16,
      }),
    });

    // Add a click event listener to the map
    this.clickListener =  this.map.on('click', (event: MapBrowserEvent<any>)  => {
      
      const clickedCoordinate: Coordinate = event.pixel;
      const clickedCoordinatesText = toStringXY(
        clickedCoordinate,
        2 // Number of decimal places
      );

      // Display the clicked coordinates in an alert dialog
      alert(`Clicked Coordinates: ${clickedCoordinatesText}`);
    });
  }

  ngOnDestroy() {
    // Remove the click event listener when the component is destroyed
    if (this.clickListener) {
      unByKey(this.clickListener);
    }
  }
}
