import {Component} from '@angular/core';

@Component({
    selector: 'summary-component',
    templateUrl: 'summary.component.html',
    styleUrls: ['./summary.component.css'],
})
export class SummaryComponent {
    public title: string;

    constructor() {
        this.title = 'Summary';
    }
}
