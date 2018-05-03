import {browser, element, by, promise} from 'protractor';
import {Key} from 'selenium-webdriver';

export class SettingsPage {

    navigateTo(): promise.Promise<any> {
        return browser.get('/settings');
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

    getFont(font: string) {
        this.highlightElement(by.className(font));
        element(by.className(font)).click();
    }

    getStyle(style: string) {
        this.highlightElement(by.className(style));
        element(by.className(style)).click();
    }

}
