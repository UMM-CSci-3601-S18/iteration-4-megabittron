import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Journal} from '../journal';

@Component({
    selector: 'app-open-prompts.component',
    templateUrl: 'open-prompts.component.html',
    // styleUrls: ['./add-journal.component.css'],
})

export class RandomPrompt {
    constructor(
        public dialogRef: MatDialogRef<RandomPrompt>,
        @Inject(MAT_DIALOG_DATA) public data: {journal: Journal}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }


}
