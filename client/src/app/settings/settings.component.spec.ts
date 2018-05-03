import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {SettingsComponent} from "./settings.component";
import {SettingsService} from "./settings.service";
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {ArraySortPipe} from "../journals/array-sort.pipe";
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import {RouterTestingModule} from "@angular/router/testing";

describe( 'Resources', () => {

    let settingsComponent: SettingsComponent;
    let fixture: ComponentFixture<SettingsComponent>;

    let settingsServiceStub: {
        saveSettings: () => Observable<String>,
        getStyle: () => Observable<String>
        //saveFont: () => Observable<String>
    };

    beforeEach(() => {
        // stub for test reasons
        settingsServiceStub = {
            saveSettings: () => Observable.of("test-setting"),
            getStyle: () => Observable.of("test-setting")
        };

        TestBed.configureTestingModule({
            imports: [CustomModule, RouterTestingModule],
            declarations: [SettingsComponent, ArraySortPipe],
            providers: [{provide: SettingsService, useValue: settingsServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(SettingsComponent);
            fixture.detectChanges();
        });
    }));

    //General Tests
//    it('contains all the links', () => {
//        expect(resourceList.links.length).toBe(3);
//    });

});

describe('saveSettings() to save a setting', () => {
    let settingsComponent: SettingsComponent;
    let fixture: ComponentFixture<SettingsComponent>;

    const newId = 'coffee_id';

    let linkListServiceStub: {
        saveSettings: () => Observable<String>,
        getStyle: () => Observable<String>
    };

    beforeEach(() => {
        calledLink = null;
        linkListServiceStub = {
            saveSettings: () => Observable.of("test-setting"),
            getStyle: () => Observable.of("test-setting")
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule, RouterTestingModule],
            declarations: [ResourcesComponent, ArraySortPipe],
            providers: [
                {provide: ResourcesService, useValue: linkListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ResourcesComponent);
            settingsComponent = fixture.componentInstance;
            fixture.detectChanges();
        });
        localStorage.isSignedIn = "true";
    }));

    it('calls ResourcesService.addNewLink', () => {
        expect(calledLink).toBeNull();
        settingsComponent.newLinkDialog();
        expect(calledLink).toEqual(newLink);
    });
});

describe('Adding a contact', () => {
    let resourceList: ResourcesComponent;
    let fixture: ComponentFixture<ResourcesComponent>;
    const newContact: Contact =   {
        _id: 'running_id',
        userID: 'userID3',
        name: 'Go on run',
        email: 'run@run.com',
        phone: "333-333-3333"
    };
    const newId = 'coffee_id';

    let calledContact: Contact;

    let contactListServiceStub: {
        getLinks: () => Observable<Link[]>,
        getContacts: () => Observable<Contact[]>,
        addNewContact: (newContact: Contact) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (ResourceListComponent, any) => {
            afterClosed: () => Observable<Contact>
        };
    };

    beforeEach(() => {
        calledContact = null;
        // stub JournalsService for test reasons
        contactListServiceStub = {
            getLinks: () => Observable.of([
                {
                    _id: '',
                    userID: 'userID4',
                    name: 'To stay awake writing tests',
                    subname: 'Drink coffee',
                    url: "stayAwake.com"
                }
            ]),

            getContacts: () => Observable.of([
                {
                    _id: 'buying_id',
                    userID: 'userID1',
                    name: 'Buying food',
                    email: 'food@food.com',
                    phone: "555-555-5555"
                }
            ]),

            addNewContact: (contactToAdd: Contact) => {
                calledContact = contactToAdd;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(newContact);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule, RouterTestingModule],
            declarations: [SettingsComponent, ArraySortPipe],
            providers: [
                {provide: SettingsService, useValue: contactListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(SettingsComponent);
            resourceList = fixture.componentInstance;
            fixture.detectChanges();
        });
        localStorage.isSignedIn = "true";
    }));

    it('calls ResourcesService.addNewContact', () => {
        expect(calledContact).toBeNull();
        resourceList.newContactDialog();
        expect(calledContact).toEqual(newContact);
    });
});
