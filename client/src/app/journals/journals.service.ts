import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Journal} from './journal';
import {environment} from '../../environments/environment';


@Injectable()
export class JournalsService {
    readonly baseUrl: string = environment.API_URL + 'journals';
    private journalUrl: string = this.baseUrl;
    private noID: boolean = false;
    private emptyObservable: Observable<Journal[]> = Observable.of([]);

    constructor(private http: HttpClient) {
    }

    getJournals(userID: string, journalSubject?: string): Observable<Journal[]> {
        this.journalUrl = this.baseUrl;
        this.noID = false;

        this.filterByUserID(userID);

        //require a userID
        if(this.noID){
            return this.emptyObservable;
        }
        console.log(this.journalUrl);

        return this.http.get<Journal[]>(this.journalUrl);
    }

    getJournalById(id: string): Observable<Journal> {
        this.journalUrl = this.baseUrl;
        return this.http.get<Journal>(this.journalUrl + '/' + id);
    }

    /*
    filterBySubject(journalSubject?: string): void {
        if (!(journalSubject == null || journalSubject === '')) {
            if (this.parameterPresent('subject=') ) {
                // there was a previous search by company that we need to clear
                this.removeParameter('subject=');
            }
            if (this.journalUrl.indexOf('?') !== -1) {
                // there was already some information passed in this url
                this.journalUrl += 'subject=' + journalSubject + '&';
            } else {
                // this was the first bit of information to pass in the url
                this.journalUrl += '?subject=' + journalSubject + '&';
            }
        } else {
            // there was nothing in the box to put onto the URL... reset
            if (this.parameterPresent('subject=')) {
                let start = this.journalUrl.indexOf('subject=');
                const end = this.journalUrl.indexOf('&', start);
                if (this.journalUrl.substring(start - 1, start) === '?') {
                    start = start - 1;
                }
                this.journalUrl = this.journalUrl.substring(0, start) + this.journalUrl.substring(end + 1);
            }
        }
    }
*/

    filterByUserID(userID: string): void {
        if (!(userID == null || userID === '')) {
            if (this.parameterPresent('userID=') ) {
                // there was a previous search by category that we need to clear
                this.removeParameter('userID=');
            }
            if (this.journalUrl.indexOf('?') !== -1) {
                // there was already some information passed in this url
                this.journalUrl += 'userID=' + userID + '&';
            } else {
                // this was the first bit of information to pass in the url
                this.journalUrl += '?userID=' + userID + '&';
            }
        } else {
            // there was no userID
            this.noID = true;
        }
    }

    private parameterPresent(searchParam: string) {
        return this.journalUrl.indexOf(searchParam) !== -1;
    }

    // remove the parameter and, if present, the &
    private removeParameter(searchParam: string) {
        const start = this.journalUrl.indexOf(searchParam);
        let end = 0;
        if (this.journalUrl.indexOf('&') !== -1) {
            end = this.journalUrl.indexOf('&', start) + 1;
        } else {
            end = this.journalUrl.indexOf('&', start);
        }
        this.journalUrl = this.journalUrl.substring(0, start) + this.journalUrl.substring(end);
    }

    addNewJournal(newJournal : Journal): Observable<{'$oid': string}> {
        this.journalUrl = this.baseUrl;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        console.log(newJournal);
        // Send post request to add a new journal with the journal data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.journalUrl + '/new', newJournal, httpOptions);
    }

    editJournal(id : Journal): Observable<{'$oid': string}> {
        this.journalUrl = this.baseUrl;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        console.log(id);
        // Send post request to add a new journal with the journal data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.journalUrl + '/edit', id, httpOptions);
    }
}
