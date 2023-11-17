import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ShareDataService } from './services/share-data.service'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainMapComponent } from './main-map/main-map.component';
import { SourceMapComponent } from './source-map/source-map.component';
import { TargetMapComponent } from './target-map/target-map.component';
import { GeorefDialogComponent } from './georef-dialog/georef-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GCPTableComponent } from './gcptable/gcptable.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule
import { MatCardModule } from '@angular/material/card'; 
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { MapDataService } from './services/map-data.service';
import { GeoreferenceService } from './services/georeference.service';
import { HttpClientModule } from '@angular/common/http';
import { GeomapComponent } from './testmap/geomap/geomap.component';
import {MatSliderModule} from '@angular/material/slider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import { ConversionDialogComponent } from './DataConversion/conversion-dialog/conversion-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    MainMapComponent,
    SourceMapComponent,
    TargetMapComponent,
    GeorefDialogComponent,
    GCPTableComponent,
    GeomapComponent,
    ConversionDialogComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    HttpClientModule,
    MatSliderModule,
    MatCheckboxModule,
    MatRadioModule
  ],
  providers: [MatDialog,ShareDataService,MapDataService,GeoreferenceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
