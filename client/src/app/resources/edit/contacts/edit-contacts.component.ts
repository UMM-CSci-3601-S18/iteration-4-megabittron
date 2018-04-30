import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Contact} from "../../contact";

@Component({
    selector: 'app-edit-contact.component',
    templateUrl: 'edit-contact.component.html',
    styleUrls: ['./edit-contact.component.scss'],
})

export class EditContactComponent {
    constructor(
        public dialogRef: MatDialogRef<EditContactComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {contact: Contact}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
