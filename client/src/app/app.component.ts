import {Component} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';



@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'Friendly Panda App';

    appHeight: number;
    appWidth: number;

    currentScreenWidth: number;
    //gapi : any;


    constructor(private http: HttpClient) {
        this.appHeight = (window.screen.height);
        this.appWidth = (window.screen.width);
        this.currentScreenWidth = (window.screen.width);

        gapi.load('auth2', function () {
            gapi.auth2.init({
                client_id: '1080043572259-h3vk6jgc4skl3uav3g0l13qvlcqpebvu.apps.googleusercontent.com'
            });
        });
    }


    onResize (event) {
        this.currentScreenWidth = event.target.innerWidth;
    }

    signIn() {
        let googleAuth = gapi.auth2.getAuthInstance();

        googleAuth.then(() => {
            googleAuth.signIn({scope: 'profile email'}).then(googleUser => {
                console.log(googleUser.getBasicProfile().getName() + ' has signed in.');
                //this.sendTokenToServer(googleAuth.currentUser.get().getAuthResponse().id_token);
                this.signInCookie(googleUser.getBasicProfile().getEmail(), googleAuth.currentUser.get().getAuthResponse().id_token);
                // console.log("these are all the values inside of the getAuthResponse");
                // console.log(googleAuth.currentUser.get().getAuthResponse(true));
                // console.log(googleAuth.currentUser.get().getAuthResponse(false));

/*
                googleAuth.grantOfflineAccess().then(function (resp) {
                    console.log("It went in here");
                    console.log(resp.code);
                    if (resp.code != null) {
                        console.log("Then resp.code wasn't null");




                    } else {
                        console.log("Then resp.code was null");
                    }
                });
                */
            });
        });



    }


    signOut() {
        let googleAuth = gapi.auth2.getAuthInstance();

        googleAuth.then(() => {
            googleAuth.signOut();
            window.location.reload();
        })
    }

    sendTokenToServer(token: string): void {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        this.http.post(environment.API_URL + "login", {token: token}, httpOptions)
            .subscribe(onSuccess => {
                console.log("WE CAN SAVE A COOKIE");
            }, onFail => {
                console.log("no cookie for you");
            });
    }

    signInCallback(authResult) {

    }

    signInCookie(email: string, token: string) {
        document.cookie = "token="+token+";";
        document.cookie = "email="+email+";";

        console.log(document.cookie);

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Set-Cookie': "token="+token+";"
            }),
        };

        this.http.post(environment.API_URL + "login", {withCredentials: true}, httpOptions)
            .subscribe(onSuccess => {
                console.log("WE CAN SAVE A COOKIE");
            }, onFail => {
                console.log("no cookie for you");
            });
    }

}
