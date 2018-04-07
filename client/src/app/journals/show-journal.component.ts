import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Journal} from './journal';
import {MatSnackBar} from '@angular/material';

@Component({
    selector: 'app-show-journal.component',
    templateUrl: 'show-journal.component.html',
})

export class ShowJournalComponent {
    constructor(
        public snackBar: MatSnackBar, public dialogRef: MatDialogRef<ShowJournalComponent>,
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
