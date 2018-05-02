import {Injectable} from "@angular/core";
import {environment} from '../environments/environment';
import 'rxjs/add/observable/of';
import {SettingsComponent} from "./settings/settings.component";


@Injectable()
export class AppService {
    constructor() {}

    public isSignedIn(): boolean {
        status = localStorage.getItem('isSignedIn');
        if (status == 'true') { return true;}
        else {return false;}
    }

    public testingToggle(): void {
        //Change this to false to stop the testing set up
        var toggle = false;

        if(!environment.production && toggle){
            localStorage.setItem("userID", "defaultUserID");
            localStorage.setItem("userFirstName", "Patrick");
            localStorage.setItem("userLastName", "Bateman");
            localStorage.setItem("isSignedIn", "true");
            localStorage.setItem("styleSelected", "default-style");
            //localStorage.setItem("styleSelected", "dark-style");
            //localStorage.setItem("styleSelected", "light-style");
        }
    }

    public styleClassSelector(): any {

        var font: String = localStorage.getItem("fontSelected");
        var style: String = localStorage.getItem("styleSelected");

        if(font == null || font == ""){
            font = "arial";
        }

        if(style == null || style == ""){
            style = "panda";
        }

        return [font.toLowerCase(), style.toLowerCase()] ;
    }

}
