import {Injectable} from "@angular/core";



@Injectable()
export class AppService {
    constructor() {}

    public isSignedIn(): boolean {
        status = localStorage.getItem('isSignedIn');
        if (status == 'true') { return true;}
        else {return false;}
    }


}
