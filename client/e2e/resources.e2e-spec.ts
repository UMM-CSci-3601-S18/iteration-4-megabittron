import {ResourcePage} from './resources.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

describe('Resources', () => {
    let page: ResourcePage;

    beforeEach(() => {
        page = new ResourcePage();
    });

    it('Should get and highlight phone numbers title attribute ', () => {
        page.navigateTo();
        expect(page.getPhoneNumbersTitle()).toEqual('Phone Numbers');
    });

    it('Should get and highlight videos title attribute ', () => {
        page.navigateTo();
        expect(page.getVideosTitle()).toEqual('Videos');
    });

    it('Should get and highlight links title attribute ', () => {
        page.navigateTo();
        expect(page.getLinksTitle()).toEqual('Links');
    });

});
