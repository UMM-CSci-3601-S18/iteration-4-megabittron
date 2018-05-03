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

    it('Should have a new goal button', () => {
        page.navigateTo();
        expect(page.addButtonExists()).toBeTruthy();
    });

    it('Should have a show all goals button', () => {
        page.navigateTo();
        expect(page.showAllGoalsButtonExists()).toBeTruthy();
    });

    it('Should have a edit goal button', () => {
        page.navigateTo();
        expect(page.editButtonExists()).toBeTruthy();
    });

    it('Should have a delete goal button', () => {
        page.navigateTo();
        expect(page.deleteButtonExists()).toBeTruthy();
    });

    it('Should not have status buttons', () => {
        page.navigateTo();
        expect(page.getStatusText()).toBe('You cannot filter statuses of today\'s goals.');
    });

    it('Should click show all goals button and should have status buttons', () => {
        page.navigateTo();
        page.clickShowAllGoalsButton();
        expect(page.statusButtonsExists()).toBeTruthy();
    });

    it('Should get and highlight Todays Goals title', () => {
        page.navigateTo();
        expect(page.getGoalTitle()).toEqual('Today\'s Goals');
    });

    it('Should click Show all goals button highlight All Goals title', () => {
        page.navigateTo();
        expect(page.getGoalTitle()).toEqual('Today\'s Goals');
        page.clickShowAllGoalsButton();
        expect(page.getGoalTitle()).toEqual('All Goals');
    });

    it('Should check that goal with name: \'Clean my room\' matches unique id', () => {
        page.navigateTo();
        expect(page.getUniqueGoal('5ae6846708f9cf57e7bf4478')).toContain('Marilyn Decker');
    });

    it('Should open a dialog box when add goal button is clicked', () => {
        page.navigateTo();
        expect(element(by.className('new-object-title')).isPresent()).toBeFalsy('There should not be a modal window yet');
        page.clickAddGoalButton();
        expect(element(by.className('new-object-title')).isPresent()).toBeTruthy('There should be a modal window now');
    });

    it('Should open add goal dialog box and add a goal', () => {
        page.navigateTo();
        expect(element(by.className('new-object-title')).isPresent()).toBeFalsy('There should not be a modal window yet');
        page.clickAddGoalButton();
        expect(element(by.className('new-object-title')).isPresent()).toBeTruthy('There should be a modal window now');
        element(by.className('nameField')).sendKeys('Sad day');
        page.pickTopCategory();
        page.pickTopFrequency()
        element(by.className('purposeField')).sendKeys('IDK');
        element(by.className('submit')).click();
    });



    it('Should open a dialog box when edit goal button is clicked', () =>{
        page.navigateTo();
        expect(element(by.className('new-object-title')).isPresent()).toBeFalsy('There should not be a modal window yet');
        element(by.className('edit')).click();
        expect(element(by.className('new-object-title')).isPresent()).toBeTruthy('There should be a modal window now');
    });

    it('Should click all status buttons', () => {
        page.navigateTo();
        page.clickShowAllGoalsButton();
        page.clickAllButton();
        page.clickCompleteButton();
        page.clickIncompleteButton();
    });

    it('Should click done button', () => {
        page.navigateTo();
        page.clickCheckButton();
    });

});
