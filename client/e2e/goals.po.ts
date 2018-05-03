import {browser, element, by, promise, ElementFinder} from 'protractor';
import {Key} from 'selenium-webdriver';

export class GoalPage {

    navigateTo(): promise.Promise<any> {
        return browser.get('/goals');
    }

    highlightElement(byObject) {
        function setStyle(element, style) {
            const previous = element.getAttribute('style');
            element.setAttribute('style', style);
            setTimeout(() => {
                element.setAttribute('style', previous);
            }, 100);
            return 'highlighted';
        }

        return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
    }

    getGoalTitle() {
        const title = element(by.className('page-title')).getText();
        this.highlightElement(by.className('page-title'));

        return title;
    }

    getStatusText() {
        const title = element(by.className('no-filters')).getText();
        this.highlightElement(by.className('no-filters'));

        return title;
    }

    getUniqueGoal(anID: string) {
        const goal = element(by.id(anID)).getText();
        this.highlightElement(by.id(anID));

        return goal;
    }

    addButtonExists(): promise.Promise<boolean> {
        this.highlightElement(by.className('new-object-button'));
        return element(by.className('new-object-button')).isPresent();
    }

    editButtonExists(): promise.Promise<boolean>{
        this.highlightElement(by.className('edit'));
        return element(by.className('edit')).isPresent();
    }

    deleteButtonExists(): promise.Promise<boolean>{
        this.highlightElement(by.className('delete'));
        return element(by.className('delete')).isPresent();
    }

    showAllGoalsButtonExists(): promise.Promise<boolean>{
        this.highlightElement(by.className('show-all-goals'));
        return element(by.className('show-all-goals')).isPresent();
    }

    statusButtonsExists(): promise.Promise<boolean>{
        this.highlightElement(by.id('allStatus'));
        this.highlightElement(by.id('complete'));
        this.highlightElement(by.id('incomplete'));
        return (element(by.id('allStatus')).isPresent()
            && element(by.id('complete')).isPresent()
            && element(by.id('incomplete')).isPresent());
    }

    clickAddGoalButton(): promise.Promise<void> {
        this.highlightElement(by.className('new-object-button'));
        return element(by.className('new-object-button')).click();
    }

    clickShowAllGoalsButton(): promise.Promise<void> {
        this.highlightElement(by.className('show-all-goals'));
        return element(by.className('show-all-goals')).click();
    }

    clickAllButton(): promise.Promise<void> {
        this.highlightElement(by.id('allStatus'));
        return element(by.id('allStatus')).click();
    }

    clickCompleteButton(): promise.Promise<void> {
        this.highlightElement(by.id('complete'));
        return element(by.id('complete')).click();
    }

    clickIncompleteButton(): promise.Promise<void> {
        this.highlightElement(by.id('incomplete'));
        return element(by.id('incomplete')).click();
    }

    clickCheckButton(): promise.Promise<void> {
        this.highlightElement(by.className('check'));
        return element(by.className('check')).click();
    }

    pickTopFrequency(){
        const input = element(by.className('frequency-list'));
        input.click();
        element(by.className('daily')).click();
    }

    pickTopCategory(){
        const input = element(by.className('category-list'));
        input.click();
        element(by.className('business-career')).click();

    }

}
