import {Component, OnInit} from '@angular/core';
import {JournalsService} from './journals.service';
import {Journal} from './journal';
import {Observable} from 'rxjs/Observable';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AddJournalComponent} from './add/add-journal.component';
import {EditJournalComponent} from "./edit/edit-journal.component";
import {ShowJournalComponent} from "./show/show-journal.component";
import {AppService} from "../app.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-journals-component',
    templateUrl: 'journals.component.html',
    styleUrls: ['./journals.component.scss'],
    providers: [AppService]
})

export class JournalsComponent implements OnInit {
    // These are public so that tests can reference them (.spec.ts)
    public journals: Journal[] = [];
    public filteredJournals: Journal[] = [];
    public journalTitle: string;
    public journalContent: string;
    public journalDate: any;
    public length: number;
    public index = 0;

    // The ID of the journal
    private highlightedID: {'$oid': string} = { '$oid': '' };

    // Inject the JournalsService into this component.
    constructor(public journalListService: JournalsService,
                public dialog: MatDialog,
                public snackBar: MatSnackBar,
                public appService: AppService,
                private router: Router) {

    }

    openAddJournalDialog(): void {
        console.log("Add journal button clicked.");
        const newJournal: Journal = {_id: '', userID: localStorage.getItem('userID'), title: '', content: '', date: ''};
        const dialogRef = this.dialog.open(AddJournalComponent, {
            width: '300px',
            data: { journal: newJournal }

        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == undefined) {
                console.log("Cancelled without adding a journal.");
            }
            else {
                if(localStorage.isSignedIn == "true"){
                    this.journalListService.addNewJournal(result).subscribe(
                        addJournalResult => {
                            this.highlightedID = addJournalResult;
                            this.refreshJournals();
                            },
                            err => {
                                console.log('There was an error adding the journal.');
                                console.log('The error was ' + JSON.stringify(err));
                        });
                    this.snackBar.open("Added Journal", "CLOSE", {
                        duration: 2000,
                    });
                    console.log("Journal added.");
                }
            }
        });
    }

    openEditJournalDialog(_id: string, title: string, content: string, date: string): void {
        console.log("Edit journal button clicked.");
        console.log(_id + ' ' + title + content + date);
        const newJournal: Journal = {_id: _id, userID: localStorage.getItem('userID'), title: title, content: content, date: date};
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
                        this.snackBar.open("Edited Journal", "CLOSE", {
                            duration: 2000,
                        });
                        console.log("Journal edited.");
                    },
                    err => {
                        console.log('There was an error editing the journal.');
                        console.log('The error was ' + JSON.stringify(err));
                    });
            }
        });
    }

    showMoreInfoDialog(content: string): void {
        const showJournal: Journal = {_id: null, userID: null, title: null, content: content, date: null};
        const dialogRef = this.dialog.open(ShowJournalComponent, {
            width: '500px',
            data: { journal: showJournal }
        });
        console.log("Showing more journal info.");
    }

    deleteJournal(_id: string) {
        this.journalListService.deleteJournal(_id).subscribe(
            journals => {
                console.log("first part");
                this.refreshJournals();
                this.loadService();
            },
            err => {
                console.log(err);
                console.log("hi");
                this.refreshJournals();
                this.loadService();
                this.snackBar.open("Deleted Journal", "CLOSE", {
                    duration: 2000,
                });
            }
        );
    }

    public filterJournals(searchTitle: string, searchContent: string, searchDate: string): Journal[] {

        this.filteredJournals = this.journals;

        // Filter by title
        if (searchTitle != null) {
            searchTitle = searchTitle.toLocaleLowerCase();

            this.filteredJournals = this.filteredJournals.filter(journal => {
                return !searchTitle || journal.title.toLowerCase().indexOf(searchTitle) !== -1;
            });
        }

        // Filter by content
        if (searchContent != null) {
            searchContent = searchContent.toLocaleLowerCase();

            this.filteredJournals = this.filteredJournals.filter(journal => {
                return !searchContent || journal.content.toLowerCase().indexOf(searchContent) !== -1;
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
        const journalListObservable: Observable<Journal[]> = this.journalListService.getJournals(localStorage.getItem("userID"));
        journalListObservable.subscribe(
            journals => {
                this.journals = journals;
                this.filterJournals(this.journalTitle, this.journalContent, this.journalDate);
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
        //For testing
        //toggle the value in app service to toggle testing
        this.appService.testingToggle();

        // Route consumer to home page if isSignedIn status is false
        if (!this.appService.isSignedIn()) {
            this.router.navigate(['']);
        }

        this.loadService();
        this.refreshJournals();

    }

    isHighlighted(journal: Journal): boolean {
        return journal._id['$oid'] === this.highlightedID['$oid'];
    }

}
