import {SettingsPage} from './settings.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

fdescribe('Settings', () => {
    let page: SettingsPage;

    beforeEach(() => {
        page = new SettingsPage();
    });

    it('Should cilck on the arial button ', () => {
        page.navigateTo();
        page.getFont('arial');
    });

    it('Should cilck on the verdana button ', () => {
        page.navigateTo();
        page.getFont('verdana');
    });

    it('Should cilck on the times-new-roman button ', () => {
        page.navigateTo();
        page.getFont('times-new-roman');
    });

    it('Should cilck on the comic-sans button ', () => {
        page.navigateTo();
        page.getFont('comic-sans');
    });

    it('Should cilck on the panda button ', () => {
        page.navigateTo();
        page.getStyle('panda');
    });

    it('Should cilck on the dark button ', () => {
        page.navigateTo();
        page.getStyle('dark');
    });

    it('Should cilck on the high-contrast button ', () => {
        page.navigateTo();
        page.getStyle('high-contrast');
    });

    it('Should cilck on the windows95 button ', () => {
        page.navigateTo();
        page.getStyle('windows95');
    });

    it('Should cilck on the christmas2018 button ', () => {
        page.navigateTo();
        page.getStyle('christmas2018');
    });

    it('Should cilck on the aesthetic button ', () => {
        page.navigateTo();
        page.getStyle('aesthetic');
    });




    /* it('Should get and highlight videos title attribute ', () => {
         page.navigateTo();
         expect(page.getVideosTitle()).toEqual('Videos');
     });

     it('Should get and highlight links title attribute ', () => {
         page.navigateTo();
         expect(page.getLinksTitle()).toEqual('Links');
     });*/

});
