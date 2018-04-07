import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MATERIAL_COMPATIBILITY_MODE } from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {Routing} from './app.routes';
import {APP_BASE_HREF} from '@angular/common';
import {CustomModule} from './custom.module';
import {ResourcesComponent} from "./resources/resources.component";
import {EmotionService} from "./home/home.service";
import {GoalsComponent} from "./goals/goals.component";
import {GoalsService} from "./goals/goals.service";
//import {EditGoalComponent} from "./goals/edit-goal.component";
import {AddGoalComponent} from "./goals/add-goal.component";
import {EmotionResponseComponent} from "./home/emotion-response.component";
import {EmotionResponseHappyComponent} from "./home/emotion-response-happy.component";
import {SummaryListComponent} from "./summary/summary-list.component";
import {SummaryListService} from "./summary/summary-list.service";
import {JournalsComponent} from "./journals/journals.component";
import {AddJournalComponent} from "./journals/add-journal.component";
import {EditJournalComponent} from "./journals/edit-journal.component";
import {ShowJournalComponent} from "./journals/show-journal.component";
import {JournalsService} from "./journals/journals.service";
import {TruncatePipe} from "./journals/truncate-pipe.component";

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        Routing,
        CustomModule,
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
        //EditGoalComponent,
        ShowJournalComponent,
        SummaryListComponent,
        EmotionResponseComponent,
        EmotionResponseHappyComponent,
        TruncatePipe,
    ],
    providers: [
    GoalsService,
    JournalsService,
    EmotionService,
    SummaryListService,
    {provide: APP_BASE_HREF, useValue: '/'},
    {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}
],
    entryComponents: [

        AddGoalComponent,
        //EditGoalComponent,
        EmotionResponseComponent,
        EmotionResponseHappyComponent,
        AddJournalComponent,
        EditJournalComponent,
        ShowJournalComponent,
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
