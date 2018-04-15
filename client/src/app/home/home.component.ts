import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {MatSnackBar} from '@angular/material';
import {EmotionService} from './home.service';
import {Emotion} from './emotion';
import {environment} from '../../environments/environment';
import {AppService} from "../app.service";

@Component({
    selector: 'home-component',
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.css'],
    providers: [AppService]
})
export class HomeComponent implements OnInit{
    //public emotions: Emotion[];

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
                public emotionService: EmotionService,
                public appService: AppService) {
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

    showNext1Button() {
        if(this.selectedEmotion != "none") {
            return false;
        } else return true;
    };

    showNext2Button(){
        if(this.emojiRating != 0) {
            return false;
        }
        else return true;
    }

    saveEmotion(): void{
        const newEmotion: Emotion = {_id: '', userID: localStorage.getItem("userID"), mood: this.selectedEmotion, intensity: this.emojiRating, description:this.emotionDescription, date: this.emotionDate};

        if(localStorage.isSignedIn == "true"){

            console.log(newEmotion);
            this.emotionService.addNewEmotion(newEmotion).subscribe(
                addEmotionResult => {
                    this.highlightedID = addEmotionResult;
                    this.snackBar.open("Response Submitted", "CLOSE", {
                        duration: 2000,
                    });
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the emotion.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        } else {

            this.snackBar.open("Response Not Saved. Please Log In to Save Your Response", "CLOSE", {
                duration: 5000,
            });
        }
    }

    /*
    refreshEmotions(): Observable<Emotion[]> {
        // Get Emotions returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)
        const emotionObservable: Observable<Emotion[]> = this.emotionService.getEmotions();
        emotionObservable.subscribe(
            emotions => {
                this.emotions = emotions;
                // this.filterEmotions(this.emotionMood, this.emotionIntensity, this.emotionDescription, this.emotionDate);
            },
            err => {
                console.log(err);
            });
        return emotionObservable;
    }
    */

    getDate(){
        let today = new Date();
        this.emotionDate = today.toString();
    }

    ngOnInit(): void {
        //For testing
        //toggle the value in app service to toggle testing
        this.appService.testingToggle();
    }

}
