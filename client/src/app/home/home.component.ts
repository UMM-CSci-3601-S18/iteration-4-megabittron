import {Component} from '@angular/core';
import {EmotionResponseComponent} from "./emotion-response.component";
import {MatDialog} from '@angular/material';
import {MatSnackBar} from '@angular/material';

@Component({
    selector: 'home-component',
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent {
    public title: string;
    private selectedEmotion = "none";
    private selectedEmoji = "happy";

    //used for slider
    thumbLabel = true;
    public emojiRating: number = 0;

    constructor(public dialog: MatDialog,
                public snackBar: MatSnackBar) {
        this.title = 'Home';
    }

    emotion(){
        if(this.selectedEmotion == "none"){
            return "..";
        }

        return this.selectedEmotion;
    }

    setEmotion(emotion){
        this.selectedEmotion = emotion;
    }

    selectEmotion(ID){
        var clickedSize = "12%";
        this.resetSelections();
        this.selectedEmoji = ID;
        {document.getElementById(ID).style.height = clickedSize}
        {document.getElementById(ID).style.width = clickedSize}
    }

    resetSelections(){
        var baseSize = "10%";

        {document.getElementById(this.selectedEmoji).style.height = baseSize}
        {document.getElementById(this.selectedEmoji).style.width = baseSize}

    }

    showTextBox(): boolean{
        if(this.selectedEmotion == "none"){
            return false;
        }

        return true;
    }

    //retrieves an appropriate response to an emotion selection
    appropriateResponsePopUp(): void {

        if(this.intenseEmotionResponse()){
            var dialogRef = this.dialog.open(EmotionResponseComponent, {
                width: '70vw',
                height: '50%',
            });
        }

        this.saveConfirmation();

    }

    //checks the emotional response and the intensity to see if a response is needed
    intenseEmotionResponse(): boolean {

        console.log("the selected emoji is: " + this.selectedEmotion);
        if(this.selectedEmotion.toLowerCase() == 'sad' || this.selectedEmotion.toLowerCase() == 'mad' || this.selectedEmotion.toLowerCase() == 'scared' || this.selectedEmotion.toLowerCase() == 'anxious'){
            if(this.emojiRating >= 3){
                return true;
            }
        }
        return false;
    }

    saveConfirmation(): void {
        this.snackBar.open("Your response has been saved.", "close", {duration: 2000});
    }
}
