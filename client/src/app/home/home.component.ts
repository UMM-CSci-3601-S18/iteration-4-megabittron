import {Component} from '@angular/core';

@Component({
    selector: 'home-component',
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent {
    public title: string;
    private selectedEmotion = "..";

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
        this.resetSelections();
        {document.getElementById(ID).style.border = "solid blue"}
            }

    resetSelections(){
        {document.getElementById("happy").style.border = "none"}
        {document.getElementById("sad").style.border = "none"}
        {document.getElementById("mad").style.border = "none"}
        {document.getElementById("anxious").style.border = "none"}
        {document.getElementById("scared").style.border = "none"}
        {document.getElementById("meh").style.border = "none"}
    }
}
