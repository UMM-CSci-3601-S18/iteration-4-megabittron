import {HomePage} from './home.po';
import {element, by} from 'protractor';

describe('Home page', () => {
    let page: HomePage;

    beforeEach(() => {
        page = new HomePage();
    });

    it('should load', () => {
        HomePage.navigateTo();
    });

    it('restart button should be present', () => {
        expect(element(by.id('restart')).isPresent()).toBeTruthy();
    });

    it('should click a restart button', () => {
       element(by.id('restart')).click();
    });

    it('should select each emotion', () => {
        element(by.id('happy')).click();
        element(by.id('sad')).click();
        element(by.id('meh')).click();
        element(by.id('mad')).click();
        element(by.id('anxious')).click();
    });

    it('should run through emotion stepper with happy emotion selected', () => {
        HomePage.navigateTo();
        element(by.id('happy')).click();
        element(by.id('stepperButton1')).click();
        element(by.id('emotionSlider')).click();
        page.repeatRightArrowKey(2);
        element(by.id('stepperButton2')).click();
        element(by.id('textFormFieldBox')).click();
        page.typeText('im just testing so thats why im happy');
        element(by.id('stepperButton3')).click();
        expect(element(by.id('responseHappyVideoFrame')).isPresent()).toBeTruthy();
    });

    it('should run through emotion stepper with mad emotion selected', () => {
        HomePage.navigateTo();
        element(by.id('mad')).click();
        element(by.id('stepperButton1')).click();
        element(by.id('emotionSlider')).click();
        page.repeatRightArrowKey(3);
        element(by.id('stepperButton2')).click();
        element(by.id('textFormFieldBox')).click();
        page.typeText('i have lots of papers to write and articles to read. im mad');
        element(by.id('stepperButton3')).click();
        expect(element(by.id('responseMadVideoFrame')).isPresent()).toBeTruthy();
    });

    it('should run through emotion stepper with anxious and restart at the video step', () => {
        HomePage.navigateTo();
        element(by.id('anxious')).click();
        element(by.id('stepperButton1')).click();
        element(by.id('emotionSlider')).click();
        page.repeatRightArrowKey(1);
        element(by.id('stepperButton2')).click();
        element(by.id('textFormFieldBox')).click();
        page.typeText('aaaaaaahhhhhhh');
        element(by.id('stepperButton3')).click();
        expect(element(by.id('responseAnxiousVideoFrame')).isPresent()).toBeTruthy();
        element(by.id('restart')).click();
    });

});
