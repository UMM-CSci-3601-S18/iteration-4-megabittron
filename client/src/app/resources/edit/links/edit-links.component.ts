import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Link} from "../../link";

@Component({
    selector: 'app-edit-link.component',
    templateUrl: 'edit-link.component.html',
    styleUrls: ['./edit-link.component.scss'],
})

export class EditLinkComponent {
    constructor(
        public dialogRef: MatDialogRef<EditLinkComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {link: Link}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
