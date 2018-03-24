import {Component, Inject} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Resource} from './resource';

import {Observable} from 'rxjs/Observable';

import {environment} from '../../environments/environment';

@Component({
    selector: 'emotion-response-component',
    templateUrl: 'emotion-response.component.html',
})

export class EmotionResponseComponent {
    giveResponse : boolean = false;
    selectedResponse : string = "";
    resourceUrl : string = environment.API_URL + 'resources';


    constructor(public dialogRef: MatDialogRef<EmotionResponseComponent>,
                private http: HttpClient) {
    }


    onYesClick(): void{
        var linkObservable: Observable<Resource[]> = this.getLinks();
        linkObservable.subscribe(
            links => {
                var index = Math.floor(Math.random() * links.length);
                this.selectedResponse = links[index].resource;
                if(this.selectedResponse != ""){
                    this.giveResponse=true;
                }

            },
            err => {
                console.log(err);
            });

    }

    getLinks(): Observable<Resource[]> {
        return this.http.get<Resource[]>(this.resourceUrl);
    }

    onExitClick(): void {
        this.dialogRef.close();
    }
}
