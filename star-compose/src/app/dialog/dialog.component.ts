import {Component} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {

  constructor(public dialog: MatDialog) {
    dialog.open(DialogTemplate);
  }

}

@Component({
  selector: 'dialog-component-template',
  templateUrl: 'dialog.component-template.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogTemplate {
  constructor(
    public dialogRef: MatDialogRef<DialogTemplate>
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}