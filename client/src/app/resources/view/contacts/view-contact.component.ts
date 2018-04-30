import {Component, OnInit} from '@angular/core';
import {AppService} from "../../../app.service";
import {Contact} from '../../contact';
import {ResourcesService} from "../../resources.service";
import {EditContactComponent} from "../../edit/contacts/edit-contacts.component";
import {Observable} from "rxjs/Observable";
import {ActivatedRoute} from "@angular/router";
import {Location} from '@angular/common';
import {MatDialog, MatSnackBar} from '@angular/material';

@Component({
    selector: 'app-view-contact.component',
    templateUrl: 'view-contact.component.html',
    styleUrls: ['./view-contact.component.scss'],
    providers: [AppService]
})

export class ViewContactComponent implements OnInit {

    constructor(public appService: AppService,
                public contactListService: ResourcesService,
                private route: ActivatedRoute,
                private _location: Location,
                public dialog: MatDialog,
                private snackBar: MatSnackBar) {
        this.route.params.subscribe(params => {
            this.id = params['_id'];
        });
    }

    public contacts: Contact[] = [];
    public length: number;
    public index = 0;
    private highlightedID: {'$oid': string} = { '$oid': '' };
    public id: string;
    public contact: Contact = {
        _id: '',
        userID: '',
        name: '',
        phone: '',
        email: ''
    };

    backClicked() {
        this._location.back();

    }

    openEditContactDialog(_id: string, name: string, phone: string, email: string): void {
        console.log("Edit contact button clicked.");
        console.log(_id + ' ' + name + phone + email);
        const newContact: Contact = {_id: _id, userID: localStorage.getItem('userID'), name: name, phone: phone, email: email};
        const dialogRef = this.dialog.open(EditContactComponent, {
            width: '300px',
            data: { contact: newContact }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == undefined) {
                console.log("Cancelled without editing the contact.");
            } else {
                this.contactListService.editContact(result).subscribe(
                    editContactResult => {
                        this.highlightedID = editContactResult;
                        this.refreshContact();
                        this.snackBar.open("Edited Contact", "CLOSE", {
                            duration: 2000,
                        });
                        console.log("Contact edited.");
                    },
                    err => {
                        // This should probably be turned into some sort of meaningful response.
                        console.log('There was an error editing the contact.');
                        console.log('The error was ' + JSON.stringify(err));
                    });
            }
        });
    }

    deleteContact(_id: string) {
        this.contactListService.deleteContact(_id).subscribe(
            contacts => {
                console.log("first part");
                this.refreshContact();
                //this.loadService();
            },
            err => {
                console.log(err);
                console.log("hi");
                this.refreshContact();
                //this.loadService();
                this.snackBar.open("Deleted Contact", "CLOSE", {
                    duration: 2000,
                });
            }
        );
    }

    refreshContact(): Observable<Contact> {
        const contactObservable: Observable<Contact> = this.contactListService.getContactById(this.id);
        contactObservable.subscribe(
            data => {
                this.contact = data;
            },
            err => {
                console.log(err);
            });
        return contactObservable;
    }

    loadService(): void {
        this.contactListService.getContactById(this.id).subscribe(
            data => {
                this.contact = data;
            },
            err => {
                console.log(err);
            }
        );
    }

    isHighlighted(contact: Contact): boolean {
        return contact._id['$oid'] === this.highlightedID['$oid'];
    }

    ngOnInit(): void {
        this.appService.testingToggle();
        this.refreshContact();
        this.loadService();
    }

}
