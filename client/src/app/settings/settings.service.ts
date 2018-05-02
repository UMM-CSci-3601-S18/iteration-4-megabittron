import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';
import 'rxjs/add/observable/of';

@Injectable()
export class SettingsService {
    readonly baseUrl: string = environment.API_URL;
    private currentUrl: string = this.baseUrl;
    private noID: boolean = false;
    private empty: Observable<string> = Observable.of("");

    constructor(private http: HttpClient) {
    }

    editStyle(userID: string, setting?: string): Observable<string> {
        this.currentUrl = this.baseUrl;
        this.noID = false;

        this.filterByUserID(userID);

        //require a userID
        if(this.noID){
            return this.empty;
        }

        return this.http.get<string>(this.currentUrl + "/style/edit/?" + userID + "&" + setting);
    }

    editFont(userID: string, setting?: string): Observable<string> {
        this.currentUrl = this.baseUrl;
        this.noID = false;

        this.filterByUserID(userID);

        //require a userID
        if(this.noID){
            return this.empty;
        }

        return this.http.get<string>(this.currentUrl + "/font/edit/?" + userID + "&" + setting);
    }

    filterByUserID(userID: string): void {
        if (userID == null || userID === '') {
            // there was no userID
            this.noID = true;
        }
    }
}
