import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Summary} from './summary';
import {SummaryListComponent} from "./summary-list.component";
import {SummaryListService} from "./summary-list.service";
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

describe('Summary ', () => {

    let summary: SummaryListComponent;
    let fixture: ComponentFixture<SummaryListComponent>;

    let summaryServiceStub: {
        getSummarys: () => Observable<Summary[]>
    };

    const getSummarys: Summary[] = [
        {
            _id: '1',
            mood: 'happy',
            date: '03/13/2018',
            intensity: 2,
            description: 'slept',
        },
        {
            _id: '2',
            mood: 'sad',
            date: '03/14/2018',
            intensity: 4,
            description: 'friend died',
        },
        {
            _id: '3',
            mood: 'mad',
            date: '03/15/2018',
            intensity: 5,
            description: 'didnt sleep',
        },
    ];

    beforeEach(() => {
        /*// stub SummaryListService for test purposes
        summaryServiceStub = {
            getSummary: () => Observable.of([
                {
                    _id: '1',
                    mood: 'happy',
                    date: '03/13/2018',
                    intensity: 2,
                    description: 'slept',
                },
                {
                    _id: '2',
                    mood: 'sad',
                    date: '03/14/2018',
                    intensity: 4,
                    description: 'friend died',
                },
                {
                    _id: '3',
                    mood: 'mad',
                    date: '03/15/2018',
                    intensity: 5,
                    description: 'didnt sleep',
                },
            ])
        };*/

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [SummaryListComponent],
            providers: [{provide: SummaryListService, useValue: summaryServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(SummaryListComponent);
            summary = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains all the summarys', () => {
        expect(summary.summarys.length).toBe(3);
    });

    it('contains a summary mood \'happy\'', () => {
        expect(summary.summarys.some((summary: Summary) => summary.mood === 'happy')).toBe(true);
    });

    it('contain a summary id \'2\'', () => {
        expect(summary.summarys.some((summary: Summary) => summary._id === '2')).toBe(true);
    });

    it('doesn\'t contain a summary id \'4\'', () => {
        expect(summary.summarys.some((summary: Summary) => summary._id === '4')).toBe(false);
    });

    it('has a mood', () => {
        expect(summary.summarys.filter((summary: Summary) => summary.mood === 'd').length).toBe(2);
    });
});

    /*it('summary filters by mood', () => {
        expect(summary.filteredSummarys.length).toBe(3);
        summary.summaryMood = 'd';
        summary.refreshSummarys().subscribe(() => {
            expect(summary.filteredSummarys.length).toBe(2);
        });
    });

    /!*it('summary filters by intensity', () => {
        expect(summary.filteredSummarys.length).toBe(3);
        summary.summaryMood = 'mad';
        summary.refreshSummarys().subscribe(() => {
            expect(summary.filteredSummarys.length).toBe(1);
        });
    });*!/

    it('summary filters by mood and intensity', () => {
        expect(summary.filteredSummarys.length).toBe(3);
        summary.summaryMood = 'sad';
        summary.summaryIntensity = 4;
        summary.refreshSummarys().subscribe(() => {
            expect(summary.filteredSummarys.length).toBe(1);
        });
    });

});

describe('Misbehaving Summary ', () => {
    let summary: SummaryListComponent;
    let fixture: ComponentFixture<SummaryListComponent>;

    let summaryServiceStub: {
        getSummarys: () => Observable<Summary[]>
    };

    beforeEach(() => {
        // stub SummaryService for test purposes
        summaryServiceStub = {
            getSummarys: () => Observable.create(observer => {
                observer.error('Error-prone observable');
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [SummaryListComponent],
            providers: [{provide: SummaryListService, useValue: summaryServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(SummaryListComponent);
            summary = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('generates an error if we don\'t set up a SummaryService', () => {
        // Since the observer throws an error, we don't expect summarys to be defined.
        expect(summary.summarys).toBeUndefined();
    });
});*/



/*describe('Adding a summary', () => {
    let summary: SummaryListComponent;
    let fixture: ComponentFixture<SummaryListComponent>;
    const newSummary: Summary = {
        _id: '5',
        mood: 'med',
        date: '03/15/2018',
        intensity: 5,
        description: 'didnt sleep',
    };
    const newId = '5';

    let calledSummary: Summary;

    let summaryServiceStub: {
        getSummarys: () => Observable<Summary[]>,
        addNewSummary: (newSummary: Summary) => Observable<{ '$oid': string }>
    };
    let mockMatDialog: {
        open: (AddSummaryComponent, any) => {
            afterClosed: () => Observable<Summary>
        };
    };

    beforeEach(() => {
        calledSummary = null;
        // stub SummaryService for test purposes
        summaryServiceStub = {
            getSummarys: () => Observable.of([]),
            addNewSummary: (summaryToAdd: Summary) => {
                calledSummary = summaryToAdd;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(newSummary);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [SummaryListComponent],
            providers: [
                {provide: SummaryListService, useValue: summaryServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(SummaryListComponent);
            summary = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));
});*/
