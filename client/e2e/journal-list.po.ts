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
        return element.all(by.className('journal-card')).count();
    }

    typeASearch(title: string) {
        const input = element(by.className('search'));
        input.click();
        input.sendKeys(title);
    }

    getJournalsTitle() {
        const title = element(by.className('page-title')).getText();
        this.highlightElement(by.className('page-title'));
        return title;
    }

    getUniqueJournal(anID: string) {
        const journal = element(by.id(anID)).getText();
        this.highlightElement(by.id(anID));

        return journal;
    }

    addButtonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('addNewJournal'));
        return element(by.id('addNewJournal')).isPresent();
    }

    clickAddJournalButton(): promise.Promise<void> {
        this.highlightElement(by.id('addNewJournal'));
        return element(by.id('addNewJournal')).click();
    }

    clickEditJournalButton(): promise.Promise<void> {
        this.highlightElement(by.className('edit-journal'));
        return element(by.className('edit-journal')).click();
    }

}
