import {browser, element, by, promise} from 'protractor';
import {Key} from 'selenium-webdriver';

export class SummaryPage {
    static navigateTo(): promise.Promise<any> {
        return browser.get('/summary');
    }

    highlightElement(byObject) {
        function setStyle(element, style) {
            const previous = element.getAttribute('style');
            element.setAttribute('style', style);
            setTimeout(() => {
                element.setAttribute('style', previous);
            }, 200);
            return 'highlighted';
        }

        return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
    }

    selectMoodDropdown(): promise.Promise<boolean> {
        this.highlightElement(by.className('summaryMood'));
        return element(by.className('summaryMood')).isPresent();
    }

    clickMoodDropdown(): promise.Promise<void> {
        this.highlightElement(by.className('summaryMood'));
        return element(by.className('summaryMood')).click();
    }

    selectIntensityDropdown(): promise.Promise<boolean> {
        this.highlightElement(by.className('summaryInt'));
        return element(by.className('summaryInt')).isPresent();
    }

    clickIntensityDropdown(): promise.Promise<void> {
        this.highlightElement(by.className('summaryInt'));
        return element(by.className('summaryInt')).click();
    }

    selectStartDate(): promise.Promise<boolean> {
        this.highlightElement(by.className('startDate'));
        return element(by.className('startDate')).isPresent();
    }

    clickStartDate(): promise.Promise<void> {
        this.highlightElement(by.className('startDate'));
        return element(by.className('startDate')).click();
    }

    selectEndDate(): promise.Promise<boolean> {
        this.highlightElement(by.className('endDate'));
        return element(by.className('endDate')).isPresent();
    }

    clickEndDate(): promise.Promise<void> {
        this.highlightElement(by.className('endDate'));
        return element(by.className('endDate')).click();
    }

    selectTimeDropdown(): promise.Promise<boolean> {
        this.highlightElement(by.className('labelType'));
        return element(by.className('labelType')).isPresent();
    }

    clickTimeDropdown(): promise.Promise<void> {
        this.highlightElement(by.className('labelType'));
        return element(by.className('labelType')).click();
    }

    delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }


}
