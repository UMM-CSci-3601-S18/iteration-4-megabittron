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
    public journalTitle: string;
    public journalCategory: string;
    public journalBody: string;
    public journalTime: string;
    public journalLink: string;

    // The ID of the journal
    private highlightedID: {'$oid': string} = { '$oid': '' };

    // Inject the JournalsService into this component.
    constructor(public journalService: JournalsService, public dialog: MatDialog) {

    }

    isHighlighted(journal: Journal): boolean {
        return journal._id['$oid'] === this.highlightedID['$oid'];
    }

    openDialog(): void {
        const newJournal: Journal = {_id: '', title:'', category:'', body:'',time:'', link:''};
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

    public filterJournals(searchTitle: string, searchCategory: string, searchBody: string, searchTime, searchLink): Journal[] {

        this.filteredJournals = this.journals;

        // Filter by title
        if (searchTitle != null) {
            searchTitle = searchTitle.toLocaleLowerCase();

            this.filteredJournals = this.filteredJournals.filter(journal => {
                return !searchTitle || journal.title.toLowerCase().indexOf(searchTitle) !== -1;
            });
        }

        // Filter by category
        if (searchCategory != null) {
            searchCategory = searchCategory.toLocaleLowerCase();

            this.filteredJournals = this.filteredJournals.filter(journal => {
                return !searchCategory || journal.category.toLowerCase().indexOf(searchCategory) !== -1;
            });
        }

        // Filter by body
        if (searchBody != null) {
            searchBody = searchBody.toLocaleLowerCase();

            this.filteredJournals = this.filteredJournals.filter(journal => {
                return !searchBody || journal.body.toLowerCase().indexOf(searchBody) !== -1;
            });
        }

        // Filter by body
        if (searchTime != null) {
            searchTime = searchTime.toLocaleLowerCase();

            this.filteredJournals = this.filteredJournals.filter(journal => {
                return !searchTime || journal.time.toLowerCase().indexOf(searchTime) !== -1;
            });
        }


        // Filter by link
        if (searchLink != null) {
            searchLink = searchLink.toLocaleLowerCase();

            this.filteredJournals = this.filteredJournals.filter(journal => {
                return !searchLink || journal.link.toLowerCase().indexOf(searchLink) !== -1;
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
                this.filterJournals(this.journalTitle, this.journalCategory, this.journalBody, this.journalTime, this.journalLink);
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


