import {JournalPage} from './journal-list.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

describe('Journal list', () => {
    let page: JournalPage;

    beforeEach(() => {
        page = new JournalPage();
    });

    it('Should get and highlight journals title attribute ', () => {
        page.navigateTo();
        expect(page.getJournalManageTitle()).toEqual('Your Journals');
    });

    it('Should have an add journal button', () => {
        page.navigateTo();
        expect(page.buttonExists()).toBeTruthy();
    });

    it('Total number of journals should be 200', () => {
        page.navigateTo();
        expect(page.getJournals()).toEqual(200);
    });

    it('Should type something in filter subject box and check that it contains correct element', () => {
        page.navigateTo();
        page.typeASubject('Suarez');
        expect(page.getUniqueJournal('5ac808fc682d63fabf664041')).toContain('Calderon Suarez');
    });

    it('Should type something in filter body box and check that it contains correct element', () => {
        page.navigateTo();
        page.typeABody('labore amet irure deserunt');
        expect(page.getUniqueJournal('5ac808fc0546c2e5108ca165')).toContain('Bryan Pierce');
    });

    it('Should filter by subject and body and check that it contains correct element', () => {
        page.navigateTo();
        page.typeASubject('Ang')
        page.typeABody('In cons');
        expect(page.getUniqueJournal('5ac808fc504630e45694422e')).toContain('Angie Mckenzie');
    });

    it('Should open a dialog box when add journal button is clicked', () => {
        page.navigateTo();
        expect(element(by.className('add-journal')).isPresent()).toBeFalsy('There should not be a modal window yet');
        element(by.className('add-journal-button')).click();
        expect(element(by.className('add-journal')).isPresent()).toBeTruthy('There should be a modal window now');
    });

    it('Should actually add the journal with the information we put in the fields', () => {
        page.navigateTo();
        page.clickAddJournalButton();
        element(by.id('subjectField')).sendKeys('Sad day');
        element(by.id('bodyField')).sendKeys('Today was sad because my pet rock got hit by a car.');
        element(by.id('confirmAddJournalButton')).click();
    });

    it('Should open a dialog box when edit journal button is clicked', () => {
        page.navigateTo();
        page.typeABody('Id consectetur cupidatat Lorem elit');
        expect(element(by.className('edit-journal')).isPresent()).toBeFalsy('There should not be a modal window yet');
        element(by.className('edit-journal-button')).click();
        expect(element(by.className('edit-journal')).isPresent()).toBeTruthy('There should be a modal window now');
    });

    it('Should actually edit the journal with the information we put in the fields', () => {
        page.navigateTo();
        page.typeABody('Id consectetur cupidatat Lorem elit');
        page.clickEditJournalButton();
        element(by.id('subjectField')).sendKeys('Great day!');
        element(by.id('bodyField')).sendKeys('Today my snail won a race against a rabbit.');
        element(by.id('confirmEditJournalButton')).click();
    });

/*    it('Should actually click the navigation buttons and still have 10 journals on page everytime', () => {
        page.navigateTo();
        page.clickFirstIndexButton();
        expect(page.getJournals()).toEqual(10);
        page.clickLastIndexButton();
        expect(page.getJournals()).toEqual(10);
        page.clickPrevIndexButton();
        page.clickPrevIndexButton();
        expect(page.getJournals()).toEqual(10);
        page.clickNextIndexButton();
        page.clickNextIndexButton();
        expect(page.getJournals()).toEqual(10);
    });*/

});
