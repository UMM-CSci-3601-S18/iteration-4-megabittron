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


        /** Tests the filtering used for display of summary list **/
/*
        describe('Summary', () => {

            let summary: SummaryListComponent;
            let fixture: ComponentFixture<SummaryListComponent>;

            let summaryServiceStub: {
                getSummaries: () => Observable<Summary[]>
            };

            beforeEach(() => {
                // stub SummaryListService for test purposes
                summaryServiceStub = {
                    getSummaries: () => Observable.of([
                        {
                            _id: '1',
                            mood: 'happy',
                            date: 'Sat Apr 07 2018 15:23:28 GMT-0500 (CDT)',
                            intensity: 2,
                            description: 'slept',
                        },
                        {
                            _id: '2',
                            mood: 'sad',
                            date: 'Thu Apr 05 2018 15:23:28 GMT-0500 (CDT)',
                            intensity: 4,
                            description: 'friend died',
                        },
                        {
                            _id: '3',
                            mood: 'mad',
                            date: 'Sun Apr 08 2018 15:23:28 GMT-0500 (CDT)',
                            intensity: 5,
                            description: 'didn\'t sleep',
                        },
                    ])
                };


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

                    summary.summaryMood = 'All';
                    summary.summaryIntensity = 'All';
                    summary.startDate = null;
                    summary.endDate = null;
                });
            }));

            it('contains all the summaries', () => {
        expect(summary.summaries.length).toBe(3);
            });

            it('contains a summary mood \'happy\'', () => {
        expect(summary.summaries.some((summary: Summary) => summary.mood === 'happy')).toBe(true);
            });

            it('contain a summary id \'2\'', () => {
        expect(summary.summaries.some((summary: Summary) => summary._id === '2')).toBe(true);
            });

            it('doesn\'t contain a summary id \'4\'', () => {
        expect(summary.summaries.some((summary: Summary) => summary._id === '4')).toBe(false);
            });

            it('summary filters by mood', () => {
                expect(summary.filteredSummaries.length).toBe(3);
                summary.summaryMood = 'sad';
                summary.refreshSummaries().subscribe(() => {
                    expect(summary.filteredSummaries.length).toBe(1);
                });
            });

            it('summary filters by intensity', () => {
                expect(summary.filteredSummaries.length).toBe(3);
                summary.summaryIntensity = '4';
                summary.refreshSummaries().subscribe(() => {
                    expect(summary.filteredSummaries.length).toBe(1);
                });
            });

            it('summary filters by mood and intensity', () => {
                expect(summary.filteredSummaries.length).toBe(3);
                summary.summaryMood = 'sad';
                summary.summaryIntensity = '4';
                summary.refreshSummaries().subscribe(() => {
                    expect(summary.filteredSummaries.length).toBe(1);
                });
            });

            it('summary filters by start date', () => {
                expect(summary.filteredSummaries.length).toBe(3);
                summary.startDate = new Date('Fri Apr 06 2018 15:23:28 GMT-0500 (CDT)');
                summary.refreshSummaries().subscribe(() => {
                    expect(summary.filteredSummaries.length).toBe(2);
                });
            });

            it('summary filters by end date', () => {
                expect(summary.filteredSummaries.length).toBe(3);
                summary.endDate = new Date('Fri Apr 06 2018 15:23:28 GMT-0500 (CDT)');
                summary.refreshSummaries().subscribe(() => {
                    expect(summary.filteredSummaries.length).toBe(1);
                });
            });

            it('summary filters by mood, intensity, start and end date', () => {
                expect(summary.filteredSummaries.length).toBe(3);
                summary.summaryMood = 'happy';
                summary.summaryIntensity = '2';
                summary.startDate = new Date('Fri Apr 06 2018 15:23:28 GMT-0500 (CDT)');
                summary.endDate = new Date('Sat Apr 07 2018 20:00:00 GMT-0500 (CDT)');
                summary.refreshSummaries().subscribe(() => {
                    expect(summary.filteredSummaries.length).toBe(1);
                });
            });

            it('clearDateFilter() works', () => {
                expect(summary.filteredSummaries.length).toBe(3);
                summary.startDate = 'Fri Apr 06 2018 15:23:28 GMT-0500 (CDT)';
                summary.endDate = 'Sat Apr 07 2018 20:00:00 GMT-0500 (CDT)';
                expect(summary.startDate).toBe('Fri Apr 06 2018 15:23:28 GMT-0500 (CDT)');
                expect(summary.endDate).toBe('Sat Apr 07 2018 20:00:00 GMT-0500 (CDT)');
                summary.clearDateFilter();
                expect(summary.startDate).toBe(null);
                expect(summary.endDate).toBe(null);

            });

        });
*/
        /** Tests the filtering used for charts when looking at all time **/
/*
        describe('Chart Filtering - no limit', () => {

            let summary: SummaryListComponent;
            let fixture: ComponentFixture<SummaryListComponent>;

            let summaryServiceStub: {
                getSummaries: () => Observable<Summary[]>
            };

            beforeEach(() => {
                // stub SummaryListService for test purposes
                summaryServiceStub = {
                    getSummaries: () => Observable.of([
                        {
                            _id: '1',
                            mood: 'happy',
                            date: 'Sat Apr 07 2018 15:23:28 GMT-0500 (CDT)',
                            intensity: 2,
                            description: 'slept',
                        },
                        {
                            _id: '2',
                            mood: 'sad',
                            date: 'Thu Apr 05 2018 15:23:28 GMT-0500 (CDT)',
                            intensity: 4,
                            description: 'friend died',
                        },
                        {
                            _id: '3',
                            mood: 'mad',
                            date: 'Sun Apr 08 2018 15:23:28 GMT-0500 (CDT)',
                            intensity: 5,
                            description: 'didn\'t sleep',
                        },
                    ])
                };


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

                    summary.summaryMood = 'All';
                    summary.summaryIntensity = 'All';
                    summary.startDate = null;
                    summary.endDate = null;
                    summary.limitedPast = false;
                });
            }));

            it('filterLineGraph filters correctly for all time', () => {
                expect(summary.summaries.length).toBe(3);
                expect(summary.filterLineGraph(0, 'mad')).toBe(1);
                expect(summary.filterLineGraph(2, 'mad')).toBe(0);
            });

            it('filterBarGraph filters correctly for all time', () => {
                expect(summary.filteredSummaries.length).toBe(3);
                expect(summary.filterBarGraph(0)).toBe(1);
                expect(summary.filterBarGraph(2)).toBe(0);
            });

        });
*/
        /** Tests the filtering used for charts when looking at past day **/
/*
        describe('Chart Filtering - Past Day', () => {

            let summary: SummaryListComponent;
            let fixture: ComponentFixture<SummaryListComponent>;

            let summaryServiceStub: {
                getSummaries: () => Observable<Summary[]>
            };

            beforeEach(() => {
                // stub SummaryListService for test purposes
                summaryServiceStub = {
                    getSummaries: () => Observable.of([
                        {
                            _id: '1',
                            mood: 'happy',
                            date: 'Sat Apr 07 2018 15:23:28 GMT-0500 (CDT)',
                            intensity: 2,
                            description: 'slept',
                        },
                        {
                            _id: '2',
                            mood: 'sad',
                            date: 'Thu Apr 05 2018 15:23:28 GMT-0500 (CDT)',
                            intensity: 4,
                            description: 'friend died',
                        },
                        {
                            _id: '3',
                            mood: 'mad',
                            date: 'Sun Apr 08 2018 15:23:28 GMT-0500 (CDT)',
                            intensity: 5,
                            description: 'didn\'t sleep',
                        },
                    ])
                };


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

                    summary.summaryMood = 'All';
                    summary.summaryIntensity = 'All';
                    summary.startDate = null;
                    summary.endDate = null;
                    summary.limitedPast = true;
                    summary.nowStamp = new Date('Sun Apr 08 2018 20:00:00 GMT-0500 (CDT)');
                    // Above means nowHour becomes 20
                    summary.nowUnix = summary.nowStamp.getTime();
                    summary.nowHour = summary.nowStamp.getHours();
                    summary.lastDayUnix = summary.nowUnix - 86400000;
                    summary.lastDayDate = new Date(summary.lastDayUnix);
                    summary.inputType = "day";
                });
            }));

            it('filterLineGraph filters correctly for inputType = day', () => {
                expect(summary.summaries.length).toBe(3);
                expect(summary.filterLineGraph(15, 'mad')).toBe(1);
                expect(summary.filterLineGraph(2, 'mad')).toBe(0);
            });

            it('filterBarGraph filters correctly for inputType = day', () => {
                expect(summary.filteredSummaries.length).toBe(3);
                expect(summary.filterBarGraph(15)).toBe(1);
                expect(summary.filterBarGraph(2)).toBe(0);
            });

            it('modHour works as intended', () => {
                expect(summary.modHour(23)).toBe(20);
                expect(summary.modHour(0)).toBe(21);
                expect(summary.modHour(30)).toBe(3);
            });

            it('filterLineGraph works correctly when using modHour', () => {
                expect(summary.summaries.length).toBe(3);
                expect(summary.filterLineGraph(summary.modHour(18), 'mad')).toBe(1);
                expect(summary.filterLineGraph(summary.modHour(0), 'mad')).toBe(0);
            });

            it('filterBarGraph works correctly when using modHour', () => {
                expect(summary.filteredSummaries.length).toBe(3);
                expect(summary.filterBarGraph(summary.modHour(18))).toBe(1);
                expect(summary.filterBarGraph(summary.modHour(0))).toBe(0);
            });

            it('getPastHours works as intended', () => {
                expect(summary.getPastHours(1)).toBe('10 PM');
                expect(summary.getPastHours(13)).toBe('10 AM');
                expect(summary.getPastHours(0)).toBe('9 PM');
                expect(summary.getPastHours(12)).toBe('9 AM');
            });

        });
*/
        /** Tests the filtering used for charts when looking at past week **/
/*
        describe('Chart Filtering - Past Week', () => {

            let summary: SummaryListComponent;
            let fixture: ComponentFixture<SummaryListComponent>;

            let summaryServiceStub: {
                getSummaries: () => Observable<Summary[]>
            };

            beforeEach(() => {
                // stub SummaryListService for test purposes
                summaryServiceStub = {
                    getSummaries: () => Observable.of([
                        {
                            _id: '1',
                            mood: 'happy',
                            date: 'Sat Apr 07 2018 15:23:28 GMT-0500 (CDT)',
                            intensity: 2,
                            description: 'slept',
                        },
                        {
                            _id: '2',
                            mood: 'sad',
                            date: 'Thu Apr 05 2018 15:23:28 GMT-0500 (CDT)',
                            intensity: 4,
                            description: 'friend died',
                        },
                        {
                            _id: '3',
                            mood: 'mad',
                            date: 'Sun Apr 08 2018 15:23:28 GMT-0500 (CDT)',
                            intensity: 5,
                            description: 'didn\'t sleep',
                        },
                    ])
                };


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

                    summary.summaryMood = 'All';
                    summary.summaryIntensity = 'All';
                    summary.startDate = null;
                    summary.endDate = null;
                    summary.limitedPast = true;
                    summary.nowStamp = new Date('Sun Apr 08 2018 20:00:00 GMT-0500 (CDT)');
                    // Above means nowDay becomes 0
                    summary.nowUnix = summary.nowStamp.getTime();
                    summary.nowDay = summary.nowStamp.getDay();
                    summary.lastWeekUnix = summary.nowUnix - 604800000;
                    summary.lastWeekDate = new Date(summary.lastWeekUnix);
                    summary.inputType = "week";
                });
            }));

            it('filterLineGraph filters correctly for inputType = week', () => {
                expect(summary.summaries.length).toBe(3);
                expect(summary.filterLineGraph(4, 'sad')).toBe(1);
                expect(summary.filterLineGraph(2, 'sad')).toBe(0);
            });

            it('filterBarGraph filters correctly for inputType = week', () => {
                expect(summary.filteredSummaries.length).toBe(3);
                expect(summary.filterBarGraph(4)).toBe(1);
                expect(summary.filterBarGraph(2)).toBe(0);
            });

            it('modDay works as intended', () => {
                expect(summary.modDay(6)).toBe(0);
                expect(summary.modDay(0)).toBe(1);
                expect(summary.modDay(30)).toBe(3);
            });

            it('filterLineGraph works correctly when using modDay', () => {
                expect(summary.summaries.length).toBe(3);
                expect(summary.filterLineGraph(summary.modDay(10), 'sad')).toBe(1);
                expect(summary.filterLineGraph(summary.modDay(0), 'sad')).toBe(0);
            });

            it('filterBarGraph works correctly when using modDay', () => {
                expect(summary.filteredSummaries.length).toBe(3);
                expect(summary.filterBarGraph(summary.modDay(10))).toBe(1);
                expect(summary.filterBarGraph(summary.modDay(0))).toBe(0);
            });

            it('getPastDays works as intended', () => {
                expect(summary.getPastDays(0)).toBe('Mon');
                expect(summary.getPastDays(6)).toBe('Sun');
                expect(summary.getPastDays(3)).toBe('Thurs');
            });

        });
       */


        /** -------------------------------------------------------- **/
/*
describe('Misbehaving Summary ', () => {
    let summary: SummaryListComponent;
    let fixture: ComponentFixture<SummaryListComponent>;

    let summaryServiceStub: {
        getSummaries: () => Observable<Summary[]>
    };

    beforeEach(() => {
        // stub SummaryService for test purposes
        summaryServiceStub = {
            getSummaries: () => Observable.create(observer => {
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
        // Since the observer throws an error, we don't expect summaries to be defined.
        expect(summary.summaries).toBeUndefined();
    });
});
*/
