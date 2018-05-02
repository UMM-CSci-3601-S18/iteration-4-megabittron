import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Contact} from "../../contact";

@Component({
    selector: 'app-add-contact.component',
    templateUrl: 'add-contact.component.html',
    styleUrls: ['./add-contact.component.scss'],
})

export class AddContactComponent {


    constructor(
        public dialogRef: MatDialogRef<AddContactComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {contact: Contact}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }


}
