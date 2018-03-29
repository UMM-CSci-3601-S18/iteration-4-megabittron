import {browser, element, by, promise} from 'protractor';
import {Key} from 'selenium-webdriver';



export class HomePage {

    private selectedEmoji = "happy";

    static navigateTo(): promise.Promise<any> {
        return browser.get('/home');
    }

    highlightElement(byObject) {
        function setStyle(element, style) {
            const previous = element.getAttribute('style');
            element.setAttribute('style', style);
            setTimeout(() => {
                element.setAttribute('style', previous);
            }, 200);
            return 'highlighted';
        }

        return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
    }

    selectEmotion(ID){
        var clickedSize = "12%";
        this.resetSelections();
        this.selectedEmoji = ID;
        {document.getElementById(ID).style.height = clickedSize}
        {document.getElementById(ID).style.width = clickedSize}
    };

    private resetSelections(){
        var baseSize = "10%";

        {document.getElementById(this.selectedEmoji).style.height = baseSize}
        {document.getElementById(this.selectedEmoji).style.width = baseSize}

    };


}

