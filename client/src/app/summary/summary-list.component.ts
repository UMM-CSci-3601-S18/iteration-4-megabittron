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

    limitedPast: boolean;
    colorblindMode: boolean;
    happyColor: string;
    sadColor: string;
    mehColor: string;
    madColor: string;
    anxiousColor: string;

    nowStamp = new Date(Date.now());
    nowUnix = this.nowStamp.getTime();
    nowDay = this.nowStamp.getDay();
    nowHour = this.nowStamp.getHours();
    nowDate = this.nowStamp.getDate();
    nowMonth = this.nowStamp.getMonth();

    lastWeekUnix = this.nowUnix - 604800000;
    lastWeekStamp = new Date(this.lastWeekUnix);
    lastDayUnix = this.nowUnix - 86400000;
    lastDayStamp = new Date(this.lastDayUnix);
    lastDateStamp = new Date(this.lastDayUnix);
    lastMonthUnix = this.nowUnix - 2628000000;
    lastMonthStamp = new Date(this.lastMonthUnix);


    // These are public so that tests can reference them (.spec.ts)
    public summaries: Summary[];
    public filteredSummaries: Summary[];
    public dateFilteredSummaries: Summary[];
    public pastWeekSummaries: Summary[];
    public pastDaySummaries: Summary[];



    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public summaryMood: string;
    public summaryIntensity: string;
    public inputType = "week";
    public CurrentGraph = "Bar";


    // The ID of the
    private highlightedID: {'$oid': string} = { '$oid': '' };

    // Inject the SummaryListService into this component.
    constructor(public summaryListService: SummaryListService, public dialog: MatDialog) {

    }

    isHighlighted(summary: Summary): boolean {
        return summary._id['$oid'] === this.highlightedID['$oid'];
    }

    public clearDateFilter(){
        this.startDate = null;
        this.endDate = null;
    }

    public filterDates(givenlist, searchStartDate: any, searchEndDate: any): Summary[] {
        this.dateFilteredSummaries = givenlist;

        // Filter by startDate
        if (searchStartDate != null) {

            this.dateFilteredSummaries = this.dateFilteredSummaries.filter(summary => {
                this.getDate = new Date(summary.date);
                return this.getDate >= searchStartDate;
            });
        }

        // Filter by endDate
        if (searchEndDate != null) {

            this.dateFilteredSummaries = this.dateFilteredSummaries.filter(summary => {
                this.getDate = new Date(summary.date);
                return this.getDate <= searchEndDate;
            });
        }
        return this.dateFilteredSummaries;
    }

    public pastWeekEmotions(givenSummaries):Summary[]{
        this.pastWeekSummaries = this.filterDates(givenSummaries, this.lastWeekStamp, this.nowStamp);
        return this.pastWeekSummaries;
    }

    public pastDayEmotions(givenSummaries):Summary[]{
        this.pastDaySummaries = this.filterDates(givenSummaries, this.lastDayStamp, this.nowStamp);
        return this.pastDaySummaries;
    }

    public filterSummaries(searchMood: string, searchIntensity: string, searchStartDate: any, searchEndDate: any): Summary[] {

        this.filteredSummaries = this.summaries;

        // Filter by Mood
        if (searchMood != null && searchMood !== "All") {
            searchMood = searchMood.toLocaleLowerCase();
            this.filteredSummaries = this.filteredSummaries.filter(summary => {
                return !searchMood || summary.mood.toLowerCase().indexOf(searchMood) !== -1;
            });
        }


        // Filter by Intensity
        if (searchIntensity != null && searchIntensity !== "All") {
            this.filteredSummaries = this.filteredSummaries.filter(summary => {
                return !searchIntensity || searchIntensity == summary.intensity.toString();
            });

        }

        this.filteredSummaries = this.filterDates(this.filteredSummaries, searchStartDate, searchEndDate);

        return this.filteredSummaries;
    }

    //xValue can represent hour or weekday
    filterBarGraph(xValue): number {
        let filterBarData = this.filteredSummaries;

        if(this.inputType == "week") {
            if(this.limitedPast) {
                filterBarData = this.pastWeekEmotions(filterBarData);
            }
            filterBarData = filterBarData.filter(summary => {
                this.getDate = new Date(summary.date);
                return this.getDate.getDay() == xValue;
            });
        }
        else {
            if (this.inputType == "day") {
                if(this.limitedPast) {
                    filterBarData = this.pastDayEmotions(filterBarData);
                }
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
        let filterLineData = this.filteredSummaries.filter(summary => {
            return !Searchmood || summary.mood.toLowerCase().indexOf(Searchmood) !== -1;
        });

        if(this.inputType == "week") {
            if(this.limitedPast) {
                filterLineData = this.pastWeekEmotions(filterLineData);
            }
            filterLineData = filterLineData.filter(summary => {
                this.getDate = new Date(summary.date);
                return this.getDate.getDay() == xValue;
            });
        }
        else {
            if (this.inputType == "day") {
                if(this.limitedPast) {
                    filterLineData = this.pastDayEmotions(filterLineData);
                }
                filterLineData = filterLineData.filter(summary => {
                    this.getDate = new Date(summary.date);
                    return this.getDate.getHours() == xValue;
                });
            }/*
            else {
                if(this.inputType == "month"){
                    if(this.limitedPast) {
                        filterLineData = this.pastMonthEmotions(filterLineData);
                    }
                    filterLineData = filterLineData.filter(summary => {
                        this.getDate = new Date(summary.date);
                        return this.getDate.getDate() == xValue;
                    });
                }
                else {
                    if(this.inputType == "year"){
                        if(this.limitedPast) {
                            filterLineData = this.pastYearEmotions(filterLineData);
                        }
                        filterLineData = filterLineData.filter(summary => {
                            this.getDate = new Date(summary.date);
                            return this.getDate.getMonth() == xValue;
                        });
                    }
                }
            }*/
        }

        return filterLineData.length;
    }


    public modDay(day: number): Number {
        return (this.nowDay + 1 + day)%7;
    }

    public modHour(hour: number): Number {
        return (this.nowHour + 1 + hour)%24;
    }
/*
    public modDate(date: number): Number {
        return (this.nowDate + 1 + date)%31;
    }
    */

    public modMonth(month: number): Number {
        return (this.nowMonth + 1 + month)%12;
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

        if(this.CurrentGraph == 'Bar'){
            return [
                this.filterBarGraph(this.modDay(0)),
                this.filterBarGraph(this.modDay(1)),
                this.filterBarGraph(this.modDay(2)),
                this.filterBarGraph(this.modDay(3)),
                this.filterBarGraph(this.modDay(4)),
                this.filterBarGraph(this.modDay(5)),
                this.filterBarGraph(this.modDay(6))
            ]
        }
        else {
            if(this.CurrentGraph == 'Line'){
                return [
                    this.filterLineGraph(this.modDay(0), emotion),
                    this.filterLineGraph(this.modDay(1), emotion),
                    this.filterLineGraph(this.modDay(2), emotion),
                    this.filterLineGraph(this.modDay(3), emotion),
                    this.filterLineGraph(this.modDay(4), emotion),
                    this.filterLineGraph(this.modDay(5), emotion),
                    this.filterLineGraph(this.modDay(6), emotion)
                ]
            }
        }
    }

    public getHourlyData(emotion){

        if(this.CurrentGraph == 'Bar'){
            return [
                this.filterBarGraph(this.modHour(0)),
                this.filterBarGraph(this.modHour(1)),
                this.filterBarGraph(this.modHour(2)),
                this.filterBarGraph(this.modHour(3)),
                this.filterBarGraph(this.modHour(4)),
                this.filterBarGraph(this.modHour(5)),
                this.filterBarGraph(this.modHour(6)),
                this.filterBarGraph(this.modHour(7)),
                this.filterBarGraph(this.modHour(8)),
                this.filterBarGraph(this.modHour(9)),
                this.filterBarGraph(this.modHour(10)),
                this.filterBarGraph(this.modHour(11)),
                this.filterBarGraph(this.modHour(12)),
                this.filterBarGraph(this.modHour(13)),
                this.filterBarGraph(this.modHour(14)),
                this.filterBarGraph(this.modHour(15)),
                this.filterBarGraph(this.modHour(16)),
                this.filterBarGraph(this.modHour(17)),
                this.filterBarGraph(this.modHour(18)),
                this.filterBarGraph(this.modHour(19)),
                this.filterBarGraph(this.modHour(20)),
                this.filterBarGraph(this.modHour(21)),
                this.filterBarGraph(this.modHour(22)),
                this.filterBarGraph(this.modHour(23)),
            ]
        }
        else {
            if(this.CurrentGraph == 'Line'){
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
        }

    }

    /**
     * Starts an asynchronous operation to update the emojis list
     *
     */
public pastDays = [
        this.getPastDays(0),
        this.getPastDays(1),
        this.getPastDays(2),
        this.getPastDays(3),
        this.getPastDays(4),
        this.getPastDays(5),
        this.getPastDays(6)
    ];

public pastHours = [
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

    updateBarChart(): void{
        this.CurrentGraph = 'Bar';

        if(this.barChart != null){
            this.barChart.destroy();
        }
        if(this.lineChart != null){
            this.lineChart.destroy();
        }

        this.barCanvas = document.getElementById("Chart");
        this.ctxBar = this.barCanvas;

        let xLabel;
        let summaryDays;
        let summaryHours;
        let displayData;
        let days;
        let hours;


        if(this.limitedPast){
        days = this.pastDays;
        hours = this.pastHours;
        }
        else {
            days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
            hours = ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM',
                '8AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM',
                '5 PM', '6 PM', '7 PM', '8 PM','9 PM', '10 PM', '11 PM'];
        }

        console.log(this.inputType);
        if(this.inputType == "day"){
            xLabel = hours;

            summaryHours = {
                "label": "Total Number of Entries",
                "data": this.getHourlyData('all'),
                "fill": true,
                "backgroundColor": "blue",
                "borderColor": "black",
                "lineTension": 0.1
            };
            displayData = [summaryHours];
        }
        else {
            if (this.inputType == "week") {
                console.log("here");
                xLabel = days;

                summaryDays = {
                    "label": "Total Number of Entries",
                    "data": this.getDailyData('all'),
                    "fill": true,
                    "backgroundColor": "blue",
                    "borderColor": "black",
                    "lineTension": 0.1
                };

                displayData = [summaryDays];
            }
        }

        this.barChart = new Chart(this.ctxBar, {
            type: 'bar',
            data: {

                labels: xLabel,
                datasets: displayData,
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
    }

    updateLineChart(): void{

        if(this.lineChart != null){
            this.lineChart.destroy();
        }
        if(this.barChart != null){
            this.barChart.destroy();
        }

        this.CurrentGraph = 'Line';

        this.lineCanvas = document.getElementById("Chart");
        this.ctxLine = this.lineCanvas;

        if(this.colorblindMode){
            this.happyColor = "rgb(215,48,39)";
            this.sadColor = "rgb(252,141,89)";
            this.mehColor = "rgb(254,224,144)";
            this.madColor = "rgb(145,191,219)";
            this.anxiousColor = "rgb(69,117,180)";
        } else {
            this.happyColor = "rgb(64, 255, 0)";
            this.sadColor = "rgb(0, 128, 255)";
            this.mehColor = "rgb(100, 100, 100)";
            this.madColor = "rgb(255, 0, 0)";
            this.anxiousColor = "rgb(255, 128, 0)";
        }

        let lineType;
        let happy_time_totals;
        let sad_time_totals;
        let meh_time_totals;
        let mad_time_totals;
        let anxious_time_totals;
        let lineData;
        let days;
        let hours;

        if(this.limitedPast){
            days = this.pastDays;
            hours = this.pastHours;
        }
        else {
            days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
            hours = ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM',
                '8AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM',
                '5 PM', '6 PM', '7 PM', '8 PM','9 PM', '10 PM', '11 PM'];
        }

        if(this.inputType == "week") {
            lineType = days;

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
            if(this.inputType == "day") {
                lineType = hours;

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

    buildBarChart(): void {

        this.barCanvas = document.getElementById("Chart");
        this.ctxBar = this.barCanvas;

        let summaryDays;

        let days;

        if(this.limitedPast){
            days = this.pastDays;
        }
        else {
            days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
        }

        summaryDays = {
            "label": "Total Number of Entries",
            "data": this.getDailyData('all'),
            "fill": true,
            "backgroundColor": "blue",
            "borderColor": "black",
            "lineTension": 0.3
        };

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
    }

    /*
    buildLineChart(): void {

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
        let pastDays = [
            this.getPastDays(0),
            this.getPastDays(1),
            this.getPastDays(2),
            this.getPastDays(3),
            this.getPastDays(4),
            this.getPastDays(5),
            this.getPastDays(6)
        ];

        let happy_time_totals = {"label":"Happy",
            "data":this.getDailyData('happy'),
            hidden: false,
            "fill":false,
            "borderColor":this.happyColor,
            "lineTension":0.1};

        let sad_time_totals = {"label":"Sad",
            "data":this.getDailyData('sad'),
            hidden: false,
            "fill":false,
            "borderColor":this.sadColor,
            "lineTension":0.1};

        let meh_time_totals = {"label":"Meh",
            "data":this.getDailyData('meh'),
            hidden: false,
            "fill":false,
            "borderColor":this.mehColor,
            "lineTension":0.1};

        let mad_time_totals = {"label":"Mad",
            "data":this.getDailyData('mad'),
            hidden: false,
            "fill":false,
            "borderColor":this.madColor,
            "lineTension":0.1};

        let anxious_time_totals = {"label":"Anxious",
            "data":this.getDailyData('anxious'),
            hidden: false,
            "fill":false,
            "borderColor":this.anxiousColor,
            "lineTension":0.1};

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
    */

    ngAfterViewInit(): void {
        this.buildBarChart();
    }

    /*
     * Starts an asynchronous operation to update the users list
     *
     */
    refreshSummaries(): Observable<Summary[]> {
        // Get Users returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)
        const summaryListObservable: Observable<Summary[]> = this.summaryListService.getSummaries();
        summaryListObservable.subscribe(
            summaries => {
                this.summaries = summaries;
                this.filterSummaries(this.summaryMood, this.summaryIntensity, this.startDate, this.endDate);
            },
            err => {
                console.log(err);
            });
        return summaryListObservable;
    }


    loadService(): void {
        this.summaryListService.getSummaries(this.summaryMood).subscribe(
            summaries => {
                this.summaries = summaries;
                this.filteredSummaries = this.summaries;
            },
            err => {
                console.log(err);
            }
        );
    }

    totalNumberEntries(): number{
        return this.summaries.length;
    }

    totalNumberMoods(): number{
        return this.filteredSummaries.length;
    }

    returnTime(mood: string): string{
        return "";
    }

    ngOnInit(): void {
        this.refreshSummaries();
        this.loadService();
    }

    stringToDate(date: string): any {
        return new Date(date);
    }

}

