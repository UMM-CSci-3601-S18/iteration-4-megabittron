import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import {AppService} from "../app.service";
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
    selector: 'aboutcomponent',
    templateUrl: 'about.component.html',
    styleUrls: ['./about.component.scss'],
    providers: [AppService, HttpClient]
})

export class AboutComponent implements OnInit {


    ngOnInit(): void {

    }
}

