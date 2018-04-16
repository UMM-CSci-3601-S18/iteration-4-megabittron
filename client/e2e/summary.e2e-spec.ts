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
        element(by.id('md-option-1')).click();
    });

    // makes sure it clicks on the Sad labeled emotion dropdown
    it('Should click on Sad dropdown ', () => {
        SummaryPage.navigateTo();
        page.clickMoodDropdown();
        element(by.id('md-option-2')).click();
    });

    // makes sure it clicks on the Meh labeled emotion dropdown
    it('Should click on Meh dropdown ', () => {
        SummaryPage.navigateTo();
        page.clickMoodDropdown();
        element(by.id('md-option-3')).click();
    });

    // makes sure it clicks on the Mad labeled emotion dropdown
    it('Should click on Mad dropdown ', () => {
        SummaryPage.navigateTo();
        page.clickMoodDropdown();
        element(by.id('md-option-4')).click();
    });

    // makes sure it clicks on the Anxious labeled emotion dropdown
    it('Should click on Anxious dropdown ', () => {
        SummaryPage.navigateTo();
        page.clickMoodDropdown();
        element(by.id('md-option-5')).click();
    });

    // makes sure it clicks on the Happy labeled Mood dropdown and then all emotions dropdown
    it('Should click on Happy dropdown and then do process again with the all moods dropdown  ', () => {
        SummaryPage.navigateTo();
        page.clickMoodDropdown();
        element(by.id('md-option-1')).click();
        page.clickMoodDropdown();
        element(by.id('md-option-0')).click();
    });


    /** *************************************************************************** **/

// make sure there is an intensity dropdown button
    it('Should have an Intensity dropdown ', () => {
        SummaryPage.navigateTo();
        expect(page.selectIntensityDropdown()).toBeTruthy();
    });

    // make sure it clicks intensity dropdown
    it('Should click the Intensity dropdown ', () => {
        SummaryPage.navigateTo();
        page.clickIntensityDropdown();
    });

    // makes sure it clicks on dropdown 1
    it('Should click on dropdown 1', () => {
        SummaryPage.navigateTo();
        page.clickIntensityDropdown();
        element(by.id('md-option-7')).click();
    });

    // makes sure it clicks on dropdown 2
    it('Should click on dropdown 2', () => {
        SummaryPage.navigateTo();
        page.clickIntensityDropdown();
        element(by.id('md-option-8')).click();
    });

    // makes sure it clicks on dropdown 3
    it('Should click on dropdown 3', () => {
        SummaryPage.navigateTo();
        page.clickIntensityDropdown();
        element(by.id('md-option-9')).click();
    });

    // makes sure it clicks on dropdown 4
    it('Should click on dropdown 4', () => {
        SummaryPage.navigateTo();
        page.clickIntensityDropdown();
        element(by.id('md-option-10')).click();
    });

    // makes sure it clicks on dropdown 5
    it('Should click on dropdown 5', () => {
        SummaryPage.navigateTo();
        page.clickIntensityDropdown();
        element(by.id('md-option-11')).click();
    });

    // makes sure it clicks on dropdown 1 then dropdown 'all'
    it('Should click on dropdown 1 and then dropdown \'all\'  ', () => {
        SummaryPage.navigateTo();
        page.clickIntensityDropdown();
        element(by.id('md-option-7')).click();
        page.clickIntensityDropdown();
        element(by.id('md-option-6')).click();
    });

    /** **/

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


    // Should click on the clear date filters button
    it('Should click on the clear date filters button', () => {
        SummaryPage.navigateTo();
        element(by.id('clearDatesButton')).click();
    });


    /** *************************************************************************** **/

// make sure there is an time filter dropdown button
    it('Should have an time filter dropdown ', () => {
        SummaryPage.navigateTo();
        expect(page.selectTimeDropdown()).toBeTruthy();
    });

    // make sure it clicks time filter dropdown
    it('Should click the time filter dropdown', () => {
        SummaryPage.navigateTo();
        page.clickTimeDropdown();
    });

    // makes sure it clicks on dropdown day
    it('Should click on dropdown day', () => {
        SummaryPage.navigateTo();
        page.clickTimeDropdown();
        element(by.id('md-option-12')).click();
    });

    // makes sure it clicks on dropdown 1 then dropdown 'all'
    it('Should click on dropdown 1 and then dropdown \'all\'  ', () => {
        SummaryPage.navigateTo();
        page.clickTimeDropdown();
        element(by.id('md-option-12')).click();
        page.clickTimeDropdown();
        element(by.id('md-option-13')).click();
    });

    // makes sure it clicks on dropdown month
    it('Should click on dropdown month', () => {
        SummaryPage.navigateTo();
        page.clickTimeDropdown();
        element(by.id('md-option-14')).click();
    });

    // makes sure it clicks on dropdown year
    it('Should click on dropdown year', () => {
        SummaryPage.navigateTo();
        page.clickTimeDropdown();
        element(by.id('md-option-15')).click();
    });

    /** **/

    it('Should click on the past X box', () => {
        SummaryPage.navigateTo();
        element(by.id('pastXBox')).click();
    });

    it('Should click on the colorblind box', () => {
        SummaryPage.navigateTo();
        element(by.id('colorblindBox')).click();
    });


    it('Should click on the bar graph then line graph radio', () => {
        SummaryPage.navigateTo();
        element(by.id('barradio')).click();
        element(by.id('lineradio')).click();
    });


    it('Should click on the summary button', () => {
        SummaryPage.navigateTo();
        element(by.id('filterBasicButton')).click();
    });

    it('Should click on the detailed button', () => {
        SummaryPage.navigateTo();
        element(by.id('filterDetailedButton')).click();
    });

    it('Should click on the list tab then graph tab', () => {
        SummaryPage.navigateTo();
        element(by.id('md-tab-label-0-1')).click();
        element(by.id('md-tab-label-0-0')).click();
    });

});
