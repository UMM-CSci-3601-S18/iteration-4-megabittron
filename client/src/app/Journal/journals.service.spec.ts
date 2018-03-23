import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {Journal} from './journal';
import {JournalsService} from './journals.service';

describe('Journal service: ', () => {
    // A small collection of test journals
    const testJournals: Journal[] = [
        {
            _id: '1',
            journal: 'To have a more sanitary living environment.',
            category: 'Chores',
            name: 'Wash the dishes',
        },
        {
            _id: '2',
            journal: 'To be beefy.',
            category: 'Workout',
            name: 'Go to gym',
        },
        {
            _id: '3',
            journal: 'To have a safer driveway.',
            category: 'Chores',
            name: 'Shovel driveway',
        }
    ];
    const mJournals: Journal[] = testJournals.filter(journal =>
        journal.name.toLowerCase().indexOf('o') !== 2
    );

    // We will need some url information from the journalService to meaningfully test category filtering;
    // https://stackoverflow.com/questions/35987055/how-to-write-unit-testing-for-angular-2-typescript-for-private-methods-with-ja
    let journalService: JournalsService;
    let currentlyImpossibleToGenerateSearchJournalUrl: string;

    // These are used to mock the HTTP requests so that we (a) don't have to
    // have the server running and (b) we can check exactly which HTTP
    // requests were made to ensure that we're making the correct requests.
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
        journalService = new JournalsService(httpClient);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('getJournals() calls api/journals', () => {
        // Assert that the journals we get from this call to getJournals()
        // should be our set of test journals. Because we're subscribing
        // to the result of getJournals(), this won't actually get
        // checked until the mocked HTTP request "returns" a response.
        // This happens when we call req.flush(testJournals) a few lines
        // down.
        journalService.getJournals().subscribe(
            journals => expect(journals).toBe(testJournals)
        );

        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne(journalService.baseUrl);
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.flush(testJournals);
    });

    it('getJournals(journalCategory) adds appropriate param string to called URL', () => {
        journalService.getJournals('o').subscribe(
            journals => expect(journals).toEqual(mJournals)
        );

        const req = httpTestingController.expectOne(journalService.baseUrl + '?category=o&');
        expect(req.request.method).toEqual('GET');
        req.flush(mJournals);
    });

    it('filterByCategory(journalCategory) deals appropriately with a URL that already had a category', () => {
        currentlyImpossibleToGenerateSearchJournalUrl = journalService.baseUrl + '?category=f&something=k&';
        journalService['journalUrl'] = currentlyImpossibleToGenerateSearchJournalUrl;
        journalService.filterByCategory('o');
        expect(journalService['journalUrl']).toEqual(journalService.baseUrl + '?something=k&category=o&');
    });

    it('filterByCategory()terByCategory()) deals appropriately with a URL that already had some filtering, but no category', () => {
        currentlyImpossibleToGenerateSearchJournalUrl = journalService.baseUrl + '?something=k&';
        journalService['journalUrl'] = currentlyImpossibleToGenerateSearchJournalUrl;
        journalService.filterByCategory('m');
        expect(journalService['journalUrl']).toEqual(journalService.baseUrl + '?something=k&category=m&');
    });

    it('filterByCategory()terByCategory()) deals appropriately with a URL has the keyword category, but nothing after the =', () => {
        currentlyImpossibleToGenerateSearchJournalUrl = journalService.baseUrl + '?category=&';
        journalService['journalUrl'] = currentlyImpossibleToGenerateSearchJournalUrl;
        journalService.filterByCategory('');
        expect(journalService['journalUrl']).toEqual(journalService.baseUrl + '');
    });

    it('getJournalById() calls api/journals/id', () => {
        const targetJournal: Journal = testJournals[1];
        const targetId: string = targetJournal._id;
        journalService.getJournalByID(targetId).subscribe(
            journal => expect(journal).toBe(targetJournal)
        );

        const expectedUrl: string = journalService.baseUrl + '/' + targetId;
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('GET');
        req.flush(targetJournal);
    });

    it('adding a journal calls api/journals/new', () => {
        const jesse_id = { '$oid': 'jesse_id' };
        const newJournal: Journal = {
            _id: 'jesse_id',
            journal: 'To have a safer driveway.',
            category: 'Chores',
            name: 'Shovel driveway',
        };

        journalService.addNewJournal(newJournal).subscribe(
            id => {
                expect(id).toBe(jesse_id);
            }
        );

        const expectedUrl: string = journalService.baseUrl + '/new';
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('POST');
        req.flush(jesse_id);
    });
});

