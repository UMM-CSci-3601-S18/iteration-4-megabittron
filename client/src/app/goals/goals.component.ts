import {Component, OnInit} from '@angular/core';
import {GoalsService} from './goals.service';
import {Goal} from './goal';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import {AddGoalComponent} from './add-goal.component';
import {MatSnackBar} from '@angular/material';

@Component({
    selector: 'app-goals-component',
    templateUrl: 'goals.component.html',
    styleUrls: ['./goals.component.css'],
})

export class GoalsComponent implements OnInit {
    // These are public so that tests can reference them (.spec.ts)
    public goals: Goal[];
    public todayGoals: Goal[];
    public shownGoals: Goal[];
    public filteredGoals: Goal[];

    // These are the target values used in searching.
    public goalPurpose: string;
    public goalCategory: string;
    public goalName: string;
    public goalStatus: string;
    public goalStart;
    public goalEnd;
    public goalNext;
    public goalFrequency;
    public today;
    public showAllGoals = false;
    public goalsPerPage = 5;
    public currentPage = 1;

    public currentScreenWidth: number;

    // The ID of the goal
    private highlightedID: { '$oid': string } = {'$oid': ''};

    // Inject the GoalsService into this component.
    constructor(public goalService: GoalsService, public dialog: MatDialog, public snackBar: MatSnackBar) {
    }

    isHighlighted(goal: Goal): boolean {
        return goal._id['$oid'] === this.highlightedID['$oid'];
    }


    openDialog(): void {
        const newGoal: Goal = {
            _id: '',
            name: '',
            category: '',
            purpose: '',
            status: false,
            start: this.goalStart,
            end: '',
            next: this.goalNext,
            frequency: ''
        };
        const dialogRef = this.dialog.open(AddGoalComponent, {
            width: '300px',
            data: {goal: newGoal}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == undefined) {
                console.log("Cancelled without adding a goal");
            } else {
                this.goalService.addNewGoal(result).subscribe(
                    addGoalResult => {
                        this.highlightedID = addGoalResult;
                        this.refreshGoals();
                    },
                    err => {
                        // This should probably be turned into some sort of meaningful response.
                        console.log('There was an error adding the goal.');
                        console.log('The error was ' + JSON.stringify(err));
                    });
                this.snackBar.open("Added Goal", "CLOSE", {
                    duration: 2000,
                });
            }
        });
    }

    returnStatus(status): string{
        if(status == true){
            return "Complete";
        }

        return "Incomplete";
    }
    deleteGoal(_id: string) {
        this.goalService.deleteGoal(_id).subscribe(
            goals => {
                this.refreshGoals();
                this.loadService();
            },
            err => {
                console.log(err);
                this.refreshGoals();
                this.loadService();
                this.snackBar.open("Deleted Goal", "CLOSE", {
                    duration: 2000,
                });
            }
        );
    }

    editGoal(_id, name, purpose, category, status, frequency, start, end, next) {
        const updatedGoal: Goal = {
            _id: _id,
            purpose: purpose,
            category: category,
            name: name,
            status: status,
            frequency: frequency,
            start: start,
            end: end,
            next: next
        };
        this.goalService.completeGoal(updatedGoal).subscribe(
            completeGoalResult => {
                this.highlightedID = completeGoalResult;
                this.snackBar.open("Completed Goal", "CLOSE", {
                    duration: 2000,
                });
                this.refreshGoals();
            },
            err => {
                console.log('There was an error completing the goal.');
                console.log('The error was ' + JSON.stringify(err));
            });
    }

    updateNext(_id, name, purpose, category, status, frequency, start, end, next) {
        const updatedGoal: Goal = {
            _id: _id,
            purpose: purpose,
            category: category,
            name: name,
            status: status,
            frequency: frequency,
            start: start,
            end: end,
            next: next
        };
        this.goalService.completeGoal(updatedGoal).subscribe(
            completeGoalResult => {
                this.highlightedID = completeGoalResult;
                //this.refreshGoals();
            },
            err => {
                console.log('There was an error completing the goal.');
                console.log('The error was ' + JSON.stringify(err));
            });
    }

    public filterGoals(searchPurpose: string, searchCategory: string,
                       searchName: string, searchStatus: string,
                       searchFrequency: string): Goal[] {

        this.filteredGoals = this.goals;

        // Filter by purpose
        if (searchPurpose != null) {
            searchPurpose = searchPurpose.toLocaleLowerCase();

            this.filteredGoals = this.filteredGoals.filter(goal => {
                return !searchPurpose || goal.purpose.toLowerCase().indexOf(searchPurpose) !== -1;
            });
        }

        // Filter by category
        if (searchCategory != null) {
            searchCategory = searchCategory.toLocaleLowerCase();

            this.filteredGoals = this.filteredGoals.filter(goal => {
                return !searchCategory || goal.category.toLowerCase().indexOf(searchCategory) !== -1;
            });
        }

        // Filter by name
        if (searchName != null) {
            searchName = searchName.toLocaleLowerCase();

            this.filteredGoals = this.filteredGoals.filter(goal => {
                return !searchName || goal.name.toLowerCase().indexOf(searchName) !== -1;
            });
        }

        // Filter by status
        if (searchStatus != null) {
            searchStatus = searchStatus.toLocaleLowerCase();

            this.filteredGoals = this.filteredGoals.filter(goal => {
                return !searchStatus || goal.name.toLowerCase().indexOf(searchStatus) !== -1;
            });
        }

        return this.filteredGoals;
    }

    getNext(){

        if(this.showAllGoals == false) {
            this.todayGoals = this.filteredGoals.filter(goal => {
                console.log("showAllGoals was false, which means we are on the show today's goals page");

                var nextGoal = new Date(goal.next);
                console.log("setting nextGoal to the current goal.next");
                nextGoal.setHours(0, 0, 0, 0);
                console.log("setting the hours of nextGoal to 0 for comparison");

                var endGoal = new Date(goal.end);
                console.log("setting nextGoal to the current goal.end");
                endGoal.setHours(0, 0, 0, 0);
                console.log("setting the hours of endGoal to 0 for comparison");

                var day = nextGoal.getDate();
                console.log("making the var day and setting it to nextGoal.getDate()");
                var month = nextGoal.getMonth();
                console.log("making the var month and setting it to nextGoal.getDate()")

                if (nextGoal.getTime() < this.today.getTime()
                    && goal.frequency != "Does not repeat"
                    && goal.status == true
                    && endGoal.getTime() >= this.today.getTime()) {
                    console.log("nextGoal was < than this.today, the frequency did not equal 'Does not repeat' and status equaled true. Updating goal.next");
                    this.updateNext(goal._id, goal.name, goal.purpose, goal.category, false, goal.frequency, goal.start, goal.end, goal.next)
                }

                if (goal.status == true) {
                    console.log("status equaled true, this goal doesn't need to be on the today page");
                    return false;
                }

                if (endGoal.getTime() < this.today.getTime()) {
                    console.log("endGoal was < than this.today meaning that it doesn't need to be on the today page");
                    return false;
                }

                if (goal.frequency == 'Does not repeat') {
                    console.log("goal.frequency equaled Does not repeat");
                    if (nextGoal.getTime() == this.today.getTime()) {
                        console.log("goal.frequency == does not repeat and nextGoal == this.today")
                        return true;
                    }
                    else {
                        console.log("goal.frequency == does not repeat but nextGoal != this.today")
                        return false;
                    }
                }

                while (nextGoal.getTime() < this.today.getTime()) {
                    console.log("Inside the while loop. nextGoal < this.today");
                    if (goal.frequency == "Daily") {
                        console.log("goal.frequency == daily")
                        day = day + 1;
                        console.log("incrementing day by 1");
                        nextGoal.setDate(day);
                        console.log("setting the nextGoal date to the new day");
                    }

                    if (goal.frequency == "Weekly") {
                        console.log("goal.frequency == weekly");
                        day = day + 7;
                        console.log("incrementing day by 7");
                        nextGoal.setDate(day);
                        console.log("setting nextGoal to the new day");
                    }

                    if (goal.frequency == "Monthly") {
                        console.log("goal.frequency == monthly");
                        month = month + 1;
                        console.log("incrementing month by 1");
                        nextGoal.setMonth(month);
                        console.log("setting nextGoal to the new month");
                    }
                }

                if (nextGoal.getTime() == this.today.getTime()) {
                    console.log("nextGoal == this.today, updating goal.next value");
                    this.updateNext(goal._id, goal.name, goal.purpose, goal.category, goal.status, goal.frequency, goal.start, goal.end, nextGoal.toString());
                    console.log("updated goal.next value, returning true");
                    return true;
                }

                else {
                    console.log("nextGoal != this.today, returning false");
                    return false;
                }


            });
            console.log("going to the showGoals function, stating we are on the today page");
            this.showGoals("today");
        }

        else{
            console.log("going to showGoals function, stating we are on the all page");
            this.showGoals("all");
        }
        console.log("returning this.todayGoals");
        return this.todayGoals;

    }

    showGoals(type){
        console.log("enter showGoals function");
        var count = this.currentPage * this.goalsPerPage;
        console.log("setting up var count");

        if(type == "today") {
            console.log("type == today");

            this.shownGoals = this.todayGoals.filter(goal => {
                console.log("entering filtering part");
                if (count > this.goalsPerPage) {
                    console.log("count > this.goalsPerPage");
                    count--;
                    console.log("decrease count by 1 and returning fasle; this goal doesn't need to be shown");
                    return false;
                }

                if (count <= this.goalsPerPage && count != 0) {
                    console.log("count <= this.goalsPerpage and count != 0");
                    count--;
                    console.log("decreasing count and returning true; this goal needs to be shown");
                    return true;
                }

            });
        }

        else{
            console.log("type == all");
            this.shownGoals = this.filteredGoals.filter(goal => {
                console.log("entering filtering part");
                if (count > this.goalsPerPage) {
                    console.log("count > this.goalsPerPage");
                    count--;
                    console.log("decreasing count and returning false; this goal doesn't need to be shown");
                    return false;
                }

                if (count <= this.goalsPerPage && count != 0) {
                    console.log("count <= this.goalsPerPage and count != 0");
                    count--;
                    console.log("decreasing count and returning true; this goal needs to be shown");
                    return true;
                }

            });
        }
        console.log("finished with showGoals()");
    }

    maxNumPages(type): boolean{
        if(type == "today") {

            return (this.goalsPerPage * this.currentPage) < this.todayGoals.length;
        }
        else{

            return (this.goalsPerPage * this.currentPage) < this.filteredGoals.length;
        }
    }


    /**
     * Starts an asynchronous operation to update the goals list
     *
     */
    refreshGoals(): Observable<Goal[]> {
        // Get Goals returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)

        const goalObservable: Observable<Goal[]> = this.goalService.getGoals();
        goalObservable.subscribe(
            goals => {
                this.goals = goals;
                this.filterGoals(this.goalPurpose, this.goalCategory, this.goalName, this.goalStatus, this.goalFrequency);
                this.getNext();
                },
            err => {
                console.log(err);
            });


        return goalObservable;
    }


    loadService(): void {
        this.goalService.getGoals(this.goalCategory).subscribe(
            goals => {
                this.goals = goals;
                this.filteredGoals = this.goals;
            },
            err => {
                console.log(err);
            }
        );


    }

    ngOnInit(): void {
        console.log("starting refeshGoals()");
        this.refreshGoals();
        console.log("finished refreshGoals()");
        console.log("starting loadService");
        this.loadService();
        console.log("finished loadService()");
        console.log("starting getDate()");
        this.getDate();
        console.log("finished getDate()");

    }

    getDate() {
        this.today = new Date();
        this.goalStart = this.today;
        this.goalNext = this.today;
        this.today.setHours(0, 0, 0, 0);


    }
}
