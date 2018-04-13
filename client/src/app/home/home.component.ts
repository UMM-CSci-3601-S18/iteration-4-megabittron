import {MatDialog} from '@angular/material';
import {MatSnackBar} from '@angular/material';
import {Component} from '@angular/core';
import {EmotionService} from './home.service';
import {Observable} from 'rxjs/Observable';
import {Emotion} from './emotion';
import {environment} from '../../environments/environment';

@Component({
    selector: 'home-component',
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent {
    public emotions: Emotion[];

    readonly baseUrl: string = environment.API_URL + 'emotions';

    private highlightedID: {'$oid': string} = { '$oid': '' };

    public title: string;
    public selectedEmotion = "none";
    private highlightedEmotion = "happy";
    public videoEmotion = "none";
    public emotionDescription: string;
    public emotionDate: string;

    restart(){
        this.resetPage();
        window.location.reload();
    }

    //used for slider
    thumbLabel = true;
    public emojiRating: number = 0;

    constructor(public dialog: MatDialog,
                public snackBar: MatSnackBar,
                public emotionService: EmotionService) {
    }

    setEmotion(emotion){
        this.selectedEmotion = emotion;
        this.videoEmotion = emotion;
    }

    selectEmotion(ID){
        this.resetSelections();
        this.highlightedEmotion = ID;
        let newClass = document.getElementById(ID);
        newClass.classList.add('on');
    }

    private resetSelections(){
        let newClass = document.getElementById(this.highlightedEmotion);
        newClass.classList.remove('on');
    }

    resetPage(){
        this.resetSelections();
        this.selectedEmotion = "none";
        this.emojiRating = 0;
        this.emotionDescription = "";
    }

    saveEmotion(): void{
        const newEmotion: Emotion = {_id: '', mood: this.selectedEmotion, intensity: this.emojiRating, description:this.emotionDescription, date: this.emotionDate};

            console.log(newEmotion);
            this.emotionService.addNewEmotion(newEmotion).subscribe(
                addEmotionResult => {
                    this.highlightedID = addEmotionResult;
                    this.refreshEmotions();
                    //this.resetPage();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the emotion.');
                    console.log('The error was ' + JSON.stringify(err));
                });
    }

    refreshEmotions(): Observable<Emotion[]> {
        // Get Goals returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)
        const emotionObservable: Observable<Emotion[]> = this.emotionService.getEmotions();
        emotionObservable.subscribe(
            emotions => {
                this.emotions = emotions;
                /*this.filterEmotions(this.emotionMood, this.emotionIntensity, this.emotionDescription, this.emotionDate);*/
            },
            err => {
                console.log(err);
            });
        return emotionObservable;
    }

    getDate(){
        let today = new Date();
        this.emotionDate = today.toString();
    }

}
