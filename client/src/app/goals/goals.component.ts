import {Component} from '@angular/core';

@Component({
    selector: 'goals-component',
    templateUrl: 'goals.component.html',
    styleUrls: ['./goals.component.css'],
})
export class GoalsComponent {
    public title: string;

    constructor() {
        this.title = 'Goals';
    }
}
