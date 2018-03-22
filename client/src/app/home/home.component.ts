import {Component} from '@angular/core';

@Component({
    selector: 'home-component',
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent {
    public title: string;
    private selectedEmotion = "..";
    private selectedEmoji = "happy";

    constructor() {
        this.title = 'Home';
    }

    emotion(){
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
}
