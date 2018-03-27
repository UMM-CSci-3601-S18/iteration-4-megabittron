import {HomePage} from './home.po';

import {browser} from "protractor";


const origFn = browser.driver.controlFlow().execute;

describe('Emoji Selector', () => {
    let page: HomePage;

    beforeEach(() => {
        page = new HomePage();

        it('should select an emoji display the correct value', () => {
            HomePage.navigateTo();
            page.selectAnEmoji('happy');
            expect(page.getCurrentInput()).toContain('value: happy');
        })

    });

})

