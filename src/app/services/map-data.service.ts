import { Injectable } from '@angular/core';
import { SourceMapComponent } from '../source-map/source-map.component';
import { GCPTableComponent } from '../gcptable/gcptable.component';
import { TargetMapComponent } from '../target-map/target-map.component';
import ImageStatic from 'ol/source/ImageStatic';
import ImageLayer from 'ol/layer/Image';

@Injectable({
  providedIn: 'root'
})
export class MapDataService {
  private sourceMapComponent: SourceMapComponent | undefined;
  private gcpTableComponent: GCPTableComponent | undefined;
  private targetMapComponent: TargetMapComponent | undefined;
  private imageUrl: string | null = null; // Add the imageUrl property here
  constructor() {}

  // Set the SourceMapComponent instance
  setSourceMapComponent(sourceMapComponent: SourceMapComponent) {
    this.sourceMapComponent = sourceMapComponent;
  }
   // Set the SourceMapComponent instance
   setTargetMapComponent(targetMapComponent: TargetMapComponent) {
    this.targetMapComponent = targetMapComponent;
  }
  // Set the GCPTableComponent instance
  setGCPTableComponent(gcpTableComponent: GCPTableComponent) {
    this.gcpTableComponent = gcpTableComponent;
  }

  // Delete a point by ID
  deletePoint(id: number) {
    console.log('service pahuncha: '+this.sourceMapComponent);
    console.log('service pahuncha: '+this.targetMapComponent);
    if (this.sourceMapComponent && this.targetMapComponent) {
      this.sourceMapComponent.deletePoint(id);
      this.targetMapComponent.deletePoint(id);
    }
  }

  // Delete a point by ID
  clearAllRow() {
    if (this.gcpTableComponent && this.targetMapComponent) {
      this.gcpTableComponent.deleteAllRow();
      this.targetMapComponent.clearAllFeature();
      
    }
  }

  isPointWithIdExists(id: number): boolean {
    // Check if the id exists in both SourceMapComponent and TargetMapComponent
    if (this.sourceMapComponent && this.targetMapComponent) {
      const sourceMapPointExists = this.sourceMapComponent.isPointWithIdExists(id);
      const targetMapPointExists = this.targetMapComponent.isPointWithIdExists(id);

      // Return true if the id exists in both components, indicating it already exists
      return sourceMapPointExists && targetMapPointExists;
    }

    // Return false if either of the components is undefined
    return false;
  }

isSourceGCPExists(id: number): boolean {
  if (this.sourceMapComponent ) {
    const sourceMapPointExists = this.sourceMapComponent.isPointWithIdExists(id);
    // Return true if the id exists in both components, indicating it already exists
    return sourceMapPointExists 
  }
  return false;
}

isTargetGCPExists(id: number): boolean {
  if (this.targetMapComponent ) {
    const targetMapPointExists = this.targetMapComponent.isPointWithIdExists(id);
    // Return true if the id exists in both components, indicating it already exists
    return targetMapPointExists 
  }
  return false;
}

private imageLayer: ImageLayer<ImageStatic> | undefined;

  setImageLayer(layer: ImageLayer<ImageStatic>) {
    this.imageLayer = layer;
  }

  getImageLayer(): ImageLayer<ImageStatic> | undefined {
    return this.imageLayer;
  }


  // Add a method to get the imageUrl
  getImageUrl(): string | null {
    return this.imageUrl;
  }

  // Add a method to set the imageUrl
  setImageUrl(imageUrl: string | null) {
    this.imageUrl = imageUrl;

    if (this.targetMapComponent) {
    this.targetMapComponent.setResponseToTargetMap(this.imageUrl );
    }

  }

}


