import {browser, element, by, promise} from 'protractor';
import {Key} from 'selenium-webdriver';

export class JournalPage {

    navigateTo(): promise.Promise<any> {
        return browser.get('/journals');
    }

    highlightElement(byObject) {
        function setStyle(element, style) {
            const previous = element.getAttribute('style');
            element.setAttribute('style', style);
            setTimeout(() => {
                element.setAttribute('style', previous);
            }, 100);
            return 'highlighted';
        }

        return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
    }

    getJournals() {
        return element.all(by.className('journals-card')).count();
    }

    typeASubject(subject: string) {
        const input = element(by.id('journalSubject'));
        input.click();
        input.sendKeys(subject);
    }

    typeABody(body: string) {
        const input = element(by.id('journalBody'));
        input.click();
        input.sendKeys(body);
    }

    backspace() {
        browser.actions().sendKeys(Key.BACK_SPACE).perform();
    }

    getJournalManageTitle() {
        const title = element(by.id('journal-title')).getText();
        this.highlightElement(by.id('journal-title'));
        return title;
    }

    getUniqueJournal(anID: string) {
        const journal = element(by.id(anID)).getText();
        this.highlightElement(by.id(anID));

        return journal;
    }

    clickUniqueJournal(anID: string) {
        const journal = element(by.id(anID));
        this.highlightElement(by.id(anID));
        journal.click();
        return journal;
    }

    buttonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('addNewJournal'));
        return element(by.id('addNewJournal')).isPresent();
    }

    clickAddJournalButton(): promise.Promise<void> {
        this.highlightElement(by.id('addNewJournal'));
        return element(by.id('addNewJournal')).click();
    }

    clickNextIndexButton(): promise.Promise<void> {
        this.highlightElement(by.id('nextIndexJournal'));
        return element(by.id('nextIndexJournal')).click();
    }

    clickPrevIndexButton(): promise.Promise<void> {
        this.highlightElement(by.id('prevIndexJournal'));
        return element(by.id('prevIndexJournal')).click();
    }

    clickFirstIndexButton(): promise.Promise<void> {
        this.highlightElement(by.id('firstIndexJournal'));
        return element(by.id('firstIndexJournal')).click();
    }

    clickLastIndexButton(): promise.Promise<void> {
        this.highlightElement(by.id('lastIndexJournal'));
        return element(by.id('lastIndexJournal')).click();
    }

    clickEditJournalButton(): promise.Promise<void> {
        this.highlightElement(by.id('edit-journal-button'));
        return element(by.id('edit-journal-button')).click();
    }

}
