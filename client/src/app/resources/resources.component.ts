import {AppService} from "../app.service";
import {Component, OnInit} from '@angular/core';
import {Contact} from './contact';
import {Link} from './link';
import {ResourcesService} from "./resources.service";
import {AddLinkComponent} from "./add/links/add-link.component";
import {MatDialog} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {MatSnackBar} from '@angular/material';
import {AddContactComponent} from "./add/contacts/add-contact.component";

@Component({
    selector: 'resources-component',
    templateUrl: 'resources.component.html',
    styleUrls: ['./resources.component.scss'],
    providers: [AppService]
})
export class ResourcesComponent implements OnInit{
    videoTitle; linkTitle; numberTitle: string;

    links: Link[] = [];
    contacts: Contact[] = [];

    constructor(public appService: AppService,
                public resourcesService: ResourcesService,
                public dialog: MatDialog,
                public snackBar: MatSnackBar) {
        this.videoTitle = 'Videos';
        this.linkTitle = 'Links';
        this.numberTitle = 'Phone Numbers';
    }

    private highlightedID: { '$oid': string } = {'$oid': ''};

    isLinkHighlighted(link: Link): boolean {
        return link._id['$oid'] === this.highlightedID['$oid'];
    }

    isContactHighlighted(contact: Contact): boolean {
        return contact._id['$oid'] === this.highlightedID['$oid'];
    }

    defaultVideos = [
        {
            _id: 'default',
            name: 'Funny',
            userID:'',
            subname: 'Cats, Dogs, & Babies',
            url: 'https://www.youtube.com/embed/videoseries?list=PLJmTiSHMC37AO-nqegk5cEwS1ElAoQLNr'
        },
        {
            _id: 'default',
            name: 'Depression',
            userID:'',
            subname: 'Rejection, Suicide, & More',
            url: 'https://www.youtube.com/embed/videoseries?list=PLJmTiSHMC37CvQMRHaqg-6yEQpLWjAdWu&index=2'
        },        {
            _id: 'default',
            name: 'Satisfying',
            userID:'',
            subname: 'Relaxing & More',
            url: 'https://www.youtube.com/embed/videoseries?list=PLJmTiSHMC37D36KCVAns9LYvh1BV4m6YX'
        },        {
            _id: 'default',
            name: 'Anger Management',
            userID:'',
            subname: 'Techniques & Tip',
            url: 'https://www.youtube.com/embed/videoseries?list=PLJmTiSHMC37Dx6Ohz5al_e1GljuZqvZ_M'
        },        {
            _id: 'default',
            name: 'Anxiety',
            userID:'',
            subname: 'Dealing with negative thoughts',
            url: 'https://www.youtube.com/embed/videoseries?list=PLJmTiSHMC37BVBh18FtFKX-fEEroV6tQ9&index=8'
        },
    ]

    defaultLinks: Link[] = [
        {
            _id: 'default',
            name: 'Depression Help',
            subname:'',
            userID:'',
            url: 'https://depression.org.nz/get-better/self-help/'
        },        {
            _id: 'default',
            name: 'Coping With Depression',
            subname:'',
            userID:'',
            url: 'https://www.helpguide.org/articles/depression/coping-with-depression.htm'
        },        {
            _id: 'default',
            name: 'Manage Anxiety and Stress',
            subname:'',
            userID:'',
            url: 'https://adaa.org/tips-manage-anxiety-and-stress'
        },        {
            _id: 'default',
            name: 'Anxiety Help',
            subname:'',
            userID:'',
            url: 'https://www.calmclinic.com/anxiety-guide/help-options'
        },        {
            _id: 'default',
            name: 'Anger Management: 10 tips',
            subname:'',
            userID:'',
            url: 'https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/anger-management/art-20045434'
        },        {
            _id: 'default',
            name: 'General Anger Mangement',
            subname:'',
            userID:'',
            url: 'https://www.mindtools.com/pages/article/newTCS_97.htm'
        },
    ]

    defaultContacts: Contact[] = [
        {
            _id: 'default',
            name: 'Suicide Prevention Lifeline',
            userID:'',
            //description: 'We can all help prevent suicide. The Lifeline provides 24/7, free and confidential support for people in distress, prevention and crisis resources for you or your loved ones, and best practices for professionals.',
            email:'',
            phone: '1-800-273-8255',
        },        {
            _id: 'default',
            name: 'Feeling Kinda Blue',
            userID:'',
            //description: 'Feeling Kinda Blue is a social networking site for those living the life of the blues - depression, anxiety, grief, emotional pain, isolation, mental illness - We are here 24/7 to offer support.',
            email:'',
            phone: '1-866-728-7983',
        },        {
            _id: 'default',
            name: 'Disaster Distress Helpline',
            userID:'',
            //description: 'The Disaster Distress Helpline, is a 24/7, 365-day-a--year, national hotline dedicated to providing immediate crisis counseling for people who are experiencing emotional distress related to any natural or human-caused disaster. This toll-free, multilingual, and confidential crisis support service is available to all residents in the United States and its territories. Stress, anxiety, and other depression-like symptoms are common reactions after a disaster.',
            email:'',
            phone: '1-800-985-5990',
        },
    ]

    defaultTextNumbers = [
        {
            _id: 'default',
            name: 'HopeLine',
            userID:'',
            description: 'HopeLine’s mission is to support people and save lives during times of crisis through caring, confidential conversations.',
            number: '1-877-235-4525',
        },        {
            _id: 'default',
            name: 'Crisis Text Line',
            userID:'',
            description: 'Every texter is connected with a Crisis Counselor, a real-life human being trained to bring texters from a hot moment to a cool calm through active listening and collaborative problem solving. All of Crisis Text Line\'s Crisis Counselors are volunteers, donating their time to helping people in crisis.',
            number: '741741',
        },
    ]

    newLinkDialog(): void {
        const newLink: Link = {
            _id: '',
            userID: localStorage.getItem("userID"),
            name: '',
            subname: '',
            url: '',
        };
        const dialogRef = this.dialog.open(AddLinkComponent, {
            width: '300px',
            data: {link: newLink}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == undefined) {
                console.log("Cancelled without adding a link");
            }
            else {
                if(localStorage.isSignedIn == "true"){
                    this.resourcesService.addNewLink(result).subscribe(
                        addLinkResult => {
                            this.highlightedID = addLinkResult;
                            this.refreshLinks();
                            this.snackBar.open("Link Created", "CLOSE", {
                                duration: 3000,
                            });
                        },
                        err => {
                            // This should probably be turned into some sort of meaningful response.
                            console.log('There was an error adding the link.');
                            console.log('The error was ' + JSON.stringify(err));
                        });
                }
            }
        });
    }

    newContactDialog(): void {
        const newContact: Contact = {
            _id: '',
            userID: localStorage.getItem("userID"),
            name: '',
            email: '',
            phone: '',
        };
        const dialogRef = this.dialog.open(AddContactComponent, {
            width: '300px',
            data: {contact: newContact}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == undefined) {
                console.log("Cancelled without adding a contact");
            }
            else {
                if(localStorage.isSignedIn == "true"){
                    this.resourcesService.addNewContact(result).subscribe(
                        addContactResult => {
                            this.highlightedID = addContactResult;
                            this.refreshLinks();
                            this.snackBar.open("Contact Created", "CLOSE", {
                                duration: 3000,
                            });
                        },
                        err => {
                            // This should probably be turned into some sort of meaningful response.
                            console.log('There was an error adding the contact.');
                            console.log('The error was ' + JSON.stringify(err));
                        });
                }
            }
        });
    }

    refreshLinks(): Observable<Link[]> {
        var userID = localStorage.getItem("userID");
        if(userID == null){
            userID = "";
        }
        const linkObservable: Observable<Link[]> = this.resourcesService.getLinks(userID);
        console.log(linkObservable);
        linkObservable.subscribe(
            links => {
                console.log(links);
                if(links != null){
                    this.links = links;
                }
            },
            err => {
                console.log(err);
            });
        return linkObservable;
    }

    refreshContacts(): Observable<Contact[]> {
        var userID = localStorage.getItem("userID");
        if(userID == null){
            userID = "";
        }
        const contactObservable: Observable<Contact[]> = this.resourcesService.getContacts(userID);
        console.log(contactObservable);
        contactObservable.subscribe(
            contacts => {
                console.log(contacts);
                if(contacts != null){
                    this.contacts = contacts;
                }
            },
            err => {
                console.log(err);
            });
        return contactObservable;
    }

    loadService(): void {
        console.log(localStorage.getItem("userID"));
        this.resourcesService.getLinks(localStorage.getItem("userID")).subscribe(
            links => {
                this.links = links;
            },
            err => {
                console.log(err);
            }
        );

        this.resourcesService.getContacts(localStorage.getItem("userID")).subscribe(
            links => {
                this.contacts = links;
            },
            err => {
                console.log(err);
            }
        );
    }

    ngOnInit(): void {
        //For testing
        //toggle the value in app service to toggle testing
        this.appService.testingToggle();
        this.refreshLinks();
        this.refreshContacts();
        this.loadService();
    }

}
