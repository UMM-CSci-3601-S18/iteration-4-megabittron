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
        Searchmood = Searchmood.toLocaleLowerCase();
        let filterLineData = this.summarys.filter(summary => {
            return !Searchmood || summary.mood.toLowerCase().indexOf(Searchmood) !== -1;
        });

        if(this.lineScale == 'Week') {
            filterLineData = this.pastWeekEmotions(filterLineData);
            filterLineData = filterLineData.filter(summary => {
                this.getDate = new Date(summary.date);
                return this.getDate.getDay() == xValue;
            });
        }
        else {
            if (this.lineScale == 'Day') {
                filterLineData = this.pastDayEmotions(filterLineData);
                filterLineData = filterLineData.filter(summary => {
                    this.getDate = new Date(summary.date);
                    return this.getDate.getHours() == xValue;
                });
            }
        }

        return filterLineData.length;
    }


    public modDay(day: number): Number {
        return (this.nowDay + 1 + day)%7;
    }

    public modHour(hour: number): Number {
        return (this.nowHour + 1 + hour)%24;
    }

    public getPastDays(day: number): String {

        let thisDay = (this.nowDay + 1 + day)%7;

        let strDay = '';
        if(thisDay == 0){
            strDay = 'Sun';
        }
        if(thisDay == 1){
            strDay = 'Mon';
        }
        if(thisDay == 2){
            strDay = 'Tues';
        }
        if(thisDay == 3){
            strDay = 'Wed';
        }
        if(thisDay == 4){
            strDay = 'Thurs';
        }
        if(thisDay == 5){
            strDay = 'Fri';
        }
        if(thisDay == 6){
            strDay = 'Sat';
        }
        return strDay;
    }

    public getPastHours(hour: number): String {

        let thisHour = (this.nowHour + 1 + hour)%24;

        let strHour = '';
        let timeSuffix = '';

        if(thisHour < 12){
            strHour = thisHour.toString();
            timeSuffix = ' AM';
        } else {
            strHour = (thisHour %12).toString();
            timeSuffix = ' PM';
        }
        if(strHour == '0'){
            strHour = '12';
        }

        return strHour + timeSuffix;
    }

    public getDailyData(emotion){
        return [
            this.filterLineGraph(this.modHour(0), emotion),
            this.filterLineGraph(this.modHour(1), emotion),
            this.filterLineGraph(this.modHour(2), emotion),
            this.filterLineGraph(this.modHour(3), emotion),
            this.filterLineGraph(this.modHour(4), emotion),
            this.filterLineGraph(this.modHour(5), emotion),
            this.filterLineGraph(this.modHour(6), emotion)
        ]
    }

    public getHourlyData(emotion){

        return [
            this.filterLineGraph(this.modHour(0), emotion),
            this.filterLineGraph(this.modHour(1), emotion),
            this.filterLineGraph(this.modHour(2), emotion),
            this.filterLineGraph(this.modHour(3), emotion),
            this.filterLineGraph(this.modHour(4), emotion),
            this.filterLineGraph(this.modHour(5), emotion),
            this.filterLineGraph(this.modHour(6), emotion),
            this.filterLineGraph(this.modHour(7), emotion),
            this.filterLineGraph(this.modHour(8), emotion),
            this.filterLineGraph(this.modHour(9), emotion),
            this.filterLineGraph(this.modHour(10), emotion),
            this.filterLineGraph(this.modHour(11), emotion),
            this.filterLineGraph(this.modHour(12), emotion),
            this.filterLineGraph(this.modHour(13), emotion),
            this.filterLineGraph(this.modHour(14), emotion),
            this.filterLineGraph(this.modHour(15), emotion),
            this.filterLineGraph(this.modHour(16), emotion),
            this.filterLineGraph(this.modHour(17), emotion),
            this.filterLineGraph(this.modHour(18), emotion),
            this.filterLineGraph(this.modHour(19), emotion),
            this.filterLineGraph(this.modHour(20), emotion),
            this.filterLineGraph(this.modHour(21), emotion),
            this.filterLineGraph(this.modHour(22), emotion),
            this.filterLineGraph(this.modHour(23), emotion)
        ]
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
        let happy_time_totals;
        let sad_time_totals;
        let meh_time_totals;
        let mad_time_totals;
        let anxious_time_totals;
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
            this.getPastHours(0),
            this.getPastHours(1),
            this.getPastHours(2),
            this.getPastHours(3),
            this.getPastHours(4),
            this.getPastHours(5),
            this.getPastHours(6),
            this.getPastHours(7),
            this.getPastHours(8),
            this.getPastHours(9),
            this.getPastHours(10),
            this.getPastHours(11),
            this.getPastHours(12),
            this.getPastHours(13),
            this.getPastHours(14),
            this.getPastHours(15),
            this.getPastHours(16),
            this.getPastHours(17),
            this.getPastHours(18),
            this.getPastHours(19),
            this.getPastHours(20),
            this.getPastHours(21),
            this.getPastHours(22),
            this.getPastHours(23)
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

        if(this.lineScale == 'Week') {
            lineType = pastDays;

            happy_time_totals = {
                label: "Happy",
                data: this.getDailyData('happy'),
                hidden: false,
                fill: false,
                borderColor: this.happyColor,
                lineTension: 0.1
            };

            sad_time_totals = {
                "label": "Sad",
                "data": this.getDailyData('sad'),
                hidden: false,
                "fill": false,
                "borderColor": this.sadColor,
                "lineTension": 0.1
            };

            meh_time_totals = {
                "label": "Meh",
                "data": this.getDailyData('meh'),
                hidden: false,
                "fill": false,
                "borderColor": this.mehColor,
                "lineTension": 0.1
            };

            mad_time_totals = {
                "label": "Mad",
                "data": this.getDailyData('mad'),
                hidden: false,
                "fill": false,
                "borderColor": this.madColor,
                "lineTension": 0.1
            };

            anxious_time_totals = {
                "label": "Anxious",
                "data": this.getDailyData('anxious'),
                hidden: false,
                "fill": false,
                "borderColor": this.anxiousColor,
                "lineTension": 0.1
            };
        } else {
            if(this.lineScale == 'Day') {
                lineType = pastHours;

                happy_time_totals = {
                    "label": "Happy",
                    "data": this.getHourlyData('happy'),
                    hidden: false,
                    "fill": false,
                    "borderColor": this.happyColor,
                    "lineTension": 0.1
                };

                sad_time_totals = {
                    "label": "Sad",
                    "data": this.getHourlyData('sad'),
                    hidden: false,
                    "fill": false,
                    "borderColor": this.sadColor,
                    "lineTension": 0.1
                };

                meh_time_totals = {
                    "label": "Meh",
                    "data": this.getHourlyData('meh'),
                    hidden: false,
                    "fill": false,
                    "borderColor": this.mehColor,
                    "lineTension": 0.1
                };

                mad_time_totals = {
                    "label": "Mad",
                    "data": this.getHourlyData('mad'),
                    hidden: false,
                    "fill": false,
                    "borderColor": this.madColor,
                    "lineTension": 0.1
                };

                anxious_time_totals = {
                    "label": "Anxious",
                    "data": this.getHourlyData('anxious'),
                    hidden: false,
                    "fill": false,
                    "borderColor": this.anxiousColor,
                    "lineTension": 0.1
                };
            }
        }

        lineData = [
            happy_time_totals,
            sad_time_totals,
            meh_time_totals,
            mad_time_totals,
            anxious_time_totals
        ];

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

        let happy_time_totals = {"label":"Happy",
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

        let sad_time_totals = {"label":"Sad",
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

        let meh_time_totals = {"label":"Meh",
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

        let mad_time_totals = {"label":"Mad",
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

        let anxious_time_totals = {"label":"Anxious",
            "data":[
                this.filterLineGraph(this.modDay(0), 'anxious'),
                this.filterLineGraph(this.modDay(1), 'anxious'),
                this.filterLineGraph(this.modDay(2), 'anxious'),
                this.filterLineGraph(this.modDay(3), 'anxious'),
                this.filterLineGraph(this.modDay(4), 'anxious'),
                this.filterLineGraph(this.modDay(5), 'anxious'),
                this.filterLineGraph(this.modDay(6), 'anxious')
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
                    happy_time_totals,
                    sad_time_totals,
                    meh_time_totals,
                    mad_time_totals,
                    anxious_time_totals
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

