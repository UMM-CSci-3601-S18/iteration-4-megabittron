import {JournalPage} from './journal-list.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

const origFn = browser.driver.controlFlow().execute;

// https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/
// browser.driver.controlFlow().execute = function () {
//     let args = arguments;
//
//     // queue 100ms wait between test
//     // This delay is only put here so that you can watch the browser do its thing.
//     // If you're tired of it taking long you can remove this call
//     origFn.call(browser.driver.controlFlow(), function () {
//         return protractor.promise.delayed(100);
//     });
//
//     return origFn.apply(browser.driver.controlFlow(), args);
// };
describe('Journal list', () => {
    let page: JournalPage;

    beforeEach(() => {
        page = new JournalPage();
    });

    it('should get and highlight Journals title attribute ', () => {
        page.navigateTo();
        expect(page.getJournalTitle()).toEqual('Journals');
    });




    it('Should open the expansion panel and get the body', () => {
        page.navigateTo();
        page.getBody('DATA');
        browser.actions().sendKeys(Key.ENTER).perform();

        expect(page.getUniqueJournal('valerieerickson@datagene.com')).toEqual('Valerie Erickson');

        // This is just to show that the panels can be opened
        browser.actions().sendKeys(Key.TAB).perform();
        browser.actions().sendKeys(Key.ENTER).perform();
    });






// For examples testing modal dialog related things, see:
// https://code.tutsplus.com/tutorials/getting-started-with-end-to-end-testing-in-angular-using-protractor--cms-29318
// https://github.com/blizzerand/angular-protractor-demo/tree/final
    it('Should have an add journal button', () => {
        page.navigateTo();
        expect(page.buttonExists()).toBeTruthy();
    });

    it('Should open a dialog box when add journal button is clicked', () => {
        page.navigateTo();
        expect(element(by.css('add-journal')).isPresent()).toBeFalsy('There should not be a modal window yet');
        element(by.id('addNewJournal')).click();
        expect(element(by.css('add-journal')).isPresent()).toBeTruthy('There should be a modal window now');
    });

    it('Should actually add the journal with the information we put in the fields', () => {
        page.navigateTo();
        page.clickAddJournalButton();
        element(by.id('titleField')).sendKeys('Gym exercise');
        // Need to use backspace because the default value is -1. If that changes, this will change too.

        element(by.id('bodyField')).sendKeys('Core, upper body, and total body workout');
        element(by.id('_idField')).sendKeys('gym_exercise_id');
        element(by.id('confirmAddJournalButton')).click();
        // This annoying delay is necessary, otherwise it's possible that we execute the `expect`
        // line before the add journal has been fully processed and the new journal is available
        // in the list.
        setTimeout(() => {
            expect(page.getUniqueJournal('tracy@awesome.com')).toMatch('Gym exercise'); // toEqual('Gym exercise');
        }, 10000);
    });

    it('Should allow us to put information into the fields of the add journal dialog', () => {
        page.navigateTo();
        page.clickAddJournalButton();
        expect(element(by.id('TitleField')).isPresent()).toBeTruthy('There should be a title field');
        element(by.id('TitleField')).sendKeys('Eat health');


        expect(element(by.id('bodyField')).isPresent()).toBeTruthy('There should be a body field');
        element(by.id('bodyField')).sendKeys('Awesome Startup, LLC');
       // expect(element(by.id('emailField')).isPresent()).toBeTruthy('There should be an email field');
       // element(by.id('emailField')).sendKeys('dana@awesome.com');
        element(by.id('exitWithoutAddingButton')).click();
    });
});
