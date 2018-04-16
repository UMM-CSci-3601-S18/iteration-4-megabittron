import {browser, element, by, promise} from 'protractor';
import {Key} from 'selenium-webdriver';

export class HomePage {

    static navigateTo(): promise.Promise<any> {
        return browser.get('/');
    };

    typeText(body: string) {
        const input = element(by.id('textFormFieldBox'));
        input.click();
        input.sendKeys(body);
    };

    selectRightKey() {
        browser.actions().sendKeys(Key.ARROW_RIGHT).perform();
    };

    repeatRightArrowKey(counter: number) {
        while (counter > 0) {
            this.selectRightKey();
            counter--;
        }
    };

}
