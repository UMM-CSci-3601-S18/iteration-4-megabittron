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

    it('Should check that goal with name: \'Clean my room\' matches unique id', () => {
        page.navigateTo();
        expect(page.getUniqueGoal('5ab53a8944a44f6ec5e15853')).toContain('Clean my room');
    });

    it('Total number of goals should be 3', () => {
        page.navigateTo();
        expect(page.getGoals()).toEqual(3);
    });

    it('Should check that goal with purpose: \'Wash the dishes\' matches unique id', () => {
        page.navigateTo();
        expect(page.getUniqueGoal('5ab53a89dd3b308feb0e14c3')).toContain('Wash the dishes');
    });

    it('Should check that goal with status: \'Incomplete\' matches unique id', () => {
        page.navigateTo();
        expect(page.getUniqueGoal('5ab53a89dd3b308feb0e14c3')).toContain('Incomplete');
    });


    it('Should switch between todays goals and all goals', () =>{
        page.navigateTo();
        element(by.className('show-all-goals')).click();
        expect(page.getGoals()).toEqual(6);
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

    it('Should have an edit goal button', () =>{
        page.navigateTo();
        expect(page.buttonExists()).toBeTruthy();
    });

    it('Should open a dialog box when edit goal button is clicked', () =>{
        page.navigateTo();
        expect(element(by.className('edit-goal')).isPresent()).toBeFalsy('There should not be a modal window yet');
        element(by.className('edit-goal-button')).click();
        expect(element(by.className('edit-goal')).isPresent()).toBeTruthy('There should be a modal window now');
    })

});
