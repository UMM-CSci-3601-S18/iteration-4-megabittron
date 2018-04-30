
import {Component, OnInit} from '@angular/core';
import {AppService} from "../../../app.service";
import {Link} from '../../link';
import {ResourcesService} from "../../resources.service";
import {EditLinkComponent} from "../../edit/links/edit-links.component";
import {Observable} from "rxjs/Observable";
import {ActivatedRoute} from "@angular/router";
import {Location} from '@angular/common';
import {MatDialog, MatSnackBar} from '@angular/material';

@Component({
    selector: 'app-view-link.component',
    templateUrl: 'view-link.component.html',
    styleUrls: ['./view-link.component.scss'],
    providers: [AppService]
})

export class ViewLinkComponent implements OnInit {

    constructor(public appService: AppService,
                public linkListService: ResourcesService,
                private route: ActivatedRoute,
                private _location: Location,
                public dialog: MatDialog,
                private snackBar: MatSnackBar) {
        this.route.params.subscribe(params => {
            this.id = params['_id'];
        });
    }

    public links: Link[] = [];
    public length: number;
    public index = 0;
    private highlightedID: {'$oid': string} = { '$oid': '' };
    public id: string;
    public link: Link = {
        _id: '',
        userID: '',
        name: '',
        subname: '',
        url: ''
    };

    backClicked() {
        this._location.back();

    }

    openEditLinkDialog(_id: string, name: string, subname: string, url: string): void {
        console.log("Edit link button clicked.");
        console.log(_id + ' ' + name + subname + url);
        const newLink: Link = {_id: _id, userID: localStorage.getItem('userID'), name: name, subname: subname, url: url};
        const dialogRef = this.dialog.open(EditLinkComponent, {
            width: '300px',
            data: { link: newLink }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == undefined) {
                console.log("Cancelled without editing the link.");
            } else {
                this.linkListService.editLink(result).subscribe(
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
                        console.log('There was an error editing the link.');
                        console.log('The error was ' + JSON.stringify(err));
                    });
            }
        });
    }

    deleteLink(_id: string) {
        this.linkListService.deleteLink(_id).subscribe(
            links => {
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
        const linkObservable: Observable<Link> = this.linkListService.getLinks(this.id);
        linkObservable.subscribe(
            data => {
                this.link = data;
            },
            err => {
                console.log(err);
            });
        return linkObservable;
    }

    loadService(): void {
        this.linkListService.getLinks(this.id).subscribe(
            data => {
                this.link = data;
            },
            err => {
                console.log(err);
            }
        );
    }

    isHighlighted(link: Link): boolean {
        return link._id['$oid'] === this.highlightedID['$oid'];
    }

    ngOnInit(): void {
        this.appService.testingToggle();
        this.refreshLink();
        this.loadService();
    }

}

