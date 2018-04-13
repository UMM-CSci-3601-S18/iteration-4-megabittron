import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Goal} from './goal';
import {GoalsComponent} from './goals.component';
import {GoalsService} from './goals.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

describe( 'Goals', () => {

    let goalList: GoalsComponent;
    let fixture: ComponentFixture<GoalsComponent>;

    let goalsServiceStub: {
        getGoals: () => Observable<Goal[]>
    };

    beforeEach(() => {
        // stub GoalsService for test reasons
        goalsServiceStub = {
            getGoals: () => Observable.of([
                {
                    "_id": "5ab53a89551a3d783599082c",
                    "purpose": "Improve relationship",
                    "category": "Family",
                    "name": "Call my mom",
                    "status": true,
                    "start": "2018-04-05T18:56:24.702Z",
                    "end": "2018-05-05T18:56:24.702Z",
                    "next": "2018-04-12T18:56:24.702Z",
                    "frequency": "Weekly"
                },
                {
                    "_id": "5ab53a890c2c77662aaf3801",
                    "purpose": "To feel closer to him",
                    "category": "Family",
                    "name": "Write letter to Grandpa",
                    "status": false,
                    "start": "2018-04-05T18:56:24.702Z",
                    "end": "2019-04-05T18:56:24.702Z",
                    "next": "2018-04-05T18:56:24.702Z",
                    "frequency": "Daily"
                },
                {
                    "_id":  "5ab53a8944c7c6b223090477",
                    "purpose": "To get more sleep",
                    "category": "Personal Health",
                    "name": "Go to bed early",
                    "status": true,
                    "start": "2018-04-05T18:56:24.702Z",
                    "end": "2018-07-05T18:56:24.702Z",
                    "next": "2018-05-05T18:56:24.702Z",
                    "frequency": "Monthly"
                },
                {
                    "_id": "5ab53a898e1620e3d7e48796",
                    "purpose": "To give her a piece of my mind",
                    "category": "Family",
                    "name": "Visit sister",
                    "status": false,
                    "start": "2018-04-05T18:56:24.702Z",
                    "end": "2018-06-05T18:56:24.702Z",
                    "next": "2018-04-06T18:56:24.702Z",
                    "frequency": "Daily"
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [GoalsComponent],
            providers: [{provide: GoalsService, useValue: goalsServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(GoalsComponent);
            goalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains all the goals', () => {
        expect(goalList.goals.length).toBe(4);
    });

    it('contains a name called \'Go to bed early\'', () => {
        expect(goalList.goals.some((goal: Goal) => goal.name === 'Go to bed early')).toBe(true);
    });

    it('contains a name called \'Call my mom\'', () => {
        expect(goalList.goals.some((goal: Goal) => goal.name === 'Call my mom')).toBe(true);
    });

    it('contains a purpose called \'To give her a piece of my mind\'', () => {
        expect(goalList.goals.some((goal: Goal) => goal.purpose === 'To give her a piece of my mind')).toBe(true);
    });

    it('doesn\'t contain a name called \'Meet with Santa\'', () => {
        expect(goalList.goals.some((goal: Goal) => goal.name === 'Meet with Santa')).toBe(false);
    });

    it('has two goals that are true', () => {
        expect(goalList.goals.filter((goal: Goal) => goal.status === true).length).toBe(2);
    });

    it('goal list shows all goals', () =>{
        expect(goalList.filteredGoals.length).toBe(4);
        goalList.showAllGoals = true;
        goalList.refreshGoals().subscribe(()=>{
            expect(goalList.filteredGoals.length).toBe(4);
        });
    });

   /* it('goal list shows todays goals', () =>{
        expect(goalList.filteredGoals.length).toBe(4);
        goalList.showAllGoals = false;
        goalList.refreshGoals().subscribe(()=>{
            expect(goalList.todayGoals.length).toBe(4);
        });
    });*/


    it('returnStatus returns "complete"', () =>{
        expect(goalList.returnStatus(true) === "Complete");
    });

    it('returnStatus returns "incomplete"', () =>{
        expect(goalList.returnStatus(false) === "Incomplete");
    });

    it('showGoals returns all goals', () =>{
        expect(goalList.filteredGoals.length).toBe(4);
        goalList.showGoals("all");
        expect(goalList.shownGoals.length).toBe(4);
    });
});

describe('Next Goals', () => {
    let goalList; GoalsComponent;
    let fixture: ComponentFixture<GoalsComponent>;

    let goalsServiceStub: {
        getGoals: () => Observable<Goal[]>
    };

    beforeEach(() => {
        // stub GoalsService for test reasons
        goalsServiceStub = {
            getGoals: () => Observable.of([
                {
                    "_id": "5ab53a89551a3d783599082c",
                    "purpose": "Improve relationship",
                    "category": "Family",
                    "name": "Call my mom",
                    "status": true,
                    "start": "2018-04-05T18:56:24.702Z",
                    "end": "2018-05-05T18:56:24.702Z",
                    "next": "2018-04-12T18:56:24.702Z",
                    "frequency": undefined
                },
                {
                    "_id": "5ab53a89551a3d783599082c",
                    "purpose": "Improve relationship",
                    "category": "Family",
                    "name": "Call my mom",
                    "status": true,
                    "start": "2018-04-05T18:56:24.702Z",
                    "end": "2018-05-25T18:56:24.702Z",
                    "next": "2018-04-12T18:56:24.702Z",
                    "frequency": "Weekly"
                },
                {
                    "_id": "5ab53a89551a3d783599082c",
                    "purpose": "Improve relationship",
                    "category": "Family",
                    "name": "Call my mom",
                    "status": false,
                    "start": "2018-04-05T18:56:24.702Z",
                    "end": "2018-05-20T18:56:24.702Z",
                    "next": "2018-04-12T18:56:24.702Z",
                    "frequency": undefined
                },
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [GoalsComponent],
            providers: [{provide: GoalsService, useValue: goalsServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });

        it('Doesnt enter while loop', () => {
            expect(goalList.filteredGoals.length).toBe(2);
            goalList.showAllGoals = true;
            expect(goalList.todayGoals.length).toBe(0);
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(GoalsComponent);
            goalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));
});

describe('Misbehaving Goal List', () => {
    let goalList: GoalsComponent;
    let fixture: ComponentFixture<GoalsComponent>;

    let goalListServiceStub: {
        getGoals: () => Observable<Goal[]>
    };

    beforeEach(() => {
        // stub GoalService for test reasons
        goalListServiceStub = {
            getGoals: () => Observable.create(observer => {
                observer.error('Error-prone observable');
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [GoalsComponent],
            providers: [{provide: GoalsService, useValue: goalListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(GoalsComponent);
            goalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

   /*it('generates an error if we don\'t set up a GoalsService', () => {
        // Since the observer throws an error, we don't expect goals to be defined.
        expect(goalList.goals).toBeUndefined();
    });*/
});

describe('Adding a goal', () => {
    let goalList: GoalsComponent;
    let fixture: ComponentFixture<GoalsComponent>;
    const newGoal: Goal =   {
        _id: '',
        purpose: 'To stay awake writing tests',
        category: 'Personal Health',
        name: 'Drink coffee',
        status: false,
        start: "2018-04-05T18:56:24.702Z",
        end: "2018-05-05T18:56:24.702Z",
        next: "2018-05-05T18:56:24.702Z",
        frequency: "Daily"
    };
    const newId = 'health_id';

    let calledGoal: Goal;

    let goalListServiceStub: {
        getGoals: () => Observable<Goal[]>,
        addNewGoal: (newGoal: Goal) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (GoalsComponent, any) => {
            afterClosed: () => Observable<Goal>
        };
    };

    beforeEach(() => {
        calledGoal = null;
        // stub GoalsService for test reasons
        goalListServiceStub = {
            getGoals: () => Observable.of([]),
            addNewGoal: (goalToAdd: Goal) => {
                calledGoal = goalToAdd;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(newGoal);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [GoalsComponent],
            providers: [
                {provide: GoalsService, useValue: goalListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(GoalsComponent);
            goalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('calls GoalsService.addGoal', () => {
        expect(calledGoal).toBeNull();
        goalList.openDialog();
        expect(calledGoal).toEqual(newGoal);
    });
});

describe('Deleting a goal', () => {
    let goalList: GoalsComponent;
    let fixture: ComponentFixture<GoalsComponent>;
    const deleteGoal: Goal =   {
        _id: '',
        purpose: 'To have a delightful tasting sensation',
        category: 'Personal Health',
        name: 'Eat pringles',
        status: false,
        start: "2018-04-05T18:56:24.702Z",
        end: "2018-05-05T18:56:24.702Z",
        next: "2018-05-05T18:56:24.702Z",
        frequency: "Daily"
    };
    const newId = 'pringles_id';

    let calledGoal: Goal;

    let goalListServiceStub: {
        getGoals: () => Observable<Goal[]>,
        deleteGoal: (deleteGoal: Goal) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (GoalsComponent, any) => {
            afterClosed: () => Observable<Goal>
        };
    };

    beforeEach(() => {
        calledGoal = null;
        // stub GoalsService for test reasons
        goalListServiceStub = {
            getGoals: () => Observable.of([]),
            deleteGoal: (goalToDelete: Goal) => {
                calledGoal = goalToDelete;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(deleteGoal);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [GoalsComponent],
            providers: [
                {provide: GoalsService, useValue: goalListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(GoalsComponent);
            goalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('calls GoalsService.deleteGoal', () => {
        expect(calledGoal).toBeNull();
        goalList.deleteGoal(this._id);
    });
});

describe('Completing a goal', () => {
    let goalList: GoalsComponent;
    let fixture: ComponentFixture<GoalsComponent>;
    const completeGoal: Goal =   {
        _id: '',
        purpose: 'To break everything and make people mad',
        category: 'Chores',
        name: 'Destroy all monitors in the lab',
        status: true,
        start: "2018-04-05T18:56:24.702Z",
        end: "2018-05-05T18:56:24.702Z",
        next: "2018-05-05T18:56:24.702Z",
        frequency: "Daily"
    };
    const newId = 'monitor_id';

    let calledGoal: Goal;

    let goalListServiceStub: {
        getGoals: () => Observable<Goal[]>,
        completeGoal: (newGoal: Goal) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (GoalsComponent, any) => {
            afterClosed: () => Observable<Goal>
        };
    };

    beforeEach(() => {
        calledGoal = null;
        // stub GoalsService for test reasons
        goalListServiceStub = {
            getGoals: () => Observable.of([]),
            completeGoal: (goalToComplete: Goal) => {
                calledGoal = goalToComplete;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(completeGoal);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [GoalsComponent],
            providers: [
                {provide: GoalsService, useValue: goalListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(GoalsComponent);
            goalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    /*it('calls GoalsService.completeGoal', () => {
        expect(calledGoal).toBeNull();
        // I don't think this is correct, but it passes. It should probably take in this._id, this.purpose, etc.
        goalList.goalSatisfied('', 'To break everything and make people mad', 'Chores', 'Destroy all monitors in the lab')
        expect(calledGoal).toEqual(completeGoal);
    });*/
});
