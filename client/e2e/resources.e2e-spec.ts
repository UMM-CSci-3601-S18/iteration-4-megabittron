import {ResourcePage} from './resources.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

fdescribe('Resources', () => {
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

    it('Should have an add link button', () => {
        page.navigateTo();
        expect(page.addLinkButtonExists()).toBeTruthy();
    });

    it('Should have an add contact button', () => {
        page.navigateTo();
        expect(page.addContactButtonExists()).toBeTruthy();
    });

    it('Should check that the video links contain a specific element', () => {
        page.navigateTo();
        expect(page.getUniqueLink('5ae9332370f3189a4cfeaec3')).toContain('Assistia');
    });

    it('Should check that the contacts contain a specific element', () => {
        page.navigateTo();
        expect(page.getUniqueContact('5ae930074a2a0fe20cd3f645')).toContain('Shauna Mcfarland');
    });

});
