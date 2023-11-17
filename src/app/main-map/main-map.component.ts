import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
//import TileLayer from 'ol/layer/Tile';
import TileLayer from 'ol/layer/WebGLTile'
import OSM from 'ol/source/OSM';
import { GeorefDialogComponent } from '../georef-dialog/georef-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import GeoTIFF from 'ol/source/GeoTIFF';
import { ConversionDialogComponent } from '../DataConversion/conversion-dialog/conversion-dialog.component';

@Component({
  selector: 'app-main-map',
  templateUrl: './main-map.component.html',
  styleUrls: ['./main-map.component.css']
})
export class MainMapComponent {
  map!: Map;

  ngOnInit() {
    this.map = new Map({
      target: 'map', // This should match the ID of the map container element in your HTML template
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: [81.786, 21.130],//23.178628, 77.482378//23.191915, 77.463374//[78.9629, 20.5937],//[81.786, 21.130],23.195572, 77.476437
        zoom: 14,
        projection:'EPSG:4326'
      })
    });
  }
//[77.482378,23.178628] bhopal
  dialogRef!: MatDialogRef<any>; // Declare a variable to hold the dialog reference

  constructor(private dialog: MatDialog) {}

  openDialog() {
    // Open the dialog from COMP2
    const dialogRef = this.dialog.open(GeorefDialogComponent,{
      disableClose: true,});
  }
  openConversionDialog() {
    // Open the dialog from COMP2
    const dialogRef = this.dialog.open(ConversionDialogComponent,{
      disableClose: true,});
  }

  closeDialog() {
    // Close the dialog by calling the close method on the stored dialogRef
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  async LoadGeorefImage(event: any): Promise<void> {
    const selectedFiles: FileList = event.target.files;
    if (selectedFiles.length > 0) {
      const selectedFile: File = selectedFiles[0];
      const ImageUrl = URL.createObjectURL(selectedFile);
      const imageResponse = await fetch(ImageUrl);
    const blob = await imageResponse.blob();
  try {
  const source = new GeoTIFF({
    convertToRGB: true,
    sources: [
      {
        
        //min: 0,
        //max: 100,
        //nodata: 0,
        blob,
       //bands:[1,2,3]
       
      },
    ],
    interpolate:false,
    normalize: true,
    sourceOptions: {
      allowFullFile: true,
    }
  });


  const layer = new TileLayer({
    source: source,
    zIndex:1,
    opacity: 0.5,
    
   
  });

  source.on('change', () => {
    // When the GeoTIFF source changes (indicating it's loaded), add it to the map
    const layer = new TileLayer({
      source: source,
    });
    this.map?.addLayer(layer);

    // Hide the loading indicator
  });
} catch (error) {
  console.error('Error loading GeoTIFF:', error);
  // Handle the error, e.g., show an error message
}
   
    }
  }
}
