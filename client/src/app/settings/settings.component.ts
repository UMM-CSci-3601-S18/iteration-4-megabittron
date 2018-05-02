import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import {AppService} from "../app.service";
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from '@angular/common/http';


@Component({
    selector: 'settingscomponent',
    templateUrl: 'settings.component.html',
    styleUrls: ['./settings.component.scss'],
    providers: [AppService, HttpClient]
})

export class SettingsComponent implements OnInit{

    constructor(public appService: AppService) {}

    public font: string;
    public theme: string;


    saveSettings(){
        localStorage.setItem("fontSelected",this.font);
        localStorage.setItem("styleSelected",this.theme);
    }


    ngOnInit(): void {
        if (this.font == null || this.font == ''){
            this.font = localStorage.getItem("fontSelected");
        }
        if (this.theme == null || this.theme == ''){
            this.theme = localStorage.getItem("styleSelected");
        }
    }
}

