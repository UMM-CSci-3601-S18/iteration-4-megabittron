import {Component} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';



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
    gapi : any;


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
                this.sendTokenToServer(googleAuth.currentUser.get().getAuthResponse().id_token);
                gapi.auth2.getAuthInstance().grantOfflineAccess().then(function (resp) {
                    if (resp.code != null) {





                    } else {

                    }
                });
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

        this.http.post("http://localhost:4567/api/login", {token: token}, httpOptions)
            .subscribe(onSuccess => {
                console.log("WE CAN SAVE A COOKIE");
            }, onFail => {
                console.log("no cookie for you");
            });
    }

    signInCallback(authResult) {

    }


}
