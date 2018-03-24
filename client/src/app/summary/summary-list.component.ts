
import {Component, OnInit} from '@angular/core';
import {Inject} from '@angular/core';
import {SummaryListService} from './summary-list.service';
import {Summary} from './summary';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import * as Chart from 'chart.js';

@Component({
    selector: 'app-summary-list-component',
    templateUrl: 'summary-list.component.html',
    styleUrls: ['./summary-list.component.css'],
})

export class SummaryListComponent implements OnInit {
    startDate;
    endDate;
    getDate;

    canvas: any;
    ctx: any;

    // These are public so that tests can reference them (.spec.ts)
    public summarys: Summary[];
    public filteredSummarys: Summary[];

    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public summaryMood: string;

    // The ID of the
    private highlightedID: {'$oid': string} = { '$oid': '' };

    // Inject the SummaryListService into this component.
    constructor(public summaryListService: SummaryListService, public dialog: MatDialog) {

    }

    isHighlighted(summary: Summary): boolean {
        return summary._id['$oid'] === this.highlightedID['$oid'];
    }

    public filterSummarys(searchMood: string, searchStartDate: any, searchEndDate: any): Summary[] {

        this.filteredSummarys = this.summarys;

        // Filter by Mood
        if (searchMood != null) {
            searchMood = searchMood.toLocaleLowerCase();

            this.filteredSummarys = this.filteredSummarys.filter(summary => {
                return !searchMood || summary.mood.toLowerCase().indexOf(searchMood) !== -1;
            });
        }

        // Filter by startDate
        if (searchStartDate != null) {

            this.filteredSummarys = this.filteredSummarys.filter(summary => {
                this.getDate = new Date(summary.date);
                return this.getDate >= this.startDate;
            });
        }

        // Filter by endDate
        if (searchEndDate != null) {

            this.filteredSummarys = this.filteredSummarys.filter(summary => {
                this.getDate = new Date(summary.date);
                return this.getDate <= this.endDate;
            });
        }

        return this.filteredSummarys;
    }

    filterChart(weekday, mood): number {
        /*this.chartEmojis = this.prefilteredEmojis;


        // Filter by value
        this.chartEmojis = this.chartEmojis.filter(emoji => {
            return !mood.toString() || emoji.mood.toString().indexOf(mood.toString()) !== -1;//??????
        });

        // Filter by day of the week
        this.chartEmojis = this.chartEmojis.filter(emoji => {
            return !weekday || emoji.date.indexOf(weekday) !== -1;
        });*/

        // return number of emojis left after filter
        return this.filteredSummarys.length;
    }

    /**
     * Starts an asynchronous operation to update the emojis list
     *
     */

    buildChart(): void {

        this.canvas = document.getElementById("myChart");
        this.ctx = this.canvas;

        let days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

        let very_sad_daily_totals = {"label":"Very Sad",
            "data":[
                this.filterChart('Sun', '1'),
                this.filterChart('Mon', '1'),
                this.filterChart('Tue', '1'),
                this.filterChart('Wed', '1'),
                this.filterChart('Thu', '1'),
                this.filterChart('Fri', '1'),
                this.filterChart('Sat', '1')
            ],
            "fill":false,
            "borderColor":"rgb(150, 0, 100)",
            "lineTension":0.1};

        let sad_daily_totals = {"label":"Sad",
            "data":[
                this.filterChart('Sun', '2'),
                this.filterChart('Mon', '2'),
                this.filterChart('Tue', '2'),
                this.filterChart('Wed', '2'),
                this.filterChart('Thu', '2'),
                this.filterChart('Fri', '2'),
                this.filterChart('Sat', '2')
            ],
            "fill":false,
            "borderColor":"rgb(150, 75, 75)",
            "lineTension":0.1};

        let neutral_daily_totals = {"label":"Neutral",
            "data":[
                this.filterChart('Sun', '3'),
                this.filterChart('Mon', '3'),
                this.filterChart('Tue', '3'),
                this.filterChart('Wed', '3'),
                this.filterChart('Thu', '3'),
                this.filterChart('Fri', '3'),
                this.filterChart('Sat', '3')
            ],
            "fill":false,
            "borderColor":"rgb(175, 175, 175)",
            "lineTension":0.1};

        let happy_daily_totals = {"label":"Happy",
            "data":[
                this.filterChart('Sun', '4'),
                this.filterChart('Mon', '4'),
                this.filterChart('Tue', '4'),
                this.filterChart('Wed', '4'),
                this.filterChart('Thu', '4'),
                this.filterChart('Fri', '4'),
                this.filterChart('Sat', '4')
            ],
            "fill":false,
            "borderColor":"rgb(75, 192, 192)",
            "lineTension":0.1};

        let very_happy_daily_totals = {"label":"Very Happy",
            "data":[
                this.filterChart('Sun', '5'),
                this.filterChart('Mon', '5'),
                this.filterChart('Tue', '5'),
                this.filterChart('Wed', '5'),
                this.filterChart('Thu', '5'),
                this.filterChart('Fri', '5'),
                this.filterChart('Sat', '5')
            ],
            "fill":false,
            "borderColor":"rgb(200, 200, 0)",
            "lineTension":0.1};

        let myChart = new Chart(this.ctx, {
            type: 'bar',
            data: {
                labels: days,
                datasets: [very_sad_daily_totals,
                    sad_daily_totals,
                    neutral_daily_totals,
                    happy_daily_totals,
                    very_happy_daily_totals]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
    }

    ngAfterViewInit(): void {

        this.buildChart();
    }

    /*
     * Starts an asynchronous operation to update the users list
     *
     */
    refreshSummarys(): Observable<Summary[]> {
        // Get Users returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)
        const summaryListObservable: Observable<Summary[]> = this.summaryListService.getSummarys();
        summaryListObservable.subscribe(
            summarys => {
                this.summarys = summarys;
                this.filterSummarys(this.summaryMood, this.startDate, this.endDate);
            },
            err => {
                console.log(err);
            });
        return summaryListObservable;
    }


    loadService(): void {
        this.summaryListService.getSummarys(this.summaryMood).subscribe(
            summarys => {
                this.summarys = summarys;
                this.filteredSummarys = this.summarys;
            },
            err => {
                console.log(err);
            }
        );
    }

    totalNumberEntries(): number{
        return this.summarys.length;
    }

    totalNumberMoods(): number{
        return this.filteredSummarys.length;
    }

    returnTime(mood: string): string{
        return "";
    }

    ngOnInit(): void {
        this.refreshSummarys();
        this.loadService();
        this.startDate = new Date();
        this.startDate.setHours(0,0,0,0)
        this.endDate = new Date();
        this.endDate.setHours(23,59,59,0)
    }
}

