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



    /** NEED TO GET DELAY FUNCTION. MUST DELAY AFTER TAB SWITCH **/

    /**
    // make sure there is an emotions dropdown button
    it('Should have an Emotion dropdown ', () => {
        SummaryPage.navigateTo();
        element(by.id('md-tab-label-0-1')).click();
        page.delay(500000);
        expect(page.selectEmotionDropdown()).toBeTruthy();
    });z

    // make sure it clicks emotion dropdown
    it('Should click the Emotion dropdown ', () => {
        SummaryPage.navigateTo();
        element(by.id('md-tab-label-0-1')).click();
        page.delay(500000);
        page.clickEmotionDropdown();
    });

    // makes sure it clicks on the Happy labeled emotion dropdown
    it('Should click on Happy dropdown ', () => {
        SummaryPage.navigateTo();
        element(by.id('md-tab-label-0-1')).click();
        page.delay(500000);
        page.clickEmotionDropdown();
        element(by.className('md-option-1')).click();
    });

    // makes sure it clicks on the Sad labeled emotion dropdown
    it('Should click on Sad dropdown ', () => {
        SummaryPage.navigateTo();
        element(by.id('md-tab-label-0-1')).click();
        page.delay(500000);
        page.clickEmotionDropdown();
        element(by.className('md-option-2')).click();
    });

    // makes sure it clicks on the Meh labeled emotion dropdown
    it('Should click on Meh dropdown ', () => {
        SummaryPage.navigateTo();
        element(by.id('md-tab-label-0-1')).click();
        page.delay(500000);
        page.clickEmotionDropdown();
        element(by.className('md-option-3')).click();
    });

    // makes sure it clicks on the Mad labeled emotion dropdown
    it('Should click on Mad dropdown ', () => {
        SummaryPage.navigateTo();
        element(by.id('md-tab-label-0-1')).click();
        page.delay(500000);
        page.clickEmotionDropdown();
        element(by.className('md-option-4')).click();
    });

    // makes sure it clicks on the Anxious labeled emotion dropdown
    it('Should click on Anxious dropdown ', () => {
        SummaryPage.navigateTo();
        element(by.id('md-tab-label-0-1')).click();
        page.delay(500000);
        page.clickEmotionDropdown();
        element(by.className('md-option-5')).click();
    });

    // makes sure it clicks on the Happy labeled Emotion dropdown and then all emotions dropdown
    it('Should click on Happy dropdown and then do process again with the all emotions dropdown  ', () => {
        SummaryPage.navigateTo();
        element(by.id('md-tab-label-0-1')).click();
        page.delay(500000);
        page.clickEmotionDropdown();
        element(by.className('md-option-1')).click();
        page.clickEmotionDropdown();
        element(by.className('md-option-0')).click();
    });


    /** *************************************************************************** **/

    /**
// make sure there is an intensity dropdown button
    it('Should have an Intensity dropdown ', () => {
        SummaryPage.navigateTo();
        element(by.id('md-tab-label-0-1')).click();
        page.delay(500000);
        expect(page.selectIntensityDropdown()).toBeTruthy();
    });

    // make sure it clicks intensity dropdown
    it('Should click the Intensity dropdown ', () => {
        SummaryPage.navigateTo();
        element(by.id('md-tab-label-0-1')).click();
        page.delay(500000);
        page.clickIntensityDropdown();
    });

    // makes sure it clicks on dropdown 1
    it('Should click on dropdown 1', () => {
        SummaryPage.navigateTo();
        element(by.id('md-tab-label-0-1')).click();
        page.delay(500000);
        page.clickIntensityDropdown();
        element(by.className('md-option-7')).click();
    });

    // makes sure it clicks on dropdown 2
    it('Should click on dropdown 2', () => {
        SummaryPage.navigateTo();
        element(by.id('md-tab-label-0-1')).click();
        page.delay(500000);
        page.clickIntensityDropdown();
        element(by.className('md-option-8')).click();
    });

    // makes sure it clicks on dropdown 3
    it('Should click on dropdown 3', () => {
        SummaryPage.navigateTo();
        element(by.id('md-tab-label-0-1')).click();
        page.delay(500000);
        page.clickIntensityDropdown();
        element(by.className('md-option-9')).click();
    });

    // makes sure it clicks on dropdown 4
    it('Should click on dropdown 4', () => {
        SummaryPage.navigateTo();
        element(by.id('md-tab-label-0-1')).click();
        page.delay(500000);
        page.clickIntensityDropdown();
        element(by.className('md-option-10')).click();
    });

    // makes sure it clicks on dropdown 5
    it('Should click on dropdown 5', () => {
        SummaryPage.navigateTo();
        element(by.id('md-tab-label-0-1')).click();
        page.delay(500000);
        page.clickIntensityDropdown();
        element(by.className('md-option-11')).click();
    });

    // makes sure it clicks on dropdown 1 then dropdown 'all'
    it('Should click on dropdown 1 and then dropdown \'all\'  ', () => {
        SummaryPage.navigateTo();
        element(by.id('md-tab-label-0-1')).click();
        page.delay(500000);
        page.clickIntensityDropdown();
        element(by.className('md-option-7')).click();
        page.clickIntensityDropdown();
        element(by.className('md-option-6')).click();
    });

    /** **/

    /**
    // makes sure there is a start date text field
    it('Should be a start date text field ', () => {
        SummaryPage.navigateTo();
        element(by.id('md-tab-label-0-1')).click();
        page.delay(500000);
        expect(page.selectStartDate()).toBeTruthy();
    });

    // makes sure it clicks on the choose a start date text field
    it('Should click on the choose a start date text field ', () => {
        SummaryPage.navigateTo();
        element(by.id('md-tab-label-0-1')).click();
        page.delay(500000);
        page.clickStartDate();
        element(by.className('startDate')).click();
    });

    // makes sure there is an end date text field
    it('Should be an end date text field ', () => {
        SummaryPage.navigateTo();
        element(by.id('md-tab-label-0-1')).click();
        page.delay(500000);
        expect(page.selectEndDate()).toBeTruthy();
    });

    // makes sure it clicks on the choose an end date text field
    it('Should click on the choose an end date text field ', () => {
        SummaryPage.navigateTo();
        element(by.id('md-tab-label-0-1')).click();
        page.delay(500000);
        page.clickEndDate();
        element(by.className('endDate')).click();
    });

    // makes sure it clicks on the choose start date calendar button
    it('Should click on the choose a start date calendar button ', () => {
        SummaryPage.navigateTo();
        element(by.id('md-tab-label-0-1')).click();
        page.delay(500000);
        element(by.className('startButton')).click();
    });

    // makes sure it clicks on the choose end date calendar button
    it('Should click on the choose an end date calendar button ', () => {
        SummaryPage.navigateTo();
        element(by.id('md-tab-label-0-1')).click();
        page.delay(500000);
        element(by.className('endButton')).click();
    });


    // Should click on the clear date filters button
    it('Should click on the clear date filters button', () => {
        SummaryPage.navigateTo();
        element(by.id('md-tab-label-0-1')).click();
        page.delay(500000);
        element(by.className('clearDatesButton')).click();
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
        element(by.className('day')).click();
    });

    // makes sure it clicks on dropdown 1 then dropdown 'all'
    it('Should click on dropdown 1 and then dropdown \'all\'  ', () => {
        SummaryPage.navigateTo();
        page.clickTimeDropdown();
        element(by.className('day')).click();
        page.clickTimeDropdown();
        element(by.className('week')).click();
    });

    // makes sure it clicks on dropdown month
    it('Should click on dropdown month', () => {
        SummaryPage.navigateTo();
        page.clickTimeDropdown();
        element(by.className('month')).click();
    });

    // makes sure it clicks on dropdown year
    it('Should click on dropdown year', () => {
        SummaryPage.navigateTo();
        page.clickTimeDropdown();
        element(by.className('year')).click();
    });

    /** **/

    it('Should click on the past X radios', () => {
        SummaryPage.navigateTo();
        element(by.className('pastXYes')).click();
        element(by.className('pastXNo')).click();
    });

    it('Should click on the colorblind box', () => {
        SummaryPage.navigateTo();
        element(by.className('colorblindBox')).click();
    });


    it('Should click on the bar graph then line graph radio', () => {
        SummaryPage.navigateTo();
        element(by.className('barradio')).click();
        element(by.className('lineradio')).click();
    });


    it('Should click on the list tab then graph tab', () => {
        SummaryPage.navigateTo();
        element(by.className('mat-tab-label mat-ripple ng-star-inserted')).click();
        element(by.className('mat-tab-label mat-ripple ng-star-inserted')).click();
    });

});
