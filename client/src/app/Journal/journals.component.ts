import {Component, OnInit} from '@angular/core';
import {JournalsService} from './journals.service';
import {Journal} from './journal';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import {AddJournalComponent} from './add-journal.component';

@Component({
    selector: 'app-journals-component',
    templateUrl: 'journals.component.html',
    styleUrls: ['./journals.component.css'],
})

export class JournalsComponent implements OnInit {
    // These are public so that tests can reference them (.spec.ts)
    public journals: Journal[];
    public filteredJournals: Journal[];

    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public journalJournal: string;
    public journalCategory: string;
    public journalName: string;

    // The ID of the journal
    private highlightedID: {'$oid': string} = { '$oid': '' };

    // Inject the JournalsService into this component.
    constructor(public journalService: JournalsService, public dialog: MatDialog) {

    }

    isHighlighted(journal: Journal): boolean {
        return journal._id['$oid'] === this.highlightedID['$oid'];
    }

    openDialog(): void {
        const newJournal: Journal = {_id: '', journal:'', category:'', name:''};
        const dialogRef = this.dialog.open(AddJournalComponent, {
            width: '500px',
            data: { journal : newJournal }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.journalService.addNewJournal(result).subscribe(
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

    public filterJournals(searchJournal: string, searchCategory: string, searchName: string): Journal[] {

        this.filteredJournals = this.journals;

        // Filter by journal
        if (searchJournal != null) {
            searchJournal = searchJournal.toLocaleLowerCase();

            this.filteredJournals = this.filteredJournals.filter(journal => {
                return !searchJournal || journal.journal.toLowerCase().indexOf(searchJournal) !== -1;
            });
        }

        // Filter by category
        if (searchCategory != null) {
            searchCategory = searchCategory.toLocaleLowerCase();

            this.filteredJournals = this.filteredJournals.filter(journal => {
                return !searchCategory || journal.category.toLowerCase().indexOf(searchCategory) !== -1;
            });
        }

        // Filter by name
        if (searchName != null) {
            searchName = searchName.toLocaleLowerCase();

            this.filteredJournals = this.filteredJournals.filter(journal => {
                return !searchName || journal.name.toLowerCase().indexOf(searchName) !== -1;
            });
        }

        return this.filteredJournals;
    }



    refreshJournals(): Observable<Journal[]> {
        // Get Journals returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)

        const journalObservable: Observable<Journal[]> = this.journalService.getJournals();
        journalObservable.subscribe(
            journals => {
                this.journals = journals;
                this.filterJournals(this.journalJournal, this.journalCategory, this.journalName);
            },
            err => {
                console.log(err);
            });
        return journalObservable;
    }


    loadService(): void {
        this.journalService.getJournals(this.journalCategory).subscribe(
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


