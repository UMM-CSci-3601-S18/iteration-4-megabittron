# MyPanda

An emotion tracking web application which can be used by health practioners and their consumers.
Provides ability for consumers to quickly log data about emotion and mood, and provides convenient, helpful links.

[![Build Status](https://travis-ci.org/UMM-CSci-3601-S18/iteration-4-megabittron.svg?branch=master)](https://travis-ci.org/UMM-CSci-3601-S18/iteration-4-megabittron)

An example of a live build can be found at https://mypanda.website/ 

<!-- TOC depthFrom:1 depthTo:5 withLinks:1 updateOnSave:1 orderedList:0 -->
## Table of Contents
- [What is MyPanda](#what-is-MyPanda)
- [Getting Started](#getting-started)
- [Authors](#authors)

<!-- /TOC -->

## What is MyPanda

[MyPanda](https://mypanda.website) is an web-app that promotes mental health. This is achieved through providing the capability to record emotions, set goals, and write journals. These allow for quick and convienient ways to reflect on past trends and promote personal growth. Furthermore, MyPanda provides resources for managing stress, anxiety, anger, and much more!

## Getting Started

To start, you'll need a Google account to log-in. You can find the **sign in** button in the top right on a desktop view, or in the side menu on a mobile view. Once you're signed in, you'll have access to the rest of the site.

## Home Page

The home page houses the main feature of the web-app - emotion recording. You have the choice of 5 different emotions (Happy, Sad, Meh, Angry, Anxious). After selecting your current emotion and clicking the **next** button, there may be the option to select your emotional intensity (on a scale of 1-5). This option will only occur if you haven't selected "Meh" as your emotion. After clicking the **next** button again, you will be given the option to describe why you feel the way you do, with the prompt "I'm feeling this way because..." However, this portion is optional. The final step is clicking the **submit** button, which will log your emotion, and send you to a Youtube video playlist created to provide useful resources for each emotion.

At any point in this process, if you want to start over, you can click the **Restart** button, to remove your progress, and return to the first step.

## Goals Page

The goals page has two distinct views depending on if one is using a desktop or mobile device. 

The desktop view contains a sidebar with a **New Goal** button, a toggle to switch between showing today's goals and all goals. If **Show all goals** is selected, three options to filter the goals appear (All, Complete, and Incomplete). The right side of the screen is reserved for goals, which are viewed as cards.

The mobile view contains a navbar, a toggle to show all goals, and filtering options if **Show all goals** is toggled at the top of the screen. In the bottom right corner, there is a button to add a new goal, indicated by a plus sign. The center of the screen is reserved for listing goals.

### Creating a goal

To create a goal, click the aforementioned **New Goal** button. When creating a goal, it requires the text of the goal, a category, and a frequency. Optionally, you can also include text describing the purpose of the goal and an end date. 

### Using your goal

A goal begins as incomplete, and 

# Authors
- **Abenezer Monjor**
- **Ahnaf Prio**
- **Charles Menne**
- **Dustin Blake** 
- **Francisco Montanez** 
- **John Hoff** 
- **Travis Warling**
- **Xaitheng Yang**

[angular-karma-jasmine]: https://codecraft.tv/courses/angular/unit-testing/jasmine-and-karma/
[e2e-testing]: https://coryrylan.com/blog/introduction-to-e2e-testing-with-the-angular-cli-and-protractor
[environments]: http://tattoocoder.com/angular-cli-using-the-environment-option/
[spark-documentation]: http://sparkjava.com/documentation.html
[status-codes]: https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
[lab2]: https://github.com/UMM-CSci-3601/3601-lab2_client-server/blob/master/README.md#resources
[mongo-jdbc]: https://docs.mongodb.com/ecosystem/drivers/java/
[labtasks]: LABTASKS.md
[travis]: https://travis-ci.org/
