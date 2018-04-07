import {Component, OnInit} from '@angular/core';
import {JournalsService} from './journals.service';
import {Journal} from './journal';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import {AddJournalComponent} from './add-journal.component';
import {EditJournalComponent} from "./edit-journal.component";
import {ShowJournalComponent} from "./show-journal.component";

@Component({
    selector: 'app-journals-component',
    templateUrl: 'journals.component.html',
    styleUrls: ['./journals.component.scss'],
})

export class JournalsComponent implements OnInit {
    // These are public so that tests can reference them (.spec.ts)
    public journals: Journal[];
    public filteredJournals: Journal[];
    public journalSubject: string;
    public journalBody: string;
    public journalDate: any;
    public length: number;
    public index = 0;
    public progress: number;
    showPage = false;

    // The ID of the
    private highlightedID: {'$oid': string} = { '$oid': '' };

    // Inject the JournalsService into this component.
    constructor(public journalListService: JournalsService, public dialog: MatDialog) {

    }

    isHighlighted(journal: Journal): boolean {
        return journal._id['$oid'] === this.highlightedID['$oid'];
    }

    openDialog(): void {
        const newJournal: Journal = {_id: '', subject: '', body: '', date: ''};
        const dialogRef = this.dialog.open(AddJournalComponent, {
            width: '300px',
            data: { journal: newJournal }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.journalListService.addNewJournal(result).subscribe(
                addJournalResult => {
                    this.highlightedID = addJournalResult;
                    this.refreshJournals();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the journal.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }

    openDialogReview(_id: string, subject: string, body: string, date: string): void {
        console.log(_id + ' ' + subject + body + date);
        const newJournal: Journal = {_id: _id, subject: subject, body: body, date: date};
        const dialogRef = this.dialog.open(EditJournalComponent, {
            width: '300px',
            data: { journal: newJournal }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.journalListService.editJournal(result).subscribe(
                editJournalResult => {
                    this.highlightedID = editJournalResult;
                    this.refreshJournals();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error editing the journal.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }

    showMoreInfo(body: string): void {
        const showJournal: Journal = {_id: null, subject: null, body: body, date: null};
        const dialogRef = this.dialog.open(ShowJournalComponent, {
            width: '300px',
            data: { journal: showJournal }
        });
    }

    public filterJournals(searchSubject: string, searchBody: string): Journal[] {

        this.filteredJournals = this.journals;

        // Filter by subject
        if (searchSubject != null) {
            searchSubject = searchSubject.toLocaleLowerCase();

            this.filteredJournals = this.filteredJournals.filter(journal => {
                return !searchSubject || journal.subject.toLowerCase().indexOf(searchSubject) !== -1;
            });
        }

        // Filter by body
        if (searchBody != null) {
            searchBody = searchBody.toLocaleLowerCase();

            this.filteredJournals = this.filteredJournals.filter(journal => {
                return !searchBody || journal.body.toLowerCase().indexOf(searchBody) !== -1;
            });
        }

        this.length = this.filteredJournals.length;
        if (this.index + 10 > this.length) {
            this.index = this.length - 10;
        }
        if (this.index - 10 < 0) {
            this.index = 0;
        }

        return this.filteredJournals;
    }

    // Starts an asynchronous operation to update the journals list

    refreshJournals(): Observable<Journal[]> {
        const journalListObservable: Observable<Journal[]> = this.journalListService.getJournals();
        journalListObservable.subscribe(
            journals => {
                this.journals = journals;
                this.filterJournals(this.journalSubject, this.journalBody);
                this.length = this.journals.length;
            },
            err => {
                console.log(err);
            });
        return journalListObservable;
    }

    loadProgressBar(): void {

        this.progress = (this.index / this.length) * 100;
    }

    loadService(): void {
        this.journalListService.getJournals(this.journalSubject).subscribe(
            journals => {
                this.journals = journals;
                this.filteredJournals = this.journals;
            },
            err => {
                console.log(err);
            }
        );
    }

    prevIndex(): void{
        if(this.index == this.length - 10){
            this.index = this.index - 10;
        }
        else if(this.index % 10 != 0){
            while(this.index % 10 != 0){
                this.index = this.index - 1;
            }
        }
        else{
            this.index = this.index - 10;
        }
        this.loadProgressBar();
    }

    nextIndex(): void{
        this.index = this.index + 10;
        if(this.index + 10 >= this.length){
            this.index = this.length;
        }
        this.loadProgressBar();
    }

    firstIndex(): void{
        this.index = 0;
        this.loadProgressBar();
    }

    lastIndex(): void{
        this.index = this.length;
        this.loadProgressBar();
    }

    ngOnInit(): void {
        this.refreshJournals();
        this.loadService();
        this.loadProgressBar();
    }

}
