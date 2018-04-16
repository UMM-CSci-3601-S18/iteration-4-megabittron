import {Injectable} from "@angular/core";
import {environment} from '../environments/environment';


@Injectable()
export class AppService {
    constructor() {}

    public isSignedIn(): boolean {
        status = localStorage.getItem('isSignedIn');
        if (status == 'true') { return true;}
        else {return false;}
    }

    public testingToggle(): void {
        //Change this to stop the testing set up
        let toggle = true;

        if(!environment.production && toggle){
            localStorage.setItem("userID", "defaultUserID");
            localStorage.setItem("isSignedIn", "true");
        }
    }


}
