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
    public goals: Goal[] = [];
    public todayGoals: Goal[] = [];
    public shownGoals: Goal[] = [];
    public filteredGoals: Goal[] = [];

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
            userID: localStorage.getItem("userID"),
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
            }
            else {
                if(localStorage.isSignedIn == "true"){
                    this.goalService.addNewGoal(result).subscribe(
                        addGoalResult => {
                            this.highlightedID = addGoalResult;
                            this.refreshGoals();
                            this.snackBar.open("Added Goal", "CLOSE", {
                                duration: 2000,
                            });
                            },
                            err => {
                            // This should probably be turned into some sort of meaningful response.
                                console.log('There was an error adding the goal.');
                                console.log('The error was ' + JSON.stringify(err));
                        });
                }
                else {

                    this.snackBar.open("Goal Not Saved. Please Log In to Save Your Goal", "CLOSE", {
                        duration: 5000,
                    });
                }

            }
        });
    }

    returnStatus(status): string{
        if(status == true){
            return "Complete";
        }

        return "Incomplete";
    }

    getSize(type): boolean{
        if(type == "today"){
            return this.todayGoals.length > this.goalsPerPage;
        }

        return this.filteredGoals.length > this.goalsPerPage;
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
            userID: localStorage.getItem("userID"),
            purpose: purpose,
            category: category,
            name: name,
            status: status,
            frequency: frequency,
            start: start,
            end: end,
            next: next
        };
        this.goalService.editGoal(updatedGoal).subscribe(
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

    updateNext(_id, name, purpose, category, status, frequency, start, end, next): void {
        const updatedGoal: Goal = {
            _id: _id,
            userID: localStorage.getItem("userID"),
            purpose: purpose,
            category: category,
            name: name,
            status: status,
            frequency: frequency,
            start: start,
            end: end,
            next: next
        };
        this.goalService.editGoal(updatedGoal).subscribe(
            editGoalResult => {
                this.highlightedID = editGoalResult;
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



        this.showGoals("all")
        return this.filteredGoals;
    }

    getNext(){
        this.currentPage = 1;

        if(this.showAllGoals == false) {
            if(this.today !== undefined) {
                this.todayGoals = this.filteredGoals.filter(goal => {


                    var nextGoal = new Date(goal.next);
                    nextGoal.setHours(0, 0, 0, 0);

                    var endGoal = new Date(goal.end);
                    endGoal.setHours(0, 0, 0, 0);

                    var day = nextGoal.getDate();
                    var month = nextGoal.getMonth();

                    if (nextGoal.getTime() <= this.today.getTime()
                        && goal.frequency != "Does not repeat"
                        && goal.status == true
                        && endGoal.getTime() >= this.today.getTime()) {
                        this.updateNext(goal._id, goal.name, goal.purpose, goal.category, false, goal.frequency, goal.start, goal.end, goal.next)
                    }

                    if (goal.status == true) {
                        return false;
                    }

                    if (endGoal.getTime() < this.today.getTime()) {
                        return false;
                    }

                    if (goal.frequency == 'Does not repeat') {
                        if (nextGoal.getTime() == this.today.getTime()) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }

                    if (goal.frequency != 'Does not repeat' &&
                        goal.frequency != 'Daily' &&
                        goal.frequency != 'Weekly' &&
                        goal.frequency != 'Monthly') {
                        return false;
                    }

                    while (nextGoal.getTime() < this.today.getTime()) {
                        if (goal.frequency == "Daily") {
                            day = day + 1;
                            nextGoal.setDate(day);
                        }

                        if (goal.frequency == "Weekly") {
                            day = day + 7;
                            nextGoal.setDate(day);
                        }

                        if (goal.frequency == "Monthly") {
                            month = month + 1;
                            nextGoal.setMonth(month);
                        }
                    }

                    if (nextGoal.getTime() == this.today.getTime()) {
                        this.updateNext(goal._id, goal.name, goal.purpose, goal.category, goal.status, goal.frequency, goal.start, goal.end, nextGoal.toString());
                        return true;
                    }

                    else {
                        return false;
                    }

                });
            }

            this.showGoals("today");
            return this.todayGoals;
        }

        else{
            this.showGoals("all");
            return this.filteredGoals;
        }



    }

    showGoals(type){
        var count = this.currentPage * this.goalsPerPage;

        if(type == "today") {

            if(this.todayGoals !== undefined) {
                this.shownGoals = this.todayGoals.filter(goal => {
                    if (count > this.goalsPerPage) {
                        count--;
                        return false;
                    }

                    if (count <= this.goalsPerPage && count != 0) {
                        count--;
                        return true;
                    }

                });
            }
        }

        else{
            this.shownGoals = this.filteredGoals.filter(goal => {
                if (count > this.goalsPerPage) {
                    count--;
                    return false;
                }

                if (count <= this.goalsPerPage && count != 0) {
                    count--;
                    return true;
                }

            });
        }
    }

    maxNumPages(type): boolean{
        if(type == "today") {

            if(this.todayGoals !== undefined){
                return (this.goalsPerPage * this.currentPage) < this.todayGoals.length;
            }
            return false;
        }
        else{
            if(this.filteredGoals !== undefined){
                return (this.goalsPerPage * this.currentPage) < this.todayGoals.length;
            }
            return false;
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

        console.log("this is goals.component.ts and it has this for userID: " + localStorage.getItem("userID"));

        var userID = localStorage.getItem("userID");

        if(userID == null){
            userID = "";
        }
        const goalObservable: Observable<Goal[]> = this.goalService.getGoals(userID);
        console.log(goalObservable);
        goalObservable.subscribe(
            goals => {
                console.log(goals);
                if(goals != null){
                    this.goals = goals;
                    this.filterGoals(this.goalPurpose, this.goalCategory, this.goalName, this.goalStatus, this.goalFrequency);
                    this.getNext();
                }
            },
            err => {
                console.log(err);
            });


        return goalObservable;
    }


    loadService(): void {
        console.log(localStorage.getItem("userID"));
        this.goalService.getGoals(localStorage.getItem("userID"),this.goalCategory).subscribe(
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
        //For testing
        //localStorage.setItem("userID", "4cb56a89541a2d783595012c");
        this.refreshGoals();
        this.loadService();
        this.getDate();

    }

    getDate() {
        this.today = new Date();
        this.today.setHours(0, 0, 0, 0);
        this.goalStart = this.today;
        this.goalNext = this.today;



    }
}
