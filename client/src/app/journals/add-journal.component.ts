import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Journal} from './journal';
import {MatSnackBar} from '@angular/material';

@Component({
    selector: 'app-add-journal.component',
    templateUrl: 'add-journal.component.html',
    styleUrls: ['./add-journal.component.css'],
})

export class AddJournalComponent {
    constructor(
        public snackBar: MatSnackBar, public dialogRef: MatDialogRef<AddJournalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {journal: Journal}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }

}
