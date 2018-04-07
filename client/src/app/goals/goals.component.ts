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
    showPage = false;

    // The ID of the goal
    private highlightedID: {'$oid': string} = { '$oid': '' };

    // Inject the GoalsService into this component.
    constructor(public goalService: GoalsService, public dialog: MatDialog, public snackBar: MatSnackBar ) {

    }

    isHighlighted(goal: Goal): boolean {
        return goal._id['$oid'] === this.highlightedID['$oid'];
    }

    openDialog(): void {
        const newGoal: Goal = {_id: '', name:'', category:'', purpose:'', status: false, start: this.goalStart, end: '', next: this.goalNext, frequency: ''};
        const dialogRef = this.dialog.open(AddGoalComponent, {
            width: '300px',
            data: { goal : newGoal }
        });

        dialogRef.afterClosed().subscribe(result => {
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
        });
    }

    deleteGoal(_id: string){
        this.goalService.deleteGoal(_id).subscribe(
            goals => {
                this.refreshGoals();
                this.loadService();
            },
            err => {
                console.log(err);
                this.refreshGoals();
                this.loadService();
            }
        );
    }

    goalSatisfied(_id: string, thePurpose: string, theCategory: string, theName) {
        const updatedGoal: Goal = {_id: _id, purpose: thePurpose, category: theCategory, name: theName, status: true};
        this.goalService.completeGoal(updatedGoal).subscribe(
            completeGoalResult => {
                this.highlightedID = completeGoalResult;
                this.refreshGoals();
            },
            err => {
                console.log('There was an error completing the goal.');
                console.log('The error was ' + JSON.stringify(err));
            });
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
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
        this.refreshGoals();
        this.loadService();
        this.getDate();
    }

    getDate(){
        this.today = new Date();
        this.goalStart = this.today;
        this.goalNext = this.today;
    }

    getNext(status, next, end, frequency): boolean{
        this.today.setHours(0, 0, 0, 0);

        var nextGoal = new Date(next);
        nextGoal.setHours(0, 0, 0, 0);

        var endGoal = new Date(end);
        endGoal.setHours(0, 0, 0, 0);

        var day = nextGoal.getDate();
        var month = nextGoal.getMonth();

        if(status == true){
            return false;
        }

        if(frequency == 'Does not repeat'){
            if(nextGoal < this.today){
                return false;
            }

            else{
                return true;
            }
        }

        while(nextGoal < this.today){
            if(frequency == "Daily"){
                next.setDate(day + 1);
            }

            if(frequency == "Weekly"){
                next.setDate(day + 7);
            }

            if(frequency == "Monthly"){
                next.setMonth(month + 1);
            }
        }

       if(nextGoal > this.today || nextGoal > endGoal){
            return false;
       }
       else{
           return true;
       }

    }

}
