import { Component,ChangeDetectorRef, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ShareDataService } from '../services/share-data.service';
import { MapDataService } from '../services/map-data.service';
import { JsonPipe } from '@angular/common';
import {MatRadioModule} from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gcptable',
  templateUrl: './gcptable.component.html',
  styleUrls: ['./gcptable.component.css']
})
export class GCPTableComponent {
  selectedRow:number=-1;
  constructor(private shareDataService: ShareDataService,private mapDataService: MapDataService,private cdRef: ChangeDetectorRef) {
   
  }
  displayedColumns: string[] = ['radioButton','id', 'sourceX', 'sourceY', 'targetX', 'targetY', 'actions'];
  // Define your table data
  dataSource = new MatTableDataSource<any>([]);
  @Input()  gcpTableData: any[] = [];
  ngOnInit() {
    this.mapDataService.setGCPTableComponent(this);
    this.shareDataService.gcpTableData$.subscribe((data) => {
      this.gcpTableData = data;
      this.dataSource.data = this.gcpTableData; // Update the MatTableDataSource

      // Check if there is at least one record
    if (this.gcpTableData.length > 0) {
      // Select the last record by setting `selectedRow` to its ID
      this.selectedRow = this.gcpTableData[this.gcpTableData.length - 1].id;
    }
    });

    
   
  }

  // // Define your table data
  // @Input() gcpTableData: any[] = [
  //   // Sample data
  //   { id: 1, sourceX: 100, sourceY: 200, targetX: 300, targetY: 400, dX: 50, dY: 60 },
  //   // Add more rows as needed
  // ];

 // dataSource = new MatTableDataSource<any>(this.gcpTableData);
 
  // Function to delete a row
  deleteRow(rowId: number) {
    console.log('delete single row start');
        // Get the current data from the service
        const currentData = this.dataSource.data;

        // Find the index of the row to delete
        const index = currentData.findIndex(row => row.id === rowId);

        // If the row is found, remove it
        if (index >= 0) {
          console.log('delete single row start1'+this.dataSource.data.length );
          currentData.splice(index, 1);

          // Update the data source
          this.dataSource.data = currentData;
    this.mapDataService.deletePoint(rowId);
    console.log('delete single row start2'+this.dataSource.data.length );

  //  console.log(rowId+' START: '+ JSON.stringify(this.gcpTableData) )
  //   const index = this.gcpTableData.findIndex(row => row.id === rowId);
  //   console.log('INDEX:  '+index)
  //   if (index >= 0) {
  //     console.log(rowId+' BEFORE: '+ JSON.stringify(this.gcpTableData) )
  //     this.gcpTableData.splice(index, 1);
  //     this.dataSource.data = this.gcpTableData;
  //     this.mapDataService.deletePoint(rowId);
     
  //     console.log(rowId+' AFTER: '+ JSON.stringify(this.gcpTableData) )
    }
  }
  // Function to delete all row
  deleteAllRow():void {
    // console.log('pahuncha');
    // console.log('this.gcpTableData.length: '+this.gcpTableData.length);
     this.gcpTableData=[];
    // console.log('this.dataSource.data1: '+this.dataSource.data.length);
    this.dataSource.data =this.gcpTableData;
    // console.log('this.dataSource.data2: '+this.dataSource.data.length);
    // console.log('this.gcpTableData.length1: '+this.gcpTableData.length);
    // //this.shareDataService.updateGcpTableData(this.gcpTableData);
    // console.log('this.gcpTableData.length2: '+this.gcpTableData.length);
    this.shareDataService.clearGcpTableData();

    // Manually trigger change detection
    this.cdRef.detectChanges();
  }

  // // Function to update  row
  // updateRow(gcpRow: any[]): void {
  //   gcpRow.forEach(gcpRow => {
  //     // Find the index of the object with the matching id
  //     const indexToUpdate = this.gcpTableData.findIndex(obj => obj.id === gcpRow.id);
  
  //     // Check if the object with the given id was found
  //     if (indexToUpdate !== -1) {
  //       // Update all properties of the object with the values from the updated object
  //       this.gcpTableData[indexToUpdate] = { ...this.gcpTableData[indexToUpdate], ...gcpRow };
  //     } else {
  //       // Handle the case where the id was not found
  //       console.log(`Object with id ${gcpRow.id} not found`);
  //     }
  //   });
  
  //   // Optionally, you can update the MatTableDataSource if you are using it
  //   // this.dataSource.data = this.gcpTableData;
  // }

  
  
}
