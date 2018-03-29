import {SummaryPage} from './summary.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';


describe('Summary', () => {
    let page: SummaryPage;

    beforeEach(() => {
        page = new SummaryPage();
    });

    it('Should load', () => {
        SummaryPage.navigateTo();
    });

    // make sure there is an emotions dropdown button
    it('Should have an Mood dropdown ', () => {
        SummaryPage.navigateTo();
        expect(page.selectMoodDropdown()).toBeTruthy();
    });

    // make sure it clicks emotion dropdown
    it('Should click the Mood dropdown ', () => {
        SummaryPage.navigateTo();
        page.clickMoodDropdown();
    });

    // makes sure it clicks on the Happy labeled emotion dropdown
    it('Should click on Happy dropdown ', () => {
        SummaryPage.navigateTo();
        page.clickMoodDropdown();
        element(by.id('dropdownHappy')).click();
    });

    // makes sure it clicks on the Sad labeled emotion dropdown
    it('Should click on Sad dropdown ', () => {
        SummaryPage.navigateTo();
        page.clickMoodDropdown();
        element(by.id('dropdownSad')).click();
    });

    // makes sure it clicks on the Meh labeled emotion dropdown
    it('Should click on Meh dropdown ', () => {
        SummaryPage.navigateTo();
        page.clickMoodDropdown();
        element(by.id('dropdownMeh')).click();
    });

    // makes sure it clicks on the Mad labeled emotion dropdown
    it('Should click on Mad dropdown ', () => {
        SummaryPage.navigateTo();
        page.clickMoodDropdown();
        element(by.id('dropdownMad')).click();
    });

    // makes sure it clicks on the Scared labeled emotion dropdown
    it('Should click on Scared dropdown ', () => {
        SummaryPage.navigateTo();
        page.clickMoodDropdown();
        element(by.id('dropdownScared')).click();
    });

    // makes sure it clicks on the Anxious labeled emotion dropdown
    it('Should click on Anxious dropdown ', () => {
        SummaryPage.navigateTo();
        page.clickMoodDropdown();
        element(by.id('dropdownAnxious')).click();
    });

    // makes sure it clicks on the Happy labeled Mood dropdown and then all emotions dropdown
    it('Should click on Happy dropdown and then do process again with the all moods dropdown  ', () => {
        SummaryPage.navigateTo();
        page.clickMoodDropdown();
        element(by.id('dropdownHappy')).click();
        page.clickMoodDropdown();
        element(by.id('dropdownAllMoods')).click();
    });

    // makes sure there is a start date text field
    it('Should be a start date text field ', () => {
        SummaryPage.navigateTo();
        expect(page.selectStartDate()).toBeTruthy();
    });

    // makes sure it clicks on the choose a start date text field
    it('Should click on the choose a start date text field ', () => {
        SummaryPage.navigateTo();
        page.clickStartDate();
        element(by.id('startDate')).click();
    });

    // makes sure there is an end date text field
    it('Should be an end date text field ', () => {
        SummaryPage.navigateTo();
        expect(page.selectEndDate()).toBeTruthy();
    });

    // makes sure it clicks on the choose an end date text field
    it('Should click on the choose an end date text field ', () => {
        SummaryPage.navigateTo();
        page.clickEndDate();
        element(by.id('endDate')).click();
    });

    // makes sure it clicks on the choose start date calendar button
    it('Should click on the choose a start date calendar button ', () => {
        SummaryPage.navigateTo();
        element(by.id('startButton')).click();
    });

    // makes sure it clicks on the choose end date calendar button
    it('Should click on the choose an end date calendar button ', () => {
        SummaryPage.navigateTo();
        element(by.id('endButton')).click();
    });

});
