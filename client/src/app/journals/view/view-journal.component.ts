import {Component, OnInit} from '@angular/core';
import {AppService} from "../../app.service";
import {Journal} from '../journal';
import {JournalsService} from "../journals.service";
import {Observable} from "rxjs/Observable";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-view-journal.component',
    templateUrl: 'view-journal.component.html',
    styleUrls: ['./view-journal.component.scss'],
    providers: [AppService]
})

export class ViewJournalComponent implements OnInit{
    constructor(public appService: AppService,
                public journalListService: JournalsService,
                private route: ActivatedRoute) {
        this.route.params.subscribe(params => {
            this.id = params['_id'];
        });
    }

    public id: string;
    public journal: Journal = {
        _id: '',
        userID: '',
        title: '',
        content: '',
        date: ''
    };

    refreshJournal(): Observable<Journal> {
        const journalObservable: Observable<Journal> = this.journalListService.getJournalById(this.id);
        journalObservable.subscribe(
            data => {
                this.journal = data;
            },
            err => {
                console.log(err);
            });
        return journalObservable;
    }

    ngOnInit(): void {
        this.refreshJournal();
    }

}
