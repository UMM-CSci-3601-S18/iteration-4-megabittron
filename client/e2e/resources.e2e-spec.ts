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

    it('Should add a youtube video link with information we put in the fields', () => {
        page.navigateTo();
        page.clickAddLinkButton();
        element(by.id('titleField')).sendKeys('Peter Gives it');
        element(by.id('urlField')).sendKeys('https://www.youtube.com/watch?v=n7zYgtcfrKk');
        element(by.id('confirmAddLinkButton')).click();
    });

    it('Should add a contact with information we put in the fields', () => {
        page.navigateTo();
        page.clickAddContactButton();
        element(by.id('nameField')).sendKeys('Paul F.');
        element(by.id('phoneField')).sendKeys('555-555-5555');
        element(by.id('confirmAddContactButton')).click();
    });

    it('Should delete the first youtube video link', () => {
        page.navigateTo();
        expect(page.getUniqueContact('5ae933236db5b7b8f9b82709')).toContain('Podunk');
        page.clickDeleteLinkButton();
    });

    it('Should delete the first contact', () => {
        page.navigateTo();
        expect(page.getUniqueContact('5ae93007908ad31fbb4129a4')).toContain('Avery Lewis');
        page.clickDeleteContactButton();
    });

});
