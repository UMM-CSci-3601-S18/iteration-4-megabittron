import {Component} from '@angular/core';

@Component({
    selector: 'resources-component',
    templateUrl: 'resources.component.html',
    styleUrls: ['./resources.component.css'],
})
export class ResourcesComponent {
    videoTitle; linkTitle; numberTitle: string;

    constructor() {
        this.videoTitle = 'Videos';
        this.linkTitle = 'Links';
        this.numberTitle = 'Phone Numbers';
    }

    videos = [
        {
            name: 'Funny',
            subname: 'Cats, Dogs, & Babies',
            url: 'https://www.youtube.com/embed/videoseries?list=PLJmTiSHMC37AO-nqegk5cEwS1ElAoQLNr'
        },
        {
            name: 'Depression',
            subname: 'Rejection, Suicide, & More',
            url: 'https://www.youtube.com/embed/videoseries?list=PLJmTiSHMC37CvQMRHaqg-6yEQpLWjAdWu&index=2'
        },        {
            name: 'Satisfying',
            subname: 'Relaxing & More',
            url: 'https://www.youtube.com/embed/videoseries?list=PLJmTiSHMC37D36KCVAns9LYvh1BV4m6YX'
        },        {
            name: 'Anger Management',
            subname: 'Techniques & Tips',
            url: 'https://www.youtube.com/embed/videoseries?list=PLJmTiSHMC37Dx6Ohz5al_e1GljuZqvZ_M'
        },        {
            name: 'Anxiety',
            subname: 'Dealing with negative thoughts',
            url: 'https://www.youtube.com/embed/videoseries?list=PLJmTiSHMC37BVBh18FtFKX-fEEroV6tQ9&index=8'
        },
    ]

    links = [
        {
            name: 'Depression Help',
            url: 'https://depression.org.nz/get-better/self-help/'
        },        {
            name: 'Coping With Depression',
            url: 'https://www.helpguide.org/articles/depression/coping-with-depression.htm'
        },        {
            name: 'Manage Anxiety and Stress',
            url: 'https://adaa.org/tips-manage-anxiety-and-stress'
        },        {
            name: 'Anxiety Help',
            url: 'https://www.calmclinic.com/anxiety-guide/help-options'
        },        {
            name: 'Anger Management: 10 tips',
            url: 'https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/anger-management/art-20045434'
        },        {
            name: 'General Anger Mangement',
            url: 'https://www.mindtools.com/pages/article/newTCS_97.htm'
        },
    ]

    callNumbers = [
        {
            name: 'Suicide Prevention Lifeline',
            description: 'We can all help prevent suicide. The Lifeline provides 24/7, free and confidential support for people in distress, prevention and crisis resources for you or your loved ones, and best practices for professionals.',
            number: '1-800-273-8255',
        },        {
            name: 'Feeling Kinda Blue',
            description: 'Feeling Kinda Blue is a social networking site for those living the life of the blues - depression, anxiety, grief, emotional pain, isolation, mental illness - We are here 24/7 to offer support.',
            number: '1-866-728-7983',
        },        {
            name: 'Disaster Distress Helpline',
            description: 'The Disaster Distress Helpline, is a 24/7, 365-day-a--year, national hotline dedicated to providing immediate crisis counseling for people who are experiencing emotional distress related to any natural or human-caused disaster. This toll-free, multilingual, and confidential crisis support service is available to all residents in the United States and its territories. Stress, anxiety, and other depression-like symptoms are common reactions after a disaster.',
            number: '1-800-985-5990',
        },
    ]

    textNumbers = [
        {
            name: 'HopeLine',
            description: 'HopeLine’s mission is to support people and save lives during times of crisis through caring, confidential conversations.',
            number: '1-877-235-4525',
        },        {
            name: 'Crisis Text Line',
            description: 'Every texter is connected with a Crisis Counselor, a real-life human being trained to bring texters from a hot moment to a cool calm through active listening and collaborative problem solving. All of Crisis Text Line\'s Crisis Counselors are volunteers, donating their time to helping people in crisis.',
            number: '741741',
        },
    ]
}
