import {Component} from '@angular/core';

@Component({
    selector: 'home-component',
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent {
    public title: string;

    constructor() {
        this.title = 'Friendly Panda';
    }
}
