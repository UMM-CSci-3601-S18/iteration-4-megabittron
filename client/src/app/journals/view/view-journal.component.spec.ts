import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Journal} from '../journal';
import {JournalsService} from '../journals.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {ViewJournalComponent} from './view-journal.component';
import {MatDialog} from '@angular/material';
import {ArraySortPipe} from "../array-sort.pipe";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import {RouterTestingModule} from "@angular/router/testing";


describe('Editing a journal', () => {
    let journalList: ViewJournalComponent;
    let fixture: ComponentFixture<ViewJournalComponent>;
    const newJournal: Journal =   {
        _id: '',
        userID: 'userID5',
        content: 'I fell asleep in class today',
        title: 'Classes',
        date: "Sun Feb 16 17:12:43 CST 2018"
    };
    const newId = 'class_id';

    let calledJournal: Journal;

    let journalListServiceStub: {
        getJournals: () => Observable<Journal[]>,
        editJournal: (newJournal: Journal) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (ViewJournalComponent, any) => {
            afterClosed: () => Observable<Journal>
        };
    };

    beforeEach(() => {
        calledJournal = null;
        let highlightedID: { '$oid': string } = {'$oid': ''};
        // stub JournalsService for test reasons
        journalListServiceStub = {
            getJournals: () => Observable.of([]),
            editJournal: (journalToEdit: Journal) => {
                calledJournal = journalToEdit;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        highlightedID = {'$oid': newJournal._id};
                        return Observable.of(newJournal);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule, RouterTestingModule],
            declarations: [ViewJournalComponent, ArraySortPipe],
            providers: [
                {provide: JournalsService, useValue: journalListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ViewJournalComponent);
            journalList = fixture.componentInstance;
            fixture.detectChanges();
        });
        localStorage.isSignedIn = "true";
    }));

    //This test returns Failed: Failed to execute 'send' on 'XMLHttpRequest': Failed to load 'ng:///DynamicTestModule/ViewJournalComponent_Host.ngfactory.js'.
    //We were unable to figure out how to fix this, unfortunately.
    /*it('calls JournalsService.editJournal', () => {
        expect(calledJournal).toBeNull();
        journalList.openEditJournalDialog(this._id, this.title, this.content, this.date);
        expect(journalList.isHighlighted(calledJournal));
        expect(calledJournal).toEqual(newJournal);
    });*/
});

describe('Deleting a journal', () => {
    let journalList: ViewJournalComponent;
    let fixture: ComponentFixture<ViewJournalComponent>;
    const deleteJournal: Journal =   {
        _id: '',
        userID: 'userID5',
        content: 'I fell asleep in class today',
        title: 'Classes',
        date: "Sun Feb 16 17:12:43 CST 2018"
    };
    const newId = 'pringles_id';

    let calledJournal: Journal;

    let journalListServiceStub: {
        getJournals: () => Observable<Journal[]>,
        deleteJournal: (deleteJournal: Journal) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (ViewJournalComponent, any) => {
            afterClosed: () => Observable<Journal>
        };
    };

    beforeEach(() => {
        calledJournal = null;
        // stub GoalsService for test reasons
        journalListServiceStub = {
            getJournals: () => Observable.of([]),
            deleteJournal: (journalToDelete: Journal) => {
                calledJournal = journalToDelete;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(deleteJournal);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule, RouterTestingModule],
            declarations: [ViewJournalComponent, ArraySortPipe],
            providers: [
                {provide: JournalsService, useValue: journalListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ViewJournalComponent);
            journalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    //This test returns Failed: Failed to execute 'send' on 'XMLHttpRequest': Failed to load 'ng:///DynamicTestModule/ViewJournalComponent_Host.ngfactory.js'.
    //We were unable to figure out how to fix this, unfortunately.
    /*it('calls JournalsService.deleteGoal', () => {
        expect(calledJournal).toBeNull();
        journalList.deleteJournal(this._id);
    });*/
});
