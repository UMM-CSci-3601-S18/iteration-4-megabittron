import {HomePage} from './home.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

fdescribe('Home page', () => {
    let page: HomePage;

    beforeEach(() => {
        page = new HomePage();
    });

    it('should load', () => {
        HomePage.navigateTo();
    });

    it('should have a restart button', () => {
        expect(page.selectRestartButton()).toBeTruthy();
    });

    it('should click a restart button', () => {
       element(by.id('restart')).click();
    });

    it('should select each emotion button', () => {
        element(by.id('happy')).click();
        element(by.id('sad')).click();
        element(by.id('meh')).click();
        element(by.id('mad')).click();
        element(by.id('anxious')).click();
    });

    it('should run through emotion selection stepper with happy', () => {
        element(by.id('happy')).click();
        element(by.id('stepperButton1')).click();
        element(by.id('emotionSlider')).click();
        browser.actions().sendKeys(protractor.Key.RIGHT);
        browser.actions().sendKeys(protractor.Key.RIGHT);
        browser.actions().sendKeys(protractor.Key.RIGHT);
    });
});

