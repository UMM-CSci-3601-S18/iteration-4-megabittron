import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Journal} from './journal';

@Component({
    selector: 'app-show-journal.component',
    templateUrl: 'show-journal.component.html',
    styleUrls: ['./show-journal.component.scss'],
})

export class ShowJournalComponent {
    constructor(
        public dialogRef: MatDialogRef<ShowJournalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {journal: Journal}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
        console.log("Show journal dialog closed.")
    }

}
