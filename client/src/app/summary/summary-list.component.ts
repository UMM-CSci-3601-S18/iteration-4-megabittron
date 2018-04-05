import {AfterViewInit, Component, OnInit} from '@angular/core';
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

export class SummaryListComponent implements AfterViewInit, OnInit {
    startDate;
    endDate;
    getDate;

    ctxBar: any;
    barCanvas: any;
    barChart: any;
    ctxLine: any;
    lineCanvas: any;
    lineChart: any;

    colorblindMode: boolean;
    happyColor: string;
    sadColor: string;
    mehColor: string;
    madColor: string;
    anxiousColor: string;

    nowDate = new Date(Date.now());
    nowUnix = this.nowDate.getTime();
    nowDay = this.nowDate.getDay();
    nowHour = this.nowDate.getHours();

    lastWeekUnix = this.nowUnix - 604800000;
    lastWeekDate = new Date(this.lastWeekUnix);
    lastDayUnix = this.nowUnix - 86400000;
    lastDayDate = new Date(this.lastDayUnix);


    // These are public so that tests can reference them (.spec.ts)
    public summarys: Summary[];
    public filteredSummarys: Summary[];
    public dateFilteredSummarys: Summary[];
    public pastWeekSummarys: Summary[];
    public pastDaySummarys: Summary[];



    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public summaryMood: string;
    public summaryIntensity: number;
    public inputType = "Day";
    public lineScale = "Week";

    // The ID of the
    private highlightedID: {'$oid': string} = { '$oid': '' };

    // Inject the SummaryListService into this component.
    constructor(public summaryListService: SummaryListService, public dialog: MatDialog) {

    }

    isHighlighted(summary: Summary): boolean {
        return summary._id['$oid'] === this.highlightedID['$oid'];
    }

    public filterDates(givenlist, searchStartDate: any, searchEndDate: any): Summary[] {
        this.dateFilteredSummarys = givenlist;
        // Filter by startDate

        if (searchStartDate != null) {

            this.dateFilteredSummarys = this.dateFilteredSummarys.filter(summary => {
                this.getDate = new Date(summary.date);
                return this.getDate >= searchStartDate;
            });
        }

        // Filter by endDate
        if (searchEndDate != null) {

            this.dateFilteredSummarys = this.dateFilteredSummarys.filter(summary => {
                this.getDate = new Date(summary.date);
                return this.getDate <= searchEndDate;
            });
        }
        return this.dateFilteredSummarys;
    }

    public pastWeekEmotions(givenSummarys):Summary[]{
        this.pastWeekSummarys = this.filterDates(givenSummarys, this.lastWeekDate, this.nowDate);
        return this.pastWeekSummarys;
    }

    public pastDayEmotions(givenSummarys):Summary[]{
        this.pastDaySummarys = this.filterDates(givenSummarys, this.lastDayDate, this.nowDate);
        return this.pastDaySummarys;
    }

    public filterSummarys(searchMood: string, searchIntensity: number, searchStartDate: any, searchEndDate: any): Summary[] {

        this.filteredSummarys = this.summarys;

        // Filter by Mood
        if (searchMood != null) {
            if(searchMood =="All"){
                this.filteredSummarys = this.filteredSummarys.filter(summary => {
                    return true;
                });

            } else{
                searchMood = searchMood.toLocaleLowerCase();
                this.filteredSummarys = this.filteredSummarys.filter(summary => {
                    return !searchMood || summary.mood.toLowerCase().indexOf(searchMood) !== -1;
                });
            }
        }

        // Filter by Intensity
        if (searchIntensity != null) {
            if (searchIntensity.toString() == "All") {
                this.filteredSummarys = this.filteredSummarys.filter(summary => {
                    return true;
                });
            }
            else {
                this.filteredSummarys = this.filteredSummarys.filter(summary => {
                    return !searchIntensity || searchIntensity.toString() == summary.intensity.toString();
                });
            }
        }

        this.filteredSummarys = this.filterDates(this.filteredSummarys, searchStartDate, searchEndDate);

        return this.filteredSummarys;
    }

    //xValue can represent hour or weekday
    filterBarGraph(xValue): number {
        console.log(this.filteredSummarys.length);
        let filterBarData = this.filteredSummarys;

        if(this.inputType == "Day") {
            filterBarData = filterBarData.filter(summary => {
                this.getDate = new Date(summary.date);
                return this.getDate.getDay() == xValue;
            });
        }
        else {
            if (this.inputType == "Hour") {
                filterBarData = filterBarData.filter(summary => {
                    this.getDate = new Date(summary.date);
                    return this.getDate.getHours() == xValue;
                });
            }
        }

        return filterBarData.length;
    }

    filterLineGraph(xValue, Searchmood): number {
        this.test3 = this.summarys.length;
        Searchmood = Searchmood.toLocaleLowerCase();
        let filterLineData = this.summarys.filter(summary => {
            return !Searchmood || summary.mood.toLowerCase().indexOf(Searchmood) !== -1;
        });

        this.test1 = filterLineData.length;

        if(this.lineScale == "Week") {
            filterLineData = this.pastWeekEmotions(filterLineData);
            filterLineData = filterLineData.filter(summary => {
                this.getDate = new Date(summary.date);
                return this.getDate.getDay() == xValue;
            });
        }
        else {
            if (this.lineScale == "Day") {
                filterLineData = this.pastDayEmotions(filterLineData).filter(summary => {
                    this.getDate = new Date(summary.date);
                    return this.getDate.getHours() == xValue;
                });
            }
        }

        this.test2 = this.pastWeekEmotions(filterLineData).length;

        return filterLineData.length;
    }

    test1: any;
    test2: any;
    test3: any;

    public modDay(day: number): Number {
        return (this.nowDay + 1 + day)%7;
    }

    public getPastDays(day: number): String {

        let today = (this.nowDay + 1 + day)%7;

        let strDay = '';
        if(today == 0){
            strDay = 'Sun';
        }
        if(today == 1){
            strDay = 'Mon';
        }
        if(today == 2){
            strDay = 'Tues';
        }
        if(today == 3){
            strDay = 'Wed';
        }
        if(today == 4){
            strDay = 'Thurs';
        }
        if(today == 5){
            strDay = 'Fri';
        }
        if(today == 6){
            strDay = 'Sat';
        }
        return strDay;
    }

    /**
     * Starts an asynchronous operation to update the emojis list
     *
     */

    updateChart(): void{

        this.barChart.destroy();
        this.barCanvas = document.getElementById("barChart");
        this.ctxBar = this.barCanvas;

        this.lineChart.destroy();
        this.lineCanvas = document.getElementById("lineChart");
        this.ctxLine = this.lineCanvas;

        if(this.colorblindMode){
            this.happyColor = "rgb(252,141,89)";
            this.sadColor = "rgb(69,117,180)";
            this.mehColor = "rgb(254,224,144)";
            this.madColor = "rgb(215,48,39)";
            this.anxiousColor = "rgb(145,191,219)";
        } else {
            this.happyColor = "rgb(64, 255, 0)";
            this.sadColor = "rgb(0, 128, 255)";
            this.mehColor = "rgb(100, 100, 100)";
            this.madColor = "rgb(255, 0, 0)";
            this.anxiousColor = "rgb(255, 128, 0)";
        }

        let type;
        let summaryDays;
        let summaryHours;
        let displayData;

        let lineType;
        let happy_daily_totals;
        let sad_daily_totals;
        let meh_daily_totals;
        let mad_daily_totals;
        let anxious_daily_totals;
        let lineData;


        let days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
        let hours = ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM',
            '8AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM',
            '5 PM', '6 PM', '7 PM', '8 PM','9 PM', '10 PM', '11 PM'];

        let pastDays = [
            this.getPastDays(0),
            this.getPastDays(1),
            this.getPastDays(2),
            this.getPastDays(3),
            this.getPastDays(4),
            this.getPastDays(5),
            this.getPastDays(6)
        ];
        let pastHours = [

        ];

        console.log(this.inputType);
        if(this.inputType == "Hour"){
            type = hours;

            summaryHours = {
                "label": "Total Number of Entries",
                "data": [
                    this.filterBarGraph('0'),
                    this.filterBarGraph('1'),
                    this.filterBarGraph('2'),
                    this.filterBarGraph('3'),
                    this.filterBarGraph('4'),
                    this.filterBarGraph('5'),
                    this.filterBarGraph('6'),
                    this.filterBarGraph('7'),
                    this.filterBarGraph('8'),
                    this.filterBarGraph('9'),
                    this.filterBarGraph('10'),
                    this.filterBarGraph('11'),
                    this.filterBarGraph('12'),
                    this.filterBarGraph('13'),
                    this.filterBarGraph('14'),
                    this.filterBarGraph('15'),
                    this.filterBarGraph('16'),
                    this.filterBarGraph('17'),
                    this.filterBarGraph('18'),
                    this.filterBarGraph('19'),
                    this.filterBarGraph('20'),
                    this.filterBarGraph('21'),
                    this.filterBarGraph('22'),
                    this.filterBarGraph('23'),
                    this.filterBarGraph('24')
                ],
                "fill": true,
                "backgroundColor": "blue",
                "borderColor": "black",
                "lineTension": 0.1
            };
            displayData = summaryHours;
        }
        else {
            if (this.inputType == "Day") {
                console.log("here");
                type = days;

                summaryDays = {
                    "label": "Total Number of Entries",
                    "data": [
                        this.filterBarGraph('0'),
                        this.filterBarGraph('1'),
                        this.filterBarGraph('2'),
                        this.filterBarGraph('3'),
                        this.filterBarGraph('4'),
                        this.filterBarGraph('5'),
                        this.filterBarGraph('6'),

                    ],


                    "fill": true,
                    "backgroundColor": "blue",
                    "borderColor": "black",
                    "lineTension": 0.1
                };

                displayData = summaryDays;
            }
        }

        if(this.lineScale == "Week") {
            lineType = pastDays;

            happy_daily_totals = {
                "label": "Happy",
                "data": [
                    this.filterLineGraph(this.modDay(0), 'happy'),
                    this.filterLineGraph(this.modDay(1), 'happy'),
                    this.filterLineGraph(this.modDay(2), 'happy'),
                    this.filterLineGraph(this.modDay(3), 'happy'),
                    this.filterLineGraph(this.modDay(4), 'happy'),
                    this.filterLineGraph(this.modDay(5), 'happy'),
                    this.filterLineGraph(this.modDay(6), 'happy')
                ],
                hidden: false,
                "fill": false,
                "borderColor": this.happyColor,
                "lineTension": 0.1
            };

            sad_daily_totals = {
                "label": "Sad",
                "data": [
                    this.filterLineGraph(this.modDay(0), 'sad'),
                    this.filterLineGraph(this.modDay(1), 'sad'),
                    this.filterLineGraph(this.modDay(2), 'sad'),
                    this.filterLineGraph(this.modDay(3), 'sad'),
                    this.filterLineGraph(this.modDay(4), 'sad'),
                    this.filterLineGraph(this.modDay(5), 'sad'),
                    this.filterLineGraph(this.modDay(6), 'sad')
                ],
                hidden: false,
                "fill": false,
                "borderColor": this.sadColor,
                "lineTension": 0.1
            };

            meh_daily_totals = {
                "label": "Meh",
                "data": [
                    this.filterLineGraph(this.modDay(0), 'meh'),
                    this.filterLineGraph(this.modDay(1), 'meh'),
                    this.filterLineGraph(this.modDay(2), 'meh'),
                    this.filterLineGraph(this.modDay(3), 'meh'),
                    this.filterLineGraph(this.modDay(4), 'meh'),
                    this.filterLineGraph(this.modDay(5), 'meh'),
                    this.filterLineGraph(this.modDay(6), 'meh')
                ],
                hidden: false,
                "fill": false,
                "borderColor": this.mehColor,
                "lineTension": 0.1
            };

            mad_daily_totals = {
                "label": "Mad",
                "data": [
                    this.filterLineGraph(this.modDay(0), 'mad'),
                    this.filterLineGraph(this.modDay(1), 'mad'),
                    this.filterLineGraph(this.modDay(2), 'mad'),
                    this.filterLineGraph(this.modDay(3), 'mad'),
                    this.filterLineGraph(this.modDay(4), 'mad'),
                    this.filterLineGraph(this.modDay(5), 'mad'),
                    this.filterLineGraph(this.modDay(6), 'mad')
                ],
                hidden: false,
                "fill": false,
                "borderColor": this.madColor,
                "lineTension": 0.1
            };

            anxious_daily_totals = {
                "label": "Anxious",
                "data": [
                    this.filterLineGraph(this.modDay(0), 'anxious'),
                    this.filterLineGraph(this.modDay(1), 'anxious'),
                    this.filterLineGraph(this.modDay(2), 'anxious'),
                    this.filterLineGraph(this.modDay(3), 'anxious'),
                    this.filterLineGraph(this.modDay(4), 'anxious'),
                    this.filterLineGraph(this.modDay(5), 'anxious'),
                    this.filterLineGraph(this.modDay(6), 'mad')
                ],
                hidden: false,
                "fill": false,
                "borderColor": this.anxiousColor,
                "lineTension": 0.1
            };
            lineData = [
                happy_daily_totals,
                sad_daily_totals,
                meh_daily_totals,
                mad_daily_totals,
                anxious_daily_totals
            ]
        } else {

        }


        this.barChart = new Chart(this.ctxBar, {
            type: 'bar',
            data: {

                labels: type,
                datasets: [displayData]
            },
            options: {
                responsive: true,
                maintainAspectRation: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true

                        }
                    }]
                }
            }
        });

        this.lineChart = new Chart(this.ctxLine, {
            type: 'line',
            data: {
                labels: lineType,
                datasets: lineData
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

    buildChart(): void {

        this.barCanvas = document.getElementById("barChart");
        this.ctxBar = this.barCanvas;

        this.lineCanvas = document.getElementById("lineChart");
        this.ctxLine= this.lineCanvas;

        if(this.colorblindMode){
            this.happyColor = "rgb(252,141,89)";
            this.sadColor = "rgb(69,117,180)";
            this.mehColor = "rgb(254,224,144)";
            this.madColor = "rgb(215,48,39)";
            this.anxiousColor = "rgb(145,191,219)";
        } else {
            this.happyColor = "rgb(64, 255, 0)";
            this.sadColor = "rgb(0, 128, 255)";
            this.mehColor = "rgb(100, 100, 100)";
            this.madColor = "rgb(255, 0, 0)";
            this.anxiousColor = "rgb(255, 128, 0)";
        }


        let summaryDays;

        let days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

        let pastDays = [
            this.getPastDays(0),
            this.getPastDays(1),
            this.getPastDays(2),
            this.getPastDays(3),
            this.getPastDays(4),
            this.getPastDays(5),
            this.getPastDays(6)
        ];

        summaryDays = {
            "label": "Total Number of Entries",
            "data": [
                this.filterBarGraph('0'),
                this.filterBarGraph('1'),
                this.filterBarGraph('2'),
                this.filterBarGraph('3'),
                this.filterBarGraph('4'),
                this.filterBarGraph('5'),
                this.filterBarGraph('6'),

            ],
            "fill": true,
            "backgroundColor": "blue",
            "borderColor": "black",
            "lineTension": 0.3
        };

        let happy_daily_totals = {"label":"Happy",
            "data":[
                this.filterLineGraph(this.modDay(0), 'happy'),
                this.filterLineGraph(this.modDay(1), 'happy'),
                this.filterLineGraph(this.modDay(2), 'happy'),
                this.filterLineGraph(this.modDay(3), 'happy'),
                this.filterLineGraph(this.modDay(4), 'happy'),
                this.filterLineGraph(this.modDay(5), 'happy'),
                this.filterLineGraph(this.modDay(6), 'happy')
            ],
            hidden: false,
            "fill":false,
            "borderColor":this.happyColor,
            "lineTension":0.1};

        let sad_daily_totals = {"label":"Sad",
            "data":[
                this.filterLineGraph(this.modDay(0), 'sad'),
                this.filterLineGraph(this.modDay(1), 'sad'),
                this.filterLineGraph(this.modDay(2), 'sad'),
                this.filterLineGraph(this.modDay(3), 'sad'),
                this.filterLineGraph(this.modDay(4), 'sad'),
                this.filterLineGraph(this.modDay(5), 'sad'),
                this.filterLineGraph(this.modDay(6), 'sad')
            ],
            hidden: false,
            "fill":false,
            "borderColor":this.sadColor,
            "lineTension":0.1};

        let meh_daily_totals = {"label":"Meh",
            "data":[
                this.filterLineGraph(this.modDay(0), 'meh'),
                this.filterLineGraph(this.modDay(1), 'meh'),
                this.filterLineGraph(this.modDay(2), 'meh'),
                this.filterLineGraph(this.modDay(3), 'meh'),
                this.filterLineGraph(this.modDay(4), 'meh'),
                this.filterLineGraph(this.modDay(5), 'meh'),
                this.filterLineGraph(this.modDay(6), 'meh')
            ],
            hidden: false,
            "fill":false,
            "borderColor":this.mehColor,
            "lineTension":0.1};

        let mad_daily_totals = {"label":"Mad",
            "data":[
                this.filterLineGraph(this.modDay(0), 'mad'),
                this.filterLineGraph(this.modDay(1), 'mad'),
                this.filterLineGraph(this.modDay(2), 'mad'),
                this.filterLineGraph(this.modDay(3), 'mad'),
                this.filterLineGraph(this.modDay(4), 'mad'),
                this.filterLineGraph(this.modDay(5), 'mad'),
                this.filterLineGraph(this.modDay(6), 'mad')
            ],
            hidden: false,
            "fill":false,
            "borderColor":this.madColor,
            "lineTension":0.1};

        let anxious_daily_totals = {"label":"Anxious",
            "data":[
                this.filterLineGraph(this.modDay(0), 'anxious'),
                this.filterLineGraph(this.modDay(1), 'anxious'),
                this.filterLineGraph(this.modDay(2), 'anxious'),
                this.filterLineGraph(this.modDay(3), 'anxious'),
                this.filterLineGraph(this.modDay(4), 'anxious'),
                this.filterLineGraph(this.modDay(5), 'anxious'),
                this.filterLineGraph(this.modDay(6), 'mad')
            ],
            hidden: false,
            "fill":false,
            "borderColor":this.anxiousColor,
            "lineTension":0.1};

        this.barChart = new Chart(this.ctxBar, {
            type: 'bar',
            data: {
                labels: days,
                datasets: [summaryDays]
            },
            options: {
                responsive: true,
                maintainAspectRation: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true

                        }
                    }]
                }
            }
        });

        this.lineChart = new Chart(this.ctxLine, {
            type: 'line',
            data: {
                labels: pastDays,
                datasets: [
                    happy_daily_totals,
                    sad_daily_totals,
                    meh_daily_totals,
                    mad_daily_totals,
                    anxious_daily_totals
                ]
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
                this.filterSummarys(this.summaryMood, this.summaryIntensity, this.startDate, this.endDate);
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
    }

    stringToDate(date: string): any {
        return new Date(date);
    }

}

