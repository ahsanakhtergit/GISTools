import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MapBrowserEvent } from 'ol';
import Map from 'ol/Map';
import View from 'ol/View';
import { Point } from 'ol/geom';
import ImageLayer from 'ol/layer/Image';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import ImageStatic from 'ol/source/ImageStatic';
import VectorSource from 'ol/source/Vector';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import { getCenter } from 'ol/extent.js';
import { Projection } from 'ol/proj';
import { ShareDataService } from '../services/share-data.service';
import { MapDataService } from '../services/map-data.service';
import { EMPTY } from 'rxjs';
import { GeoreferenceService } from '../services/georeference.service';
import { GeorefDialogComponent } from '../georef-dialog/georef-dialog.component';
//import { ShareDataService } from './services/share-data.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GCPTableComponent } from '../gcptable/gcptable.component';


@Component({
  selector: 'app-source-map',
  templateUrl: './source-map.component.html',
  styleUrls: ['./source-map.component.css']
})
export class SourceMapComponent implements OnInit {
 
  @ViewChild('fileInput') fileInput!: ElementRef;
  constructor(private shareDataService: ShareDataService,private http: HttpClient,
    private mapDataService: MapDataService,
    //private georeferenceService:GeoreferenceService,
    // private georefDialogComponent:GeorefDialogComponent
    ) {}
   imageHeight:number=0;
  imageWidth:number=0;

  gcpTableData: any[] = [];
  map!: Map;
  newExtent = [0, 0, 0, 0];
  //gcpTableData: any[] = [];
  imageLayer = new ImageLayer<ImageStatic>;
  sourceGCPIdCounter: number = 0;
  vectorSource: VectorSource = new VectorSource();

  sourceGCPLayer = new VectorLayer({
    source: this.vectorSource,
    zIndex: 1
  });
  // Define the table data property to hold GCP information
  // @Input() gcpTableData: any[] = [];
  
  ngOnInit() {
      // Subscribe to the observable to get updates
      this.shareDataService.gcpTableData$.subscribe((data) => {
        this.gcpTableData = data;
        this.mapDataService.setImageLayer(this.imageLayer);
      });
    // Set the SourceMapComponent instance in MapDataService
    this.mapDataService.setSourceMapComponent(this);
    
    const extent =[0, 0, 1024, 968];//[-180, -90, 180, 90];//[0,0,2000000, 2000000]
    const projection = new Projection({
      code: 'xkcd-image',
      units: 'pixels',
      extent: extent,
    });

    this.map = new Map({
      layers: [this.imageLayer, this.sourceGCPLayer],
      target: 'source-map',
      
      view: new View({
        projection: projection,
        center: getCenter(extent),
        zoom: 1,
        maxZoom: 16,
       
      }),
    });

    this.map.on('click', (event: MapBrowserEvent<any>) => {
      const clickedCoordinates = event.coordinate;
      const [x, y] = clickedCoordinates;
      const isInsideImageExtent = this.isInsideImageExtent([x, y]);

      if (isInsideImageExtent) 
      {
          const arrEmtyTargetXY = this.gcpTableData.filter(item => item.targetX === null );
          if(arrEmtyTargetXY.length===0){
              this.addPinToMap([x, y]);
          }
          else
          {
              const features = this.vectorSource.getFeatures();
              const feature = features.find((feature: Feature) => {
                return feature.get('id') === arrEmtyTargetXY[0].id;
              });
            
              if (feature) {
                feature.setGeometry(new Point([x,y]))
                this.updateToGcpTable([x, y],arrEmtyTargetXY[0].id)
              }
          }
      } else {
        alert("Clicked coordinates are outside the image extent,Please click on the image");
      }
    });
  }

  isInsideImageExtent(coordinates: [number, number]): boolean {
    const imageExtent = this.newExtent;
    const [x, y] = coordinates;
    const [minX, minY, maxX, maxY] = imageExtent;
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  }

  addRasterImage(event: any): void {
    const selectedFiles: FileList = event.target.files;
    if (selectedFiles.length > 0) {

      if(event.target.files.length > 0) 
      {
        console.log(event.target.files[0].name);
      }
      
      const selectedFile: File = selectedFiles[0];
      const img = new Image();
      img.src = URL.createObjectURL(selectedFile);
      
      this.shareDataService.setSourcePath(img.src)
      console.log('img.src : '+img.src )
      img.onload = () => {
        console.log('img.onload Starts: '+img.width+'|'+img.height)
        this.imageHeight=img.height
        this.imageWidth=img.width
        const width = img.width;
        const height = img.height;
        const extent = [0, 0, width, height];
        const projection = new Projection({
          code: 'xkcd-image',
          units: 'pixels',
          extent: extent,
        });

        const newImageSource = new ImageStatic({
          url: URL.createObjectURL(selectedFile),
          imageExtent: extent,
          projection: projection,
        });

        this.imageLayer.setSource(newImageSource);
        this.newExtent = extent;
        this.map.getView().setCenter(getCenter(extent));
        this.mapDataService.setImageLayer(this.imageLayer);

            // Send the file to the server
        this.uploadImage(selectedFiles[0]);
      };

   
    }
  }
  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
  
    // Display a loading indicator to the user
    this.showLoadingIndicator(true);
  
    // Send the image to the server
    this.http.post<Blob>(
        'http://localhost:3000/upload-image', // Update with your server URL
      formData
    ).subscribe(
      (response) => {
        // Hide the loading indicator
        this.showLoadingIndicator(false);
  
        // Handle the response
        const imageUrl = URL.createObjectURL(response);
        this.mapDataService.setImageUrl(imageUrl);
      },
      (error) => {
        // Hide the loading indicator and show an error message
        // this.showLoadingIndicator(false);
        // console.error('Error:', error);
        // this.showErrorToUser('Image upload failed. Please try again.');
      }
    );
  }
  
  showLoadingIndicator(show: boolean) {
    // Implement code to display or hide a loading indicator
  }
  
  showErrorToUser(errorMessage: string) {
    // Implement code to display an error message to the user
  }
  
  
  removeRaster(): void {
    this.newExtent = [0, 0, 0, 0];
    this.imageLayer.setSource(null);
   this.map.getView().setCenter([-180, -90, 180, 90]);
   this.clearAllFeature();
    this.sourceGCPIdCounter = 0;
    this.mapDataService.clearAllRow();
    this.shareDataService.clearGcpTableData();
    this.gcpTableData = [];
  }

clearAllFeature(){
  this.vectorSource.clear();
}



  addPinToMap(coordinates: [number, number]): void {
    if(this.gcpTableData.length==0){this.sourceGCPIdCounter=0}
    this.sourceGCPIdCounter++;
    const iconSrc = 'assets/raster_pin_48.png';
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (context) {
      canvas.width = 48;
      canvas.height = 48;
      const pinIconStyle = new Style({
        image: new Icon({
          anchor: [0.5, 1],
          img: canvas,
          size: [48, 48],
        }),
      });

      const iconImage = new Image();
      iconImage.src = iconSrc;
      iconImage.onload = () => {
        context.drawImage(iconImage, 0, 0, 48, 48);
        context.fillStyle = 'white';
        context.font = 'bold 18px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText((this.sourceGCPIdCounter).toString(), (canvas.width / 2) - (canvas.width / 2) * 5 / 100, (canvas.height / 2) - (canvas.height / 2) * 30 / 100);
        
        const pointGeometry = new Point(coordinates);
        const feature = new Feature({
          geometry: pointGeometry,
        });
        feature.setStyle(pinIconStyle);
        feature.set('id', this.sourceGCPIdCounter);
        this.vectorSource.addFeature(feature);
        // const gcps = [
        //   {
        //     id: this.sourceGCPIdCounter,
        //     sourceX: coordinates[0],
        //     sourceY: this.imageHeight-coordinates[1],
        //     targetX: null,
        //     targetY: null,
        //     dX: null,
        //     dY: null
        //   }
        // ];
        // this.shareDataService.updateGcpTableData(gcps);
        this.updateToGcpTable(coordinates,this.sourceGCPIdCounter)
      };
    }
  }

  updateToGcpTable(coordinates: [number, number],id:any): void {
  
    const updatedData = [
      {
        id: id,
        sourceX: coordinates[0].toFixed(14),
        sourceY: (this.imageHeight-coordinates[1]).toFixed(14),
            targetX: null,
            targetY: null,
            dX: null,
            dY: null
      }
    ];

  this.shareDataService.updateGcpTableData(updatedData);
  // Set selectedRow to the ID of the last record
  
 
  }

  deletePoint(id: number): void {

    const features = this.vectorSource.getFeatures();
    const featureToDelete = features.find((feature: Feature) => {
      return feature.get('id') === id;
    });
  
    if (featureToDelete) {
      console.log('featureToDelete: '+featureToDelete);
      this.vectorSource.removeFeature(featureToDelete);
    }
  }
  
  isPointWithIdExists(id: number): boolean {
    const features = this.vectorSource.getFeatures();
    const feature = features.find((feature: Feature) => {
      return feature.get('id') === id;
    });
    if (feature) {
      return true;
    }
    return false;
  }

  getBlob(){
    
  }

}
