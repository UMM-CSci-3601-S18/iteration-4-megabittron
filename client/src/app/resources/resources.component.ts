import {Component} from '@angular/core';

@Component({
    templateUrl: 'resources.component.html'
})
export class ResourcesComponent {
    public title: string;

    constructor() {
        this.title = 'Resources';
    }
}
