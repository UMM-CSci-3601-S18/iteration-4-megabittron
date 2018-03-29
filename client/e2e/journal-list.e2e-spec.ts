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


    it('Should have an add journal button', () => {
        JournalPage.navigateTo();
        expect(page.buttonExists()).toBeTruthy();
    });

    it('Should have 5 journals', () => {
        JournalPage.navigateTo();
        JournalPage.getJournals().then(function(journals) {
            expect(journals.length).toBe(5);
        });
    });


    it('Should open a dialog box when add journal button is clicked', () => {
       JournalPage.navigateTo();
        expect(element(by.css('createJournal')).isPresent()).toBeFalsy('There should not be a modal window yet');
    });

    /*   it('Should have the journal I went to work.', () => {
           JournalPage.navigateTo();
           expect(page.getUniqueJournal('I went to work.')).toMatch('I went to work.');
       });



         it('Should actually add the journal with the information we put in the fields', () => {
              JournalPage.navigateTo();
              page.clickAddJournalButton();
              element(by.id('titleField')).sendKeys('Gym plan');
              element(by.id('bodyField')).sendKeys('10 push-ups');
              element(by.id('confirmAddJournalButton')).click();
              setTimeout(() => {
                  expect(page.getUniqueJournal('I meet my friends')).toMatch('I meet my friends');
              }, 10000);
          });

          it('Should allow us to put information into the fields of the add journal dialog', () => {
              JournalPage.navigateTo();
              page.clickAddJournalButton();
              expect(element(by.id('titleField')).isPresent()).toBeTruthy('There should be a age field');
              element(by.id('titleField')).sendKeys('Songs to listen');
              expect(element(by.id('bodyField')).isPresent()).toBeTruthy('There should be a category field');
              element(by.id('bodyField')).sendKeys('Said by Nasty C');
              element(by.id('exitWithoutAddingButton')).click();
          });  */
});
