import {Component, OnInit} from '@angular/core';
import {GoalsService} from './goals.service';
import {Goal} from './goal';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import {AddGoalComponent} from './add-goal.component';

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
    // We should rename them to make that clearer.
    public goalGoal: string;
    public goalCategory: string;
    public goalName: string;

    // The ID of the
    private highlightedID: {'$oid': string} = { '$oid': '' };

    // Inject the UserListService into this component.
    constructor(public goalService: GoalsService, public dialog: MatDialog) {

    }

    isHighlighted(goal: Goal): boolean {
        return goal._id['$oid'] === this.highlightedID['$oid'];
    }

/*    openDialog(): void {
        const newUser: Goal = {_id: '', name: '', age: -1, company: '', email: ''};
        const dialogRef = this.dialog.open(AddUserComponent, {
            width: '500px',
            data: { user: newUser }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.userListService.addNewUser(result).subscribe(
                addUserResult => {
                    this.highlightedID = addUserResult;
                    this.refreshUsers();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the user.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }*/

    public filterGoals(searchGoal: string, searchCategory: string, searchName: string): Goal[] {

        this.filteredGoals = this.goals;

        // Filter by goal
        if (searchGoal != null) {
            searchGoal = searchGoal.toLocaleLowerCase();

            this.filteredGoals = this.filteredGoals.filter(goal => {
                return !searchGoal || goal.goal.toLowerCase().indexOf(searchGoal) !== -1;
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

        return this.filteredGoals;
    }

    /**
     * Starts an asynchronous operation to update the users list
     *
     */
    refreshUsers(): Observable<Goal[]> {
        // Get Users returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)

        const goalObservable: Observable<Goal[]> = this.goalService.getGoals();
        goalObservable.subscribe(
            goals => {
                this.goals = goals;
                this.filterGoals(this.goalGoal, this.goalCategory, this.goalName);
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
        this.refreshUsers();
        this.loadService();
    }
}
