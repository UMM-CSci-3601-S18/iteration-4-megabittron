import {Component} from '@angular/core';

@Component({
    selector: 'resources-component',
    templateUrl: 'resources.component.html',
    styleUrls: ['./resources.component.css'],
})
export class ResourcesComponent {
    public videoTitle; linkTitle; numberTitle: string;

    constructor() {
        this.videoTitle = 'Videos';
        this.linkTitle = 'Links';
        this.numberTitle = 'Phone Numbers';
    }
}
