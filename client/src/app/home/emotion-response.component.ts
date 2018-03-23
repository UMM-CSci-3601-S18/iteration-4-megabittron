import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'app-emotion-response.component',
    templateUrl: 'edit-emotion-response.html',
})

export class EmotionResponseComponent {
    giveResponse : boolean = false;

    constructor(public dialogRef: MatDialogRef<EmotionResponseComponent>) {
    }


    onYesClick(): void{
        
    }

    onExitClick(): void {
        this.dialogRef.close();
    }
}
