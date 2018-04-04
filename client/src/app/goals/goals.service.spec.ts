import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {Goal} from './goal';
import {GoalsService} from './goals.service';

describe('Goal list service: ', () => {
    // A small collection of test goals
    const testGoals: Goal[] = [
        {
            _id: 'food_id',
            purpose: 'Gain some weight',
            category: 'Food',
            name: 'Eat all the cookies',
            status: false
        },
        {
            _id: 'chores_id',
            purpose: 'Have cleaner kitchen',
            category: 'Chores',
            name: 'Take out recycling',
            status: true
        },
        {
            _id: 'family_id',
            purpose: 'To love her',
            category: 'Family',
            name: 'Call mom',
            status: true
        }
    ];
    const mGoals: Goal[] = testGoals.filter(goal =>
        goal.category.toLowerCase().indexOf('m') !== -1
    );

    let goalListService: GoalsService;
    let currentlyImpossibleToGenerateSearchGoalUrl: string;

    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        // Set up the mock handling of the HTTP requests
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        // Construct an instance of the service with the mock
        // HTTP client.
        goalListService = new GoalsService(httpClient);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('getGoals() calls api/goals', () => {

        goalListService.getGoals().subscribe(
            goals => expect(goals).toBe(testGoals)
        );

        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne(goalListService.baseUrl);
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.flush(testGoals);
    });

    it('getGoals(goalCategory) adds appropriate param string to called URL', () => {
        goalListService.getGoals('m').subscribe(
            users => expect(users).toEqual(mGoals)
        );

        const req = httpTestingController.expectOne(goalListService.baseUrl + '?category=m&');
        expect(req.request.method).toEqual('GET');
        req.flush(mGoals);
    });

    it('filterByCategory(goalCategory) deals appropriately with a URL that already had a category', () => {
        currentlyImpossibleToGenerateSearchGoalUrl = goalListService.baseUrl + '?category=f&something=k&';
        goalListService['goalUrl'] = currentlyImpossibleToGenerateSearchGoalUrl;
        goalListService.filterByCategory('m');
        expect(goalListService['goalUrl']).toEqual(goalListService.baseUrl + '?something=k&category=m&');
    });

    it('filterByCategory(goalCategory) deals appropriately with a URL that already had some filtering, but no category', () => {
        currentlyImpossibleToGenerateSearchGoalUrl = goalListService.baseUrl + '?something=k&';
        goalListService['goalUrl'] = currentlyImpossibleToGenerateSearchGoalUrl;
        goalListService.filterByCategory('m');
        expect(goalListService['goalUrl']).toEqual(goalListService.baseUrl + '?something=k&category=m&');
    });

    it('filterByCategory(goalCategory) deals appropriately with a URL has the keyword category, but nothing after the =', () => {
        currentlyImpossibleToGenerateSearchGoalUrl = goalListService.baseUrl + '?category=&';
        goalListService['goalUrl'] = currentlyImpossibleToGenerateSearchGoalUrl;
        goalListService.filterByCategory('');
        expect(goalListService['goalUrl']).toEqual(goalListService.baseUrl + '');
    });

    it('getGoalByID() calls api/goals/id', () => {
        const targetGoal: Goal = testGoals[1];
        const targetId: string = targetGoal._id;
        goalListService.getGoalByID(targetId).subscribe(
            user => expect(user).toBe(targetGoal)
        );

        const expectedUrl: string = goalListService.baseUrl + '/' + targetId;
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('GET');
        req.flush(targetGoal);
    });

    it('adding a goal calls api/goals/new', () => {
        const chores_id = { '$oid': 'chores_id' };
        const newGoal: Goal = {
            _id: 'chores_id',
            purpose: 'Have cleaner bathroom',
            category: 'Chores',
            name: 'Plunge toilet',
            status: false
        };

        goalListService.addNewGoal(newGoal).subscribe(
            id => {
                expect(id).toBe(chores_id);
            }
        );

        const expectedUrl: string = goalListService.baseUrl + '/new';
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('POST');
        req.flush(chores_id);
    });

    it('editing a goal calls api/goals/edit', () => {
        const family_id = { '$oid': 'family_id' };
        const editGoal: Goal = {
            _id: 'family_id',
            purpose: 'Talk about my classes',
            category: 'Family',
            name: 'Call sister',
            status: true
        };

        goalListService.editGoal(editGoal).subscribe(
            id => {
                expect(id).toBe(family_id);
            }
        );

        const expectedUrl: string = goalListService.baseUrl + '/edit';
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('POST');
        req.flush(family_id);
    });

});
