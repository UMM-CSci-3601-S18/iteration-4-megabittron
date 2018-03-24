import {Component} from '@angular/core';
import {EmotionResponseComponent} from "./emotion-response.component";
import {MatDialog} from '@angular/material';

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

    constructor(public dialog: MatDialog) {
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

        if(this.intenseEmotionResponse){
            const dialogRef = this.dialog.open(EmotionResponseComponent, {
                width: '50%',
                height: '50%',
            });
        }


    }

    //checks the emotional response and the intensity to see if a response is needed
    intenseEmotionResponse(): boolean {

        if(this.selectedEmotion == 'sad' || this.selectedEmotion == 'mad' || this.selectedEmotion == 'scared' || this.selectedEmotion == 'anxious'){
            if(this.emojiRating > 3){
                return true;
            }
        }
        return false;
    }
}
