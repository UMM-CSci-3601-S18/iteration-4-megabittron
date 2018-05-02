import {browser, element, by, promise} from 'protractor';
import {Key} from 'selenium-webdriver';

export class ResourcePage {

    navigateTo(): promise.Promise<any> {
        return browser.get('/resources');
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

    getPhoneNumbersTitle() {
        const title = element(by.className('numbers')).getText();
        this.highlightElement(by.className('numbers'));
        return title;
    }

    getVideosTitle() {
        const title = element(by.className('videos')).getText();
        this.highlightElement(by.className('videos'));
        return title;
    }

    addLinkButtonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('addNewLink'));
        return element(by.id('addNewLink')).isPresent();
    }

    addContactButtonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('addNewContact'));
        return element(by.id('addNewContact')).isPresent();
    }

    getUniqueLink(anID: string) {
        const link = element(by.id(anID)).getText();
        this.highlightElement(by.id(anID));

        return link;
    }

    getUniqueContact(anID: string) {
        const contact = element(by.id(anID)).getText();
        this.highlightElement(by.id(anID));

        return contact;
    }

}
