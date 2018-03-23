import {Component} from '@angular/core';

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

    constructor() {
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

    private resetSelections(){
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

    showSaveButton(){
        if(this.selectedEmotion == "none"){
            return true;
        }

        return false;
    }

    resetPage(){
        this.resetSelections();
        this.selectedEmotion = "none";
        this.emojiRating = 0;

    }

    saveEmotion(){
        
    }
}
