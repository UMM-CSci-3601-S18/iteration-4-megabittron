import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Journal} from './journal';
import {MatSnackBar} from '@angular/material';

@Component({
    selector: 'app-edit-journal.component',
    templateUrl: 'edit-journal.component.html',
    styleUrls: ['./edit-journal.component.css'],
})

export class EditJournalComponent {
    constructor(
        public snackBar: MatSnackBar, public dialogRef: MatDialogRef<EditJournalComponent>,
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
