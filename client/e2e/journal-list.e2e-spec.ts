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
        expect(page.getJournalsTitle()).toEqual('Journals');
    });

    it('Should have an add journal button', () => {
        page.navigateTo();
        expect(page.addButtonExists()).toBeTruthy();
    });

    it('Should have a Journal Prompt button', () => {
        page.navigateTo();
        expect(page.promptButtonExists()).toBeTruthy();
    });

    it('Should click Journal Prompt button', () => {
        page.navigateTo();
        expect(page.promptButtonExists()).toBeTruthy();
        expect(page.getJournalPromptNoClick()).toEqual('Click for a prompt');
        expect(page.getJournalPromptNoClick()).toBeTruthy();
        expect(page.getJournalPrompt()).toEqual('');
        page.clickJournalPromptButton();
        expect(page.getJournalPrompt()).not.toEqual('');

    });

    it('Total number of journals should be 74', () => {
        page.navigateTo();
        expect(page.getJournals()).toEqual(74);
    });

    it('Should type a title in search box and check that it contains correct element', () => {
        page.navigateTo();
        page.typeASearch('Mcintyre');
        expect(page.getUniqueJournal('5ad12a56d70cc2aac52a0bc9')).toContain('Cathleen Mcintyre');
    });

    it('Should type a word from content in search box and check that it contains correct element', () => {
        page.navigateTo();
        page.typeASearch('sunt deserunt voluptate');
        expect(page.getUniqueJournal('5ad12a56aa17a895febd4c93')).toContain('Oneill Woods');
    });

    it('Should type a time and check that it contains correct element', () => {
        page.navigateTo();
        page.typeASearch('12:51')
        expect(page.getUniqueJournal('5ad12a56b95ecafb09d858e9')).toContain('Miranda Rivas');
    });

    it('Should actually add the journal with the information we put in the fields', () => {
        page.navigateTo();
        page.clickAddJournalButton();
        element(by.id('titleField')).sendKeys('Sad day');
        element(by.id('contentField')).sendKeys('Today was sad because my pet rock got hit by a car.');
        element(by.id('confirmAddJournalButton')).click();
    });

    it('Should actually add the journal with the information we put in the fields', () => {
        page.navigateTo();
        page.clickAddJournalButton();
        element(by.id('titleField')).sendKeys('Sad day');
        element(by.id('contentField')).sendKeys('Today was sad because my pet rock got hit by a car.');
        element(by.id('confirmAddJournalButton')).click();
    });

    it('Should click the first journal card', () => {
        page.navigateTo();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/journals');
        page.clickJournalCard();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/journals/5ad12a560b59379e56931423');

    });

    it('Should click first journal and check journal title', () => {
        page.navigateTo();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/journals');
        page.clickJournalCard();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/journals/5ad12a560b59379e56931423');
        expect(page.getJournalsTitle()).toEqual('Austin Griffin');
    });

    it('Should click first journal and check for back button then click it', () => {
        page.navigateTo();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/journals');
        page.clickJournalCard();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/journals/5ad12a560b59379e56931423');
        expect(page.backButtonExists()).toBeTruthy();
        page.clickJournalBackButton();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/journals');
    });

    it('Should click first journal and open a dialog box when edit journal button is clicked', () => {
        page.navigateTo();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/journals');
        page.clickJournalCard();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/journals/5ad12a560b59379e56931423');
        expect(page.editButtonExists()).toBeTruthy();
        expect(element(by.className('edit-journal-page')).isPresent()).toBeFalsy('There should not be a modal window yet');
        page.clickEditJournalButton();
        expect(element(by.className('edit-journal-page')).isPresent()).toBeTruthy('There should be a modal window now');
    });

    it('Should click first journal and actually edit the journal with the information we put in the fields', () => {
        page.navigateTo();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/journals');
        page.clickJournalCard();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/journals/5ad12a560b59379e56931423');
        page.clickEditJournalButton();
        element(by.id('titleField')).sendKeys('Great day!');
        element(by.id('contentField')).sendKeys('Today my snail won a race against a rabbit.');
        element(by.id('confirmEditJournalButton')).click();
    });

    it('Should click first journal and check for delete button then click it', () => {
        page.navigateTo();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/journals');
        page.clickJournalCard();
        expect(page.getJournalsTitle()).toBe('Austin Griffin');
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/journals/5ad12a560b59379e56931423');
        expect(page.deleteButtonExists()).toBeTruthy();
        page.clickJournalDeleteButton();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/journals');
        page.clickJournalCard();
        expect(page.getJournalsTitle()).not.toBe('Austin Griffin');
    });
});
