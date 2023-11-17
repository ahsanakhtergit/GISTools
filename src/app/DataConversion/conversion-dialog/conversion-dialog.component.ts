import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-conversion-dialog',
  templateUrl: './conversion-dialog.component.html',
  styleUrls: ['./conversion-dialog.component.css']
})
export class ConversionDialogComponent {

  dialogRef!: MatDialogRef<any>;
  constructor(public dialog: MatDialog
    
   
    ) {}

//   openDialog() {
//     const dialogRef = this.dialog.open(ConversionDialogComponent, { disableClose: true });

//     dialogRef.afterClosed().subscribe(result => {
//       console.log(`Dialog result: ${result}`);
//     });


//   }

// closeDialog() {
//     this.dialogRef.close(); // Close the dialog when the close button is clicked
//   }
}
