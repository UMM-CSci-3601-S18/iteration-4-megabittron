/*
import {Component, OnInit} from '@angular/core';
import {AppService} from "../../../app.service";
import {Link} from '../../contact';
import {ResourcesService} from "../../resources.service";
import {EditLinkComponent} from "../../edit/contacts/edit-contacts.component";
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

export class ViewLinkComponent implements OnInit {

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

    public contacts: Link[] = [];
    public length: number;
    public index = 0;
    private highlightedID: {'$oid': string} = { '$oid': '' };
    public id: string;
    public contact: Link = {
        _id: '',
        userID: '',
        name: '',
        phone: '',
        email: ''
    };

    backClicked() {
        this._location.back();

    }

    openEditLinkDialog(_id: string, name: string, phone: string, email: string): void {
        console.log("Edit contact button clicked.");
        console.log(_id + ' ' + name + phone + email);
        const newLink: Link = {_id: _id, userID: localStorage.getItem('userID'), name: name, phone: phone, email: email};
        const dialogRef = this.dialog.open(EditLinkComponent, {
            width: '300px',
            data: { contact: newLink }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == undefined) {
                console.log("Cancelled without editing the contact.");
            } else {
                this.contactListService.editLink(result).subscribe(
                    editLinkResult => {
                        this.highlightedID = editLinkResult;
                        this.refreshLink();
                        this.snackBar.open("Edited Link", "CLOSE", {
                            duration: 2000,
                        });
                        console.log("Link edited.");
                    },
                    err => {
                        // This should probably be turned into some sort of meaningful response.
                        console.log('There was an error editing the contact.');
                        console.log('The error was ' + JSON.stringify(err));
                    });
            }
        });
    }

    deleteLink(_id: string) {
        this.contactListService.deleteLink(_id).subscribe(
            contacts => {
                console.log("first part");
                this.refreshLink();
                //this.loadService();
            },
            err => {
                console.log(err);
                console.log("hi");
                this.refreshLink();
                //this.loadService();
                this.snackBar.open("Deleted Link", "CLOSE", {
                    duration: 2000,
                });
            }
        );
    }

    refreshLink(): Observable<Link> {
        const contactObservable: Observable<Link> = this.contactListService.getLinks(this.id);
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
        this.contactListService.getLinks(this.id).subscribe(
            data => {
                this.contact = data;
            },
            err => {
                console.log(err);
            }
        );
    }

    isHighlighted(contact: Link): boolean {
        return contact._id['$oid'] === this.highlightedID['$oid'];
    }

    ngOnInit(): void {
        this.appService.testingToggle();
        this.refreshLink();
        this.loadService();
    }

}
*/
