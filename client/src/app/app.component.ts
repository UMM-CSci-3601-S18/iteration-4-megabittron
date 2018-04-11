import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';


declare var gapi: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'Friendly Panda App';

    appHeight: number;
    appWidth: number;

    currentScreenWidth: number;

    constructor(private http: HttpClient) {
        this.appHeight = (window.screen.height);
        this.appWidth = (window.screen.width);
        this.currentScreenWidth = (window.screen.width);
    }



    signIn() {
        let googleAuth = gapi.auth2.getAuthInstance();

        googleAuth.grantOfflineAccess().then((resp) => {
            localStorage.setItem('isSignedIn', 'true');
            this.sendAuthCode(resp.code);
        });





        /*googleAuth.then(() => {
            googleAuth.signIn({scope: 'profile email'}).then(googleUser => {

                //this.sendTokenToServer(googleAuth.currentUser.get().getAuthResponse().id_token);
                //this.signInCookie(googleUser.getBasicProfile().getEmail(), googleAuth.currentUser.get().getAuthResponse().id_token);
                // console.log("these are all the values inside of the getAuthResponse");
                // console.log(googleAuth.currentUser.get().getAuthResponse(true));
                // console.log(googleAuth.currentUser.get().getAuthResponse(false));

                /!*
                                googleAuth.grantOfflineAccess().then(function (resp) {
                                    console.log("It went in here");
                                    console.log(resp.code);
                                    if (resp.code != null) {
                                        console.log("Then resp.code wasn't null");




                                    } else {
                                        console.log("Then resp.code was null");
                                    }
                                });
                                *!/
            });
        });*/


    }


    signOut() {
        let googleAuth = gapi.auth2.getAuthInstance();


        googleAuth.then(() => {
            googleAuth.signOut();
            localStorage.setItem('isSignedIn', 'false');
            //window.location.reload();
        })
    }

    isSignedIn(): boolean {
        status = localStorage.getItem('isSignedIn');

        if (status == 'true') {
            console.log('true');

            return true;
        } else {
            console.log('false');
            return false;
        }
    }

    whoIsSignedIn() {
        let googleAuth = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
        console.log(googleAuth.getName());
    }

    sendAuthCode(code: string): void {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        this.http.post(environment.API_URL + "login", {code: code}, httpOptions)
            .subscribe(onSuccess => {
                console.log("Code sent to server");
            }, onFail => {
                console.log("ERROR: Code couldn't be sent to the server");
            });

    }

    /*signInCookie(email: string, token: string) {
        document.cookie = "token=" + token + ";";
        document.cookie = "email=" + email + ";";

        //console.log(document.cookie);

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Set-Cookie': "token=" + token + ";"
            }),
        };

        this.http.post(environment.API_URL + "login", {withCredentials: true}, httpOptions)
            .subscribe(onSuccess => {
                console.log("WE CAN SAVE A COOKIE");
            }, onFail => {
                console.log("no cookie for you");
            });
    }*/

    handleClientLoad() {
        gapi.load('client:auth2', this.initClient);
    }

    initClient() {

        gapi.client.init({
            'clientId': '1080043572259-h3vk6jgc4skl3uav3g0l13qvlcqpebvu.apps.googleusercontent.com',
            'scope': 'profile email'
        });

    }

    onResize(event) {
        this.currentScreenWidth = event.target.innerWidth;
    }

    ngOnInit() {
        this.handleClientLoad();

    }

}
