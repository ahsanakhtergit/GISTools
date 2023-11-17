import { Component, Input, OnInit } from '@angular/core';
import { Feature, MapBrowserEvent, Overlay } from 'ol';
import Map from 'ol/Map';
import View from 'ol/View';
import { Point } from 'ol/geom';
import TileLayer from 'ol/layer/WebGLTile'//'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import { ShareDataService } from '../services/share-data.service';
import { MapDataService } from '../services/map-data.service';
import ImageStatic from 'ol/source/ImageStatic';
import ImageLayer from 'ol/layer/Image';
import { Projection, toLonLat } from 'ol/proj';
import GeoTIFF from 'ol/source/GeoTIFF';
import WebGLTileLayer from 'ol/layer/WebGLTile';
import {MatSliderModule} from '@angular/material/slider';
import {MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'app-target-map',
  templateUrl: './target-map.component.html',
  styleUrls: ['./target-map.component.css']
})
export class TargetMapComponent implements OnInit {
  private layer: TileLayer | null = null; // Declare 'layer' as a class-level property

  constructor(private shareDataService: ShareDataService,private mapDataService: MapDataService) {}
  layerOpacity: number = 1; // Default opacity (1 for fully opaque)
  layerVisibility: boolean = true; // Default visibility (visible)

  imageUrl: string | null = null; // Property to hold the image URL
  map!: Map;
  //targetGCPIdCounter: number = 0;
  vectorSource: VectorSource = new VectorSource();

  targetGCPLayer = new VectorLayer({
    source: this.vectorSource,
    zIndex: 1
  });
 // shareDataService: any;

  // Define the table data property to hold GCP information
  gcpTableData: any[] = [];
  
  ngOnInit() {
     // Set the SourceMapComponent instance in MapDataService
     this.mapDataService.setTargetMapComponent(this);
    //this.mapDataService.setSourceMapComponent(this);
    // Subscribe to the observable to get updates
    this.shareDataService.gcpTableData$.subscribe((data) => {
      this.gcpTableData = data;
    });

    // // Set the initial opacity and visibility
    // this.setLayerOpacity(this.targetGCPLayer);
    // this.setLayerVisibility(this.targetGCPLayer);

    this.map = new Map({
      target: 'target-map',
      layers: [
        new TileLayer({
          source: new OSM()
          
        }),this.targetGCPLayer
      ],
      view: new View({
        center: [81.786, 21.130],//[78.9629, 20.5937]
        zoom: 16,
        projection:'EPSG:4326'
      })
    });

    // Create an overlay for displaying live coordinates//32644
    const coordinateOverlay = new Overlay({
      element: document.getElementById('coordinate-overlay')!,
      positioning: 'bottom-center',
      stopEvent: false,
    });

    this.map.addOverlay(coordinateOverlay);

    // Add a mousemove event listener to update live coordinates
    this.map.on('pointermove', (event) => {
      const coordinates = toLonLat(event.coordinate); // Convert to lon/lat
      // Check if the element exists before using it
      if (coordinateOverlay?.getElement()) {
        coordinateOverlay.getElement()!.innerHTML = `Coordinates: ${coordinates[1].toFixed(5)}, ${coordinates[0].toFixed(5)}`;
        coordinateOverlay.setPosition(event.coordinate);
      }
    });

    this.map.on('click', (event: MapBrowserEvent<any>) => {
      const clickedCoordinates = event.coordinate;
      const [x, y] = clickedCoordinates;
      //const isInsideImageExtent = this.isInsideImageExtent([x, y]);

      //if (isInsideImageExtent) {
        console.log('this.gcpTableData: '+JSON.stringify(this.gcpTableData));
        const arrEmtyTargetXY = this.gcpTableData.filter(item => item.targetX === null );
       
        if(arrEmtyTargetXY.length!==0 ){
        const isSourceExists= this.mapDataService.isSourceGCPExists(arrEmtyTargetXY[0].id);
          if(isSourceExists){
            this.addPinToMap([x, y],arrEmtyTargetXY[0].id);
          }               
       }
     
      // } else {
      //   // Clicked coordinates are outside the image extent, ignore the click event
      // }
    });

      // Check if the image URL exists and add it as an Image layer
      this.imageUrl = this.mapDataService.getImageUrl(); // Get imageUrl from MapDataService

      // Check if the image URL exists and add it as an Image layer
      
      
   
        //const imageUrl = URL.createObjectURL(response);
        //this.mapDataService.setImageUrl(this.imageUrl); // Set the received image URL in MapDataService
        this.imageUrl = this.mapDataService.getImageUrl(); // Get the image URL from MapDataService

       
  
        console.log('TargetMapComponent ngOnInit');
  
        // Retrieve and log the image URL
        this.imageUrl = this.mapDataService.getImageUrl();
        console.log('AHSAN Image URL:', this.imageUrl);
        this.setResponseToTargetMap(this.imageUrl);
  }

// Inside TargetMapComponent class
async  setResponseToTargetMap(imageUrl: string | null) {



  
///////////////////////////////
  if (imageUrl!=null) {
    const imageResponse = await fetch(imageUrl);
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


 this.layer = new TileLayer({
    source: source,
    zIndex:1,
    opacity: 0.5,
    
   
  });

  source.on('change', () => {
    // When the GeoTIFF source changes (indicating it's loaded), add it to the map
    this.layer = new TileLayer({
      source: source,
    });
    this.map?.addLayer(this.layer);
  
          
    // Hide the loading indicator
  });

  
} catch (error) {
  console.error('Error loading GeoTIFF:', error);
  // Handle the error, e.g., show an error message
}
}

  /////////////////////
  // if (imageUrl) {
  //   console.log("ENTRY TO TARGET IMAGE");
  //   const blob = imageUrl;
  //   const img = new Image();
  //   img.src = imageUrl;
  //   console.log('img.src : ' + img.src);

  //   img.onload = () => {
  //     console.log('Image loaded successfully');
  //     const width = img.width;
  //     const height = img.height;
  //     const extent = [0, 0, width, height];
  //     const projection = new Projection({
  //       code: 'xkcd-image',
  //       units: 'pixels',
  //       extent: extent,
  //     });

  //     if (imageUrl != null) {
  //       const imageSource = new ImageStatic({
  //         url: imageUrl,
  //         imageExtent: extent,
  //       });

  //       const imageLayer = new ImageLayer({
  //         source: imageSource,
  //         zIndex: 2,
  //       });
  //       this.map.addLayer(imageLayer);

  //       const imageExtent = imageSource.getImageExtent();
  //       this.map.getView().fit(imageExtent);
  //     }
  //   };

  //   img.onerror = (errorEvent) => {
  //     console.error('Error loading image:', errorEvent);
  //     // Log the error event to get more detailed information about the error
  //     const errorMessage = errorEvent.toString;
  //     console.error('Detailed error message:', errorMessage);
  //   };
  // }
}



  
  addPinToMap(coordinates: [number, number],id:any): void {
    console.log('target aya')
   
    const iconSrc = 'assets/vector_pin_48.png';
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
        context.fillText(id.toString(), (canvas.width / 2) - (canvas.width / 2) * 5 / 100, (canvas.height / 2) - (canvas.height / 2) * 30 / 100);
        
        const pointGeometry = new Point(coordinates);
        const feature = new Feature({
          geometry: pointGeometry,
        });
        feature.setStyle(pinIconStyle);
        // Assign a unique ID to the feature
        feature.set('id', id);
        //feature.setId(id:number);
        this.vectorSource.addFeature(feature);
       
        this.updateToGcpTable(coordinates,id);
        
      };
    }
  }

  updateToGcpTable(coordinates: [number, number],id:any): void {
    const targetX = coordinates[0];
    const targetY = coordinates[1];
    const updatedData = [
      {
        id: id,
        targetX: targetX.toFixed(14),
        targetY: targetY.toFixed(14),
      }
    ];

  this.shareDataService.updateGcpTableData(updatedData);

  }

  isPointWithIdExists(id: number): boolean {
    console.log("AHSAN");
    
    const features = this.vectorSource.getFeatures();
    const feature = features.find((feature: Feature) => {
      return feature.get('id') === id;
    });
    if (feature) {
      return true;
    }
    return false;
  }

  deletePoint(id: number): void {

    const features = this.vectorSource.getFeatures();
    const featureToDelete = features.find((feature: Feature) => {
      return feature.get('id') === id;
    });
  
    if (featureToDelete) {
      console.log('featureToDelete: '+featureToDelete);
      
      this.vectorSource.removeFeature(featureToDelete);
      //this.vectorSource.clear();
    }
  
    // // Remove the row from the table data
    // const index = this.gcpTableData.findIndex((row: any) => row.id === id);
    // console.log('index:'+index)
    // if (index !== -1) {
    //   this.gcpTableData.splice(index, 1);
    //   //this.dataSource.data = this.gcpTableData;
    // }

    
  }
  
  clearAllFeature(){
    this.vectorSource.clear();
  }

  // Function to convert a data URI to a Blob
  dataURItoBlob(dataURI: string): Blob {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

// // Update layer opacity
// setLayerOpacity(layer: TileLayer<ImageStatic>) {
//   layer.setOpacity(this.layerOpacity);
// }

// // Update layer visibility
// setLayerVisibility(layer: TileLayer | ImageLayer) {
//   layer.setVisible(this.layerVisibility);
// }

// Update layer opacity for the GeoTIFF image layer
setLayerOpacity(layer: TileLayer) {
  //if (layer.getSource() instanceof WebGLTileLayer) {
    const op=this.layerOpacity;
    layer.setOpacity(this.layerOpacity);
    
  //}
}

// Update layer visibility for the GeoTIFF image layer
setLayerVisibility(layer: TileLayer) {
  //if (layer.getSource() instanceof WebGLTileLayer) {
    const vi=this.layerVisibility;
    layer.setVisible(this.layerVisibility);
  //}
}

// Called when the opacity slider value changes
onOpacityChange() {
  if(this.layer)
  this.setLayerOpacity(this.layer); // Assuming the GeoTIFF layer is the second layer (index 1) in your layers array
}

// Called when the layer visibility toggle changes
onLayerVisibilityChange() {
  if(this.layer)
  this.setLayerVisibility(this.layer); // Assuming the GeoTIFF layer is the second layer (index 1) in your layers array
}

onImageDownloaded(imageSrc: string) {
  this.imageUrl = imageSrc;
}

}
