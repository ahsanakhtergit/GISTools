import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {
  private gcpTableDataSubject = new BehaviorSubject<any[]>([]);
  public gcpTableData$: Observable<any[]> = this.gcpTableDataSubject.asObservable();
  //public gcpTableData$ = this.gcpTableDataSubject.asObservable();
  private sourcePathSubject = new BehaviorSubject<string>('');
  public sourcePath$: Observable<string> = this.sourcePathSubject.asObservable();

  // private sourcePathSubject = new BehaviorSubject<Blob | null>(null);
  // public sourcePath$: Observable<Blob|null> = this.sourcePathSubject.asObservable();
  // Initialize the data structure with an empty array
  private gcpTableData: any[] = [];

  constructor() {}

  // Get the current gcpTableData
  getGcpTableData(): any[] {
    return this.gcpTableData;
  }

  // Update the gcpTableData
  updateGcpTableData(updatedData: any[]): void {
    // Iterate through the updated data and update the existing data or add new data
    for (const updatedRow of updatedData) {
      const existingRow = this.gcpTableData.find(row => row.id === updatedRow.id);
      if (existingRow) {
        // Update existing row
        Object.assign(existingRow, updatedRow);
      } else {
        // Add new row
        this.gcpTableData.push(updatedRow);
      }
    }

    // Notify subscribers with the updated data
    this.gcpTableDataSubject.next(this.gcpTableData);
  }

    // Method to clear the gcpTableData
    clearGcpTableData(): void {
      this.gcpTableDataSubject.next([]);
      this.gcpTableData=[];
    }

    setSourcePath(sourcePath: string) {
      this.sourcePathSubject.next(sourcePath);
    }
}
