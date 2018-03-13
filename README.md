# WWU Dining Tracker
https://wwuhungry.xyz

This website tracks and displays the dining locations on the WWU campus that are currently open, as well as those opening within the next 2 hours.

This program does not accomodate for unusual closures; it is to be assumed all locations are operating on a normal schedule.

To test the behavior of this program on a certain time and day, append the mode parameter to the URL, set to "debug", as follows:
```
https://wwuhungry.xyz/?mode=debug
```
Specify the time in 24 hour format, without a colon, and capitalize the weekday. For example, to debug Monday at 2:30 PM, you would input ``` Monday ``` for the weekday and ``` 1430 ``` for the time.
