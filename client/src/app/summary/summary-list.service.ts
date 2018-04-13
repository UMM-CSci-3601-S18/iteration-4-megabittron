import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Summary} from './summary';
import {environment} from '../../environments/environment';


@Injectable()
export class SummaryListService {
    readonly baseUrl: string = environment.API_URL + 'summaries';
    private summaryUrl: string = this.baseUrl;
    private noID: boolean = false;
    private emptyObservable: Observable<Summary[]> = Observable.of([]);

    constructor(private http: HttpClient) {
    }

    getSummaries(userID: string, summaryMood?: string,): Observable<Summary[]> {
        this.summaryUrl = this.baseUrl;
        this.noID = false;

        this.filterByUserID(userID);
        this.filterByMood(summaryMood);

        if(this.noID) {
            return this.emptyObservable;
        }
        console.log(this.summaryUrl);

        return this.http.get<Summary[]>(this.summaryUrl);
    }

    /*
    //This method looks lovely and is more compact, but it does not clear previous searches appropriately.
    //It might be worth updating it, but it is currently commented out since it is not used (to make that clear)
    getUsersByCompany(userCompany?: string): Observable<User> {
        this.userUrl = this.userUrl + (!(userCompany == null || userCompany == "") ? "?company=" + userCompany : "");
        console.log("The url is: " + this.userUrl);
        return this.http.request(this.userUrl).map(res => res.json());
    }
    */

    filterByUserID(userID: string): void {
        if (!(userID == null || userID === '')) {
            if (this.parameterPresent('userID=') ) {
                // there was a previous search by category that we need to clear
                this.removeParameter('userID=');
            }
            if (this.summaryUrl.indexOf('?') !== -1) {
                // there was already some information passed in this url
                this.summaryUrl += 'userID=' + userID + '&';
            } else {
                // this was the first bit of information to pass in the url
                this.summaryUrl += '?userID=' + userID + '&';
            }
        } else {
            // there was no userID
            this.noID = true;
        }
    }

    filterByMood(summaryMood?: string): void {
        if (!(summaryMood == null || summaryMood === '')) {
            if (this.parameterPresent('mood=') ) {
                // there was a previous search by company that we need to clear
                this.removeParameter('mood=');
            }
            if (this.summaryUrl.indexOf('?') !== -1) {
                // there was already some information passed in this url
                this.summaryUrl += 'mood=' + summaryMood + '&';
            } else {
                // this was the first bit of information to pass in the url
                this.summaryUrl += '?mood=' + summaryMood + '&';
            }
        } else {
            // there was nothing in the box to put onto the URL... reset
            if (this.parameterPresent('mood=')) {
                let start = this.summaryUrl.indexOf('mood=');
                const end = this.summaryUrl.indexOf('&', start);
                if (this.summaryUrl.substring(start - 1, start) === '?') {
                    start = start - 1;
                }
                this.summaryUrl = this.summaryUrl.substring(0, start) + this.summaryUrl.substring(end + 1);
            }
        }
    }

    /*filterByIntensity(summaryIntensity?: number): void {
        if (!(summaryIntensity == null || summaryIntensity)) {
            if (this.parameterPresent('intensity=') ) {
                // there was a previous search by company that we need to clear
                this.removeParameter('intensity=');
            }
            if (this.summaryUrl.indexOf('?') !== -1) {
                // there was already some information passed in this url
                this.summaryUrl += 'intensity=' + summaryIntensity + '&';
            } else {
                // this was the first bit of information to pass in the url
                this.summaryUrl += '?intensity=' + summaryIntensity + '&';
            }
        } else {
            // there was nothing in the box to put onto the URL... reset
            if (this.parameterPresent('intensity=')) {
                let start = this.summaryUrl.indexOf('intensity=');
                const end = this.summaryUrl.indexOf('&', start);
                if (this.summaryUrl.substring(start - 1, start) === '?') {
                    start = start - 1;
                }
                this.summaryUrl = this.summaryUrl.substring(0, start) + this.summaryUrl.substring(end + 1);
            }
        }
    }*/

    private parameterPresent(searchParam: string) {
        return this.summaryUrl.indexOf(searchParam) !== -1;
    }

    // remove the parameter and, if present, the &
    private removeParameter(searchParam: string) {
        const start = this.summaryUrl.indexOf(searchParam);
        let end = 0;
        if (this.summaryUrl.indexOf('&') !== -1) {
            end = this.summaryUrl.indexOf('&', start) + 1;
        } else {
            end = this.summaryUrl.indexOf('&', start);
        }
        this.summaryUrl = this.summaryUrl.substring(0, start) + this.summaryUrl.substring(end);
    }
}

