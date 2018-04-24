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

    it('Total number of journals should be 74', () => {
        page.navigateTo();
        expect(page.getJournals()).toEqual(74);
    });

    it('Should type something in filter title box and check that it contains correct element', () => {
        page.navigateTo();
        page.typeATitle('Mcintyre');
        expect(page.getUniqueJournal('5ad12a56d70cc2aac52a0bc9')).toContain('Cathleen Mcintyre');
    });

    it('Should type something in filter content box and check that it contains correct element', () => {
        page.navigateTo();
        page.typeAContent('sunt deserunt voluptate');
        expect(page.getUniqueJournal('5ad12a56aa17a895febd4c93')).toContain('Oneill Woods');
    });

    it('Should filter by title and content and check that it contains correct element', () => {
        page.navigateTo();
        page.typeATitle('St')
        page.typeAContent('id esse');
        expect(page.getUniqueJournal('5ad12a5674d890bf086475aa')).toContain('Chapman Stanley');
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
        element(by.id('titleField')).sendKeys('Sad day');
        element(by.id('contentField')).sendKeys('Today was sad because my pet rock got hit by a car.');
        element(by.id('confirmAddJournalButton')).click();
    });

    // This test will not work because it cannot find the edit journal button class name since it
    // is inside of the mat-title.
    it('Should open a dialog box when edit journal button is clicked', () => {
        page.navigateTo();
        page.typeAContent('do nulla incididunt');
        expect(element(by.className('edit-journal-page')).isPresent()).toBeFalsy('There should not be a modal window yet');
        page.clickEditJournalButton();
        expect(element(by.className('edit-journal-page')).isPresent()).toBeTruthy('There should be a modal window now');
    });

    it('Should actually edit the journal with the information we put in the fields', () => {
        page.navigateTo();
        page.typeAContent('sunt deserunt voluptate laboris dolore. ');
        page.clickEditJournalButton();
        element(by.id('titleField')).sendKeys('Great day!');
        element(by.id('contentField')).sendKeys('Today my snail won a race against a rabbit.');
        element(by.id('confirmEditJournalButton')).click();
    });

});
