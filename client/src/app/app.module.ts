import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {Routing} from './app.routes';
import {APP_BASE_HREF} from '@angular/common';
import {CustomModule} from './custom.module';
import {ResourcesComponent} from "./resources/resources.component";
import {ResourcesService} from "./resources/resources.service";
import {EmotionService} from "./home/home.service";
import {GoalsComponent} from "./goals/goals.component";
import {GoalsService} from "./goals/goals.service";
import {AddGoalComponent} from "./goals/add/add-goal.component";
import {SummaryListComponent} from "./summary/summary-list.component";
import {SummaryListService} from "./summary/summary-list.service";
import {JournalsComponent} from "./journals/journals.component";
import {AddJournalComponent} from "./journals/add/add-journal.component";
import {EditJournalComponent} from "./journals/edit/edit-journal.component";
import {ShowJournalComponent} from "./journals/show/show-journal.component";
import {ViewJournalComponent} from "./journals/view/view-journal.component";
import {JournalsService} from "./journals/journals.service";
import {ArraySortPipe} from "./journals/array-sort.pipe";
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {AppService} from "./app.service";
import {RouterModule} from "@angular/router";
import {MatTableModule} from "@angular/material/table";
import {ShowSummaryListComponent} from "./summary/show/show-summary-list.component";

@NgModule({
    exports: [
        ArraySortPipe,
        RouterModule
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        Routing,
        CustomModule,
        ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
        MatTableModule,
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        ResourcesComponent,
        GoalsComponent,
        AddGoalComponent,
        JournalsComponent,
        AddJournalComponent,
        EditJournalComponent,
        ShowJournalComponent,
        ViewJournalComponent,
        SummaryListComponent,
        ArraySortPipe,
        ShowSummaryListComponent,
    ],
    providers: [
        GoalsService,
        JournalsService,
        EmotionService,
        SummaryListService,
        AppService,
        ResourcesService,
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
    ],
    entryComponents: [
        AddGoalComponent,
        AddJournalComponent,
        EditJournalComponent,
        ShowJournalComponent,
        ShowSummaryListComponent,
        ViewJournalComponent,
    ],
    bootstrap: [
        AppComponent
    ]
})

export class AppModule {
}
