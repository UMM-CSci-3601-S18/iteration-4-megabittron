import {SettingsPage} from './settings.po';

describe('Settings', () => {
    let page: SettingsPage;

    beforeEach(() => {
        page = new SettingsPage();
    });

    it('Should click on the arial button ', () => {
        page.navigateTo();
        page.getFont('arial');
    }) ;

    it('Should click on the verdana button ', () => {
        page.navigateTo();
        page.getFont('verdana');
    });

    it('Should click on the times-new-roman button ', () => {
        page.navigateTo();
        page.getFont('times-new-roman');
    });

    it('Should click on the comic-sans button ', () => {
        page.navigateTo();
        page.getFont('comic-sans');
    });

    it('Should click on the panda button ', () => {
        page.navigateTo();
        page.getStyle('panda');
    });

    it('Should click on the dark button ', () => {
        page.navigateTo();
        page.getStyle('dark');
    });

    it('Should click on the neutral button ', () => {
        page.navigateTo();
        page.getStyle('neutral');
    });

    it('Should click on the windows95 button ', () => {
        page.navigateTo();
        page.getStyle('windows95');
    });

    it('Should click on the leaf button ', () => {
        page.navigateTo();
        page.getStyle('leaf');
    });

    it('Should click on the sunflower button ', () => {
        page.navigateTo();
        page.getStyle('sunflower');
    });


});
