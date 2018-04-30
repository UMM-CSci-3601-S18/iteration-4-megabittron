import {NgModule} from '@angular/core';
import {BrowserModule } from '@angular/platform-browser';
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
import {EditGoalComponent} from "./goals/edit/edit-goal.component";
import {SummaryListComponent} from "./summary/summary-list.component";
import {SummaryListService} from "./summary/summary-list.service";
import {JournalsComponent} from "./journals/journals.component";
import {AddJournalComponent} from "./journals/add/add-journal.component";
import {EditJournalComponent} from "./journals/edit/edit-journal.component";
import {ViewJournalComponent} from "./journals/view/view-journal.component";
import {JournalsService} from "./journals/journals.service";
import {ArraySortPipe} from "./journals/array-sort.pipe";
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {AppService} from "./app.service";
import {RouterModule} from "@angular/router";
import {ShowSummaryListComponent} from "./summary/show/show-summary-list.component";
import {RandomPrompt} from "./journals/Prompts/open-prompts.component";


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

    ],
    declarations: [
        AppComponent,
        HomeComponent,
        ResourcesComponent,
        GoalsComponent,
        AddGoalComponent,
        EditGoalComponent,
        JournalsComponent,
        AddJournalComponent,
        EditJournalComponent,
        ViewJournalComponent,
        SummaryListComponent,
        ArraySortPipe,
        ShowSummaryListComponent,
        RandomPrompt,
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
        EditGoalComponent,
        AddJournalComponent,
        EditJournalComponent,
        ViewJournalComponent,
        ShowSummaryListComponent,
        RandomPrompt,

    ],
    bootstrap: [
        AppComponent
    ]
})

export class AppModule {
}
