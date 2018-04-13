import {GoalPage} from './goals.po';
import {browser, protractor, element, by} from 'protractor';

/*const origFn = browser.driver.controlFlow().execute;

browser.driver.controlFlow().execute = function () {
    let args = arguments;
    // queue 100ms wait between test
    // This delay is only put here so that you can watch the browser do its thing.
    origFn.call(browser.driver.controlFlow(), function () {
       return protractor.promise.delayed(100);
    });
    return origFn.apply(browser.driver.controlFlow(), args);
 };*/

describe('Goal list', () => {
    let page: GoalPage;

    beforeEach(() => {
        page = new GoalPage();
    });

    it('Should get and highlight Goals title attribute ', () => {
        page.navigateTo();
        expect(page.getGoalManageTitle()).toEqual('Your Goals');
    });

    it('Should check that goal with name: \'Visit sister\' matches unique id', () => {
        page.navigateTo();
        expect(page.getUniqueGoal('5ab53a898e1620e3d7e48796')).toContain('Visit sister');
    });

    it('Total number of goals should be 5', () => {
        page.navigateTo();
        expect(page.getGoals()).toEqual(5);
    });

    it('Should check that goal with purpose: \'Text a hotline\' matches unique id', () => {
        page.navigateTo();
        expect(page.getUniqueGoal('5ab53a89cc803f25455d4523')).toContain('Text a hotline');
    });

    it('Should check that goal with status: \'Incomplete\' matches unique id', () => {
        page.navigateTo();
        expect(page.getUniqueGoal('5ab53a89dd3b308feb0e14c3')).toContain('Incomplete');
    });

    it('Should switch between pages', () => {
        page.navigateTo();
        element(by.className('nextPage')).click();
        expect(page.getGoals()).toEqual(3);
    });

    it('Should switch between pages', () => {
        page.navigateTo();
        element(by.className('previousPage')).click();
        expect(page.getGoals()).toEqual(5);
    });

    it('Should switch between todays goals and all goals', () =>{
        page.navigateTo();
        element(by.id('desktopShowAllGoals')).click();
        expect(page.getGoals()).toEqual(5);
    });

    it('Should have an add goal button', () => {
        page.navigateTo();
        expect(page.buttonExists()).toBeTruthy();
    });

    it('Should open a dialog box when add goal button is clicked', () => {
        page.navigateTo();
        expect(element(by.className('add-goal')).isPresent()).toBeFalsy('There should not be a modal window yet');
        element(by.className('goal-button')).click();
        expect(element(by.className('add-goal')).isPresent()).toBeTruthy('There should be a modal window now');
    });

 /*   // This test has timing issues. Slow down to run properly.
    it('Should actually add the goal with the information we put in the fields', () => {
        page.navigateTo();
        page.clickAddGoalButton();
        element(by.id('nameField')).sendKeys('Clean up computer lab');
        page.pickChoresOption();
        element(by.id('purposeField')).sendKeys('Get more people to come');
        page.actuallyAddGoal();
    });*/

   /* it('Should click check button to change goal to complete', () => {
        page.navigateTo();
        expect(page.getUniqueGoal('5ab53a89ea32d59c4e81d5f0')).toContain('Status: Incomplete');
        expect(element(by.id('completeGoal')).isPresent()).toBeTruthy('There should be a \'complete goal\' green check button');
        element(by.id('completeGoal')).click();
    });*/

});
