# Known Issues

### General Issues
* The name of the user sometimes either shows up as ‘null null’ or doesn’t show up at all. This only happens once in a while and when the naming does break, the following message shows up in the console: ‘ERROR ReferenceError: gapi is not defined’. Our best guess is that this has something to do with the Google API. 
* User has to double click on the ‘sign out’ button to sign out.
### Home Page
* Clicking the ‘restart’ button causes the stepper to try to go to the next step, then the page refreshes.
* Pencil icons on the stepper do not allow you to edit, making it misleading
### Goals Page
* Editing a goal makes the goal not appear on the ‘Today’s Goals’ list, even if the goal has a daily frequency and should show up.
### Stats Page
* The table doesn’t sort by newest first. Also, in development mode the seed data doesn’t get sorted correctly.
* On mobile view, not having any data causes the graph to show really small and stays that way after adding data until you click on another tab and come back or change filtering of graph.
### Journals Page
* The user isn’t able to click the bottom half of the card for some reason. In order to be able to click the card to go to the next page, the user needs to click directly on the text.
* The text entered in a journal is not centered on the card.
### Resources Page
* On the ‘add video link’, users can enter links that do not actually go anywhere.
  * Entering a nonexistent link and clicking on it leads to the homepage for the ‘MyPanda’ website that does not contain anything.
* Users can enter phone numbers that do not exist and will be able to attempt to call it.
* Dashes count as characters in ‘new contact’, not allowing for you to have dashes separating numbers.
### Settings Page
* Clicking on a font changes the font of the previous available font types. The only way to actually see the style of the font described on the page would be to actually click on the font name. 
* Changing the theming does not change the color on all cards. Some cards remain white while others change color. (effects bottoms of cards with only small amounts of text. Needed class tag is missing from some part of the mat-card)

# To-Do
### General
* Make the ‘MyPanda’ logo a bit easier to see and figure out a way for users to know that it goes to the homepage.
### Home Page
* Random video embedding instead of a playlist.
* Intensity slider at ‘1’ should not be grey.
### Goals Page
* Deleting a goal does not ask for confirmation.
### Journals Page
* Deleting a journal entry does not ask for confirmation.
* Moving journal prompt to the card where users would be journaling about said prompt.
* Include the prompt the user responded to in the text of the journal being viewed.
### Resources Page
* Better design. There is too much open space on the right side of the page.
* Make videos link to homepage response selection.
### Stats Page
* Moving all the buttons on the ’graph view’ to a collapsible side nav.
* Make the toggle status of ‘colorblind mode’ persist.
* Moving all filtering buttons on the ‘table view’ to the a side nav.
* Remove the second scroll bar from the ‘Your Emotions’ card.
### Settings Page
* Add more fonts.
* Add more themes.
* Change ‘BG’ theme to ‘Background’ theme
