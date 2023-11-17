import { Component, EventEmitter, Inject, Output } from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { Projection } from 'ol/proj';
import ImageLayer from 'ol/layer/Image';
import Static from 'ol/source/ImageStatic.js';
import { getCenter } from 'ol/extent';
import { View } from 'ol';
import { GeoreferenceService } from '../services/georeference.service';
import { SourceMapComponent } from '../source-map/source-map.component';
import ImageStatic from 'ol/source/ImageStatic.js';
import { MapDataService } from '../services/map-data.service';
import { ShareDataService } from '../services/share-data.service';
import { stringToGlsl } from 'ol/style/expressions';
import { HttpHeaders } from '@angular/common/http';
// import * as gdal from 'gdal-async'

@Component({
  selector: 'app-georef-dialog',
  templateUrl: './georef-dialog.component.html',
  styleUrls: ['./georef-dialog.component.css']
})

export class GeorefDialogComponent {
  @Output() imageDownloaded = new EventEmitter<string>();
  
  imageUrl: string | null = null;
//  constructor(public dialogRef: MatDialogRef<GeorefDialogComponent>) {}
dialogRef!: MatDialogRef<any>;
  constructor(public dialog: MatDialog,
    private georeferenceService:GeoreferenceService,
    private mapDataService:MapDataService,
    private shareDataService:ShareDataService,
   
    ) {}

    sourcePath: any;
     GCPpoints:any='';
    // gdalStatement:any;
    ngOnInit() {
      //this.georeferenceService.setGeorefDialogComponent(this);
      this.shareDataService.sourcePath$.subscribe(path => {
        this.sourcePath = path; // Update the file name when it changes
      });
      };
  openDialog() {
    const dialogRef = this.dialog.open(GeorefDialogComponent, { disableClose: true });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });


  }

closeDialog() {
    this.dialogRef.close(); // Close the dialog when the close button is clicked
  }


  onProcessClick() {
    const gcpTableData = this.shareDataService.getGcpTableData();
    const gdalCommand = this.buildGdalCommand(gcpTableData);
    
    // Send the GDAL command and Blob input file to the server for execution
    this.georeferenceService.georeferenceImage(gdalCommand).subscribe(
      (response: Blob) => {
        const imageUrl = URL.createObjectURL(response);
        this.mapDataService.setImageUrl(imageUrl);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
  

  buildGdalCommand(gcpTableData: GcpTableRow[]): string {
    let gdalCommand = 'gdal_translate -of GTiff';
    gcpTableData.forEach((row) => {
      gdalCommand += ` -gcp ${row.sourceX} ${row.sourceY} ${row.targetX} ${row.targetY}`;
    });
    gdalCommand+=' "UPLOADS/uploadedImage.png" "OUTPUT/uploadedImage_tran.tif" && gdalwarp "OUTPUT/uploadedImage_tran.tif" "OUTPUT/uploadedImage_georef.tif" -r near -order 1 -co COMPRESS=NONE -overwrite -of GTiff';
    console.log('gdalCommand: '+gdalCommand);
    
    return gdalCommand;
  }

  downloadImage() {
    // // Call your georeferencing service to retrieve the georeferenced image URL
    // this.georeferenceService.georeferenceImage().subscribe(
    //   (imageUrl: string) => {
    //     // Create an anchor element to trigger the download
    //     const a = document.createElement('a');
    //     a.href = imageUrl;
    //     a.download = 'georeferenced-image.png'; // Set the desired file name
    //     a.style.display = 'none';
    //     document.body.appendChild(a);
    //     a.click();
    //     document.body.removeChild(a);
    //   },
    //   (error) => {
    //     console.error('Error downloading the image', error);
    //     // Handle the error, e.g., show an error message to the user
    //   }
    // );
  }
  
}


  // Define the GcpTableRow type
  interface GcpTableRow {
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
  }


  