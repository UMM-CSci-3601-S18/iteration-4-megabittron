import {Component, OnInit} from '@angular/core';
import {JournalsService} from './journals.service';
import {Journal} from './journal';
import {Observable} from 'rxjs/Observable';
import {MatDialog, MatSnackBar} from '@angular/material';
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

    // The ID of the journal
    private highlightedID: {'$oid': string} = { '$oid': '' };

    // Inject the JournalsService into this component.
    constructor(public journalListService: JournalsService,
                public dialog: MatDialog,
                public snackBar: MatSnackBar) {

    }

    isHighlighted(journal: Journal): boolean {
        return journal._id['$oid'] === this.highlightedID['$oid'];
    }

    openAddJournalDialog(): void {
        console.log("Add journal button clicked.");
        const newJournal: Journal = {_id: '', subject: '', body: '', date: ''};
        const dialogRef = this.dialog.open(AddJournalComponent, {
            width: '300px',
            data: { journal: newJournal }

        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == undefined) {
                console.log("Cancelled without adding a journal.");
            } else {
                this.journalListService.addNewJournal(result).subscribe(
                    addJournalResult => {
                        this.highlightedID = addJournalResult;
                    },
                    err => {
                        // This should probably be turned into some sort of meaningful response.
                        console.log('There was an error adding the journal.');
                        console.log('The error was ' + JSON.stringify(err));
                    });
                this.snackBar.open("Added Journal", "CLOSE", {
                    duration: 2000,
                });
                this.refreshJournals();
                console.log("Journal added.");
            }
        });
    }

    openEditJournalDialog(_id: string, subject: string, body: string, date: string): void {
        console.log("Edit journal button clicked.");
        const newJournal: Journal = {_id: _id, subject: subject, body: body, date: date};
        const dialogRef = this.dialog.open(EditJournalComponent, {
            width: '300px',
            data: { journal: newJournal }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == undefined) {
                console.log("Cancelled without editing the journal.");
            } else {
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
                this.snackBar.open("Edited Journal", "CLOSE", {
                    duration: 2000,
                });
                this.refreshJournals();
                console.log("Journal edited.");
            }
        });
    }

    showMoreInfo(body: string): void {
        const showJournal: Journal = {_id: null, subject: null, body: body, date: null};
        this.dialog.open(ShowJournalComponent, {
            width: '500px',
            data: { journal: showJournal }
        });
        console.log("Showing more journal info.");
    }

    public filterJournals(searchSubject: string, searchBody: string, searchDate: string): Journal[] {

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

        // Filter by date
        if (searchDate != null) {
            searchDate = searchDate.toLocaleLowerCase();

            this.filteredJournals = this.filteredJournals.filter(journal => {
                return !searchDate || journal.date.toLowerCase().indexOf(searchDate) !== -1;
            });
        }

        return this.filteredJournals;
    }

    // Starts an asynchronous operation to update the journals list
    refreshJournals(): Observable<Journal[]> {
        const journalListObservable: Observable<Journal[]> = this.journalListService.getJournals();
        journalListObservable.subscribe(
            journals => {
                this.journals = journals;
                this.filterJournals(this.journalSubject, this.journalBody, this.journalDate);
                this.length = this.journals.length;
            },
            err => {
                console.log(err);
            });
        return journalListObservable;
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

    ngOnInit(): void {
        this.refreshJournals();
        this.loadService();
    }

}
