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

    getLinksTitle() {
        const title = element(by.className('links')).getText();
        this.highlightElement(by.className('links'));
        return title;
    }

}
