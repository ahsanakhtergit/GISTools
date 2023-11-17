import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MapDataService } from './map-data.service'; // Import your MapDataService

@Injectable({
  providedIn: 'root'
})
export class GeoreferenceService {
  private serverUrl = 'http://localhost:3000'; // Adjust the URL to match your server

  constructor(private http: HttpClient, private mapDataService: MapDataService) {}

  georeferenceImage(gdalCommand: string): Observable<Blob> {
    // Create a request body containing the GDAL command
    const body = { command: gdalCommand };
    const options = { responseType: 'blob' as 'json' };

    // Send the GDAL command to the server for execution
    return this.http.post<any>(`${this.serverUrl}/execute-gdal-command`, body, options).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle errors here if needed
        // ...

        // On success, you can set the image URL in MapDataService
        if (!(error.error instanceof ErrorEvent)) {
          //const imageUrl = URL.createObjectURL(error.error); // Assuming this is where the image URL is received
          //this.mapDataService.setImageUrl(imageUrl); // Set the received image URL in MapDataService
        }

        // Pass the error along to the caller
        const errorMessage = 'An error occurred on the server'; // Default error message
        console.error(errorMessage);
        return throwError(errorMessage);
      })
    );
  }
}
