import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Contact} from './contact';
import {Link} from './link';
import {ResourcesComponent} from './resources.component';
import {ResourcesService} from './resources.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import {RouterTestingModule} from "@angular/router/testing";

fdescribe( 'Resources', () => {

    let resourceList: ResourcesComponent;
    let fixture: ComponentFixture<ResourcesComponent>;

    let linkServiceStub: {
        getLinks: () => Observable<Link[]>
    };

    let contactServiceStub: {
        getContacts: () => Observable<Contact[]>
    };

    beforeEach(() => {
        // stub ResourcesService for test reasons
        linkServiceStub = {
            getLinks: () => Observable.of([
                {
                    _id: 'buying_id',
                    userID: 'userID1',
                    name: 'Buying food',
                    subname: 'I went to the ice cream store today for a sundae.',
                    url: "buyfood.com"
                },
                {
                    _id: 'visit_id',
                    userID: 'userID2',
                    name: 'Visit mom',
                    subname: 'I went to my Mom\'s house to talk to her.',
                    url: "visitMom.org"
                },
                {
                    _id: 'running_id',
                    userID: 'userID3',
                    name: 'Go on run',
                    subname: 'I went on a 25 mile run today!',
                    url: "runWithMe.life"
                }
            ])
        };

        contactServiceStub = {
            getContacts: () => Observable.of([
                {
                    _id: 'buying_id',
                    userID: 'userID1',
                    name: 'Buying food',
                    email: 'food@food.com',
                    phone: "555-555-5555"
                },
                {
                    _id: 'visit_id',
                    userID: 'userID2',
                    name: 'Visit mom',
                    email: 'email@email.com',
                    phone: "444-444-4444"
                },
                {
                    _id: 'running_id',
                    userID: 'userID3',
                    name: 'Go on run',
                    email: 'run@run.com',
                    phone: "333-333-3333"
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule, RouterTestingModule],
            declarations: [ResourcesComponent],
            providers: [{provide: ResourcesService, useValue: linkServiceStub},
                {provide: ResourcesService, useValue: contactServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ResourcesComponent);
            resourceList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains all the links', () => {
        expect(resourceList.contacts.length).toBe(3);
    });

   /* it('contains a title called \'Buying food\'', () => {
        expect(journalList.journals.some((journal: Journal) => journal.title === 'Buying food')).toBe(true);
    });

    it('contains a title called \'Visit mom\'', () => {
        expect(journalList.journals.some((journal: Journal) => journal.title === 'Visit mom')).toBe(true);
    });

    it('contains a content called \'I went on a 25 mile run today!\'', () => {
        expect(journalList.journals.some((journal: Journal) => journal.content === 'I went on a 25 mile run today!')).toBe(true);
    });

    it('doesn\'t contain a title called \'Meet with Santa\'', () => {
        expect(journalList.journals.some((journal: Journal) => journal.title === 'Meet with Santa')).toBe(false);
    });

    it('has a journal dated: Sun Feb 12 16:32:41 CST 2018', () => {
        expect(journalList.journals.some((journal: Journal) => journal.date === 'Sun Feb 12 16:32:41 CST 2018')).toBe(true);
    });

    it('journal list filters by search for a certain title', () => {
        expect(journalList.filteredJournals.length).toBe(3);
        journalList.search = 'food';
        journalList.refreshJournals().subscribe(() => {
            expect(journalList.filteredJournals.length).toBe(1);
        });
    });

    it('journal list filters by search for a certain content', () => {
        expect(journalList.filteredJournals.length).toBe(3);
        journalList.search = 'today';
        journalList.refreshJournals().subscribe(() => {
            expect(journalList.filteredJournals.length).toBe(2);
        });
    });

    it('journal list filters by search for a certain date', () => {
        expect(journalList.filteredJournals.length).toBe(3);
        journalList.search = 'Jan';
        journalList.refreshJournals().subscribe(() => {
            expect(journalList.filteredJournals.length).toBe(1);
        });
    });*/

});

// This test is not passing because of sending XML requests. Fix!
/*describe('Misbehaving Journal List', () => {
    let journalList: JournalsComponent;
    let fixture: ComponentFixture<JournalsComponent>;

    let journalListServiceStub: {
        getJournals: () => Observable<Journal[]>
    };

    beforeEach(() => {
        // stub JournalsService for test reasons
        journalListServiceStub = {
            getJournals: () => Observable.create(observer => {
                observer.error('Error-prone observable');
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule, RouterTestingModule],
            declarations: [JournalsComponent, ArraySortPipe],
            providers: [{provide: JournalsService, useValue: journalListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(JournalsComponent);
            journalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('generates an error if we don\'t set up a JournalsService', () => {
        // Since the observer throws an error, we don't expect journals to be defined.
        expect(journalList.journals).toBeUndefined();
    });
});*/

/*describe('Adding a journal', () => {
    let journalList: JournalsComponent;
    let fixture: ComponentFixture<JournalsComponent>;
    const newJournal: Journal =   {
        _id: '',
        userID: 'userID4',
        content: 'To stay awake writing tests',
        title: 'Drink coffee',
        date: "Sun Feb 16 17:12:43 CST 2018"
    };
    const newId = 'coffee_id';

    let calledJournal: Journal;

    let journalListServiceStub: {
        getJournals: () => Observable<Journal[]>,
        addNewJournal: (newJournal: Journal) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (JournalListComponent, any) => {
            afterClosed: () => Observable<Journal>
        };
    };

    beforeEach(() => {
        calledJournal = null;
        // stub JournalsService for test reasons
        journalListServiceStub = {
            getJournals: () => Observable.of([]),
            addNewJournal: (journalToAdd: Journal) => {
                calledJournal = journalToAdd;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(newJournal);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule, RouterTestingModule],
            declarations: [JournalsComponent, ArraySortPipe],
            providers: [
                {provide: JournalsService, useValue: journalListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(JournalsComponent);
            journalList = fixture.componentInstance;
            fixture.detectChanges();
        });
        localStorage.isSignedIn = "true";
    }));

    it('calls JournalsService.addJournal', () => {
        expect(calledJournal).toBeNull();
        journalList.openAddJournalDialog();
        expect(calledJournal).toEqual(newJournal);
    });
});*/

/*
describe('Editing a journal', () => {
    let journalList: JournalsComponent;
    let fixture: ComponentFixture<JournalsComponent>;
    const editJournal: Journal =   {
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
        open: (JournalsComponent, any) => {
            afterClosed: () => Observable<Journal>
        };
    };

    beforeEach(() => {
        calledJournal = null;
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
                        return Observable.of(editJournal);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule, RouterTestingModule],
            declarations: [JournalsComponent, ArraySortPipe],
            providers: [
                {provide: JournalsService, useValue: journalListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(JournalsComponent);
            journalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('calls JournalsService.editJournal', () => {
        expect(calledJournal).toBeNull();
        journalList.openEditJournalDialog(this._id, this.title, this.content, this.date);
        expect(calledJournal).toEqual(editJournal);
    });
});
*/
