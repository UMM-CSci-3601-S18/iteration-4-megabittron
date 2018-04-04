import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Goal} from './goal';
import {MatSnackBar} from '@angular/material';


@Component({
    selector: 'app-add-goal.component',
    templateUrl: 'add-goal.component.html',
    styleUrls: ['./add-goal.component.css'],
})
export class AddGoalComponent {
    constructor(
        public snackBar: MatSnackBar, public dialogRef: MatDialogRef<AddGoalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {goal: Goal}) {
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
