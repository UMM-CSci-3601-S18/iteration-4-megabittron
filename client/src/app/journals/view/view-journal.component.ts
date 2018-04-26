import {Component, Inject, OnInit, Input} from '@angular/core';
import {AppService} from "../../app.service";
import {Journal} from '../journal';
import {JournalsService} from "../journals.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {ActivatedRoute, ActivatedRouteSnapshot} from "@angular/router";

@Component({
    selector: 'app-view-journal.component',
    templateUrl: 'view-journal.component.html',
    styleUrls: ['./view-journal.component.scss'],
    providers: [AppService]
})

export class ViewJournalComponent implements OnInit{
    constructor(public appService: AppService,
                public journalListService: JournalsService,) {

    }
    public journals: Journal[] = [];
    public filteredJournals: Journal[] = [];
    public journalTitle: string;
    public journalContent: string;
    public length: number;
    public index = 0;
    public pathName = window.location.pathname.toString();

    refreshJournals(): Observable<Journal[]> {
        const journalListObservable: Observable<Journal[]> = this.journalListService.getJournals(localStorage.getItem("userID"));
        journalListObservable.subscribe(
            journals => {
                this.journals = journals;
                this.length = this.journals.length;
            },
            err => {
                console.log(err);
            });
        return journalListObservable;
    }

    loadService(): void {
        this.journalListService.getJournals(localStorage.getItem("userID")).subscribe(
            journals => {
                this.journals = journals;
                this.filteredJournals = this.journals;
            },
            err => {
                console.log(err);
            }
        );
    }

    ngOnInit(): void {
        this.loadService();
        this.refreshJournals();
        console.log(window.location.pathname);
    }

}
