var shortTime;
var wkday;
var output;
var opennow = [];
var comingup = [];
window.onload = function() {
	windowOnload();
}
function windowOnload() {
	opennow = [];
	comingup = [];
	
	var timeDisplay = document.getElementById("timeDisplay");
	timeDisplay.innerHTML = calcTime('Bellingham', '+8');

	document.getElementById("output").innerHTML = "<h3><u>Open Locations</u></h3><br /><img id='loader' src='spinner.gif' />";
	document.getElementById("output2").innerHTML = "<h3><u>Coming up</u></h3><br /><img id='loader2' src='spinner.gif' />";

	setTimeout(function() {
		document.getElementById("loader").style.display = "none";
		document.getElementById("loader2").style.display = "none";
		findOpen(wkday);
	
		if (opennow.length < 1) {
			document.getElementById("output").innerHTML += "<p><i>Nothing right now</i></p>";
		}
	
		if (comingup.length < 1) {
			document.getElementById("output2").innerHTML += "<p><i>Nothing in the next 2 hours</i></p>";
		}
	}, 1500);	
	
}

function pad(num) {
	var s = num+"";
	while (s.length < 2) s = "0" + s;
	return s;
}
function fourpad(num) {
	var s = num+"";
	if (s.length == 3) s = "0" + s;
	return s;
}

function toTwelveHr(hr) {
	if (hr > 12) {
		return hr - 12;
	} 
	else if (hr === 0) {
	   return 12;
	}
	else return hr;
}

function AMPM(hr) {
	if (hr <= 11 || hr == 24)
		return "AM";
	else {
		return "PM";
	}
}

function calcTime(city, offset) {
    // create Date object for current location
    var d = new Date();

    // convert to msec
    // subtract local time zone offset
    // get UTC time in msec
    var utc = d.getTime() - (d.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
    var nd = new Date(utc + (3600000*offset));


	fullHour = pad(nd.getHours());

	var dayWeek = [[0, "Sunday"], [1, "Monday"], [2, "Tuesday"], [3, "Wednesday"], [4, "Thursday"], [5, "Friday"], [6, "Saturday"]];

	shortTime = Number(fullHour.toString() + pad(nd.getMinutes()).toString());

	wkday = dayWeek[nd.getDay()][1];
	
    // return time as a string
    return "WWU Dining locations open as of " + wkday + ", " +  toTwelveHr(nd.getHours()) + ":" + pad(nd.getMinutes()) + " " + AMPM(fullHour);
}

function findOpen(weekday) {

	var locations = [];
	var residential = [];
	

	if (weekday == "Monday" || weekday == "Tuesday" || weekday == "Wednesday" || weekday == "Thursday") {
		locations = [["Ridgeway Commons (Breakfast)", 700, 1100], ["Ridgeway Commons (Lunch)", 1100, 1330], ["Ridgeway Commons (Lite Lunch)", 1330, 1700], 
							["Ridgeway Commons (Dinner)", 1700, 1900], ["Ridgeway Commons (Late Night)", 2130, 2300],
						
						["Viking Commons (Breakfast)", 700, 1100], ["Viking Commons (Lunch)", 1100, 1330], ["Viking Commons (Lite Lunch)", 1330, 1700], 
							["Viking Commons (Dinner)", 1700, 1900], ["Viking Commons (Late Night)", 2100, 2230],
						
						["Fairhaven Commons (Breakfast)", 700, 1100], ["Fairhaven Commons (Lunch)", 1100, 1330], ["Fairhaven Commons (Lite Lunch)", 1330, 1700], 
							["Fairhaven Commons (Dinner)", 1700, 1900], ["Fairhaven Commons (Late Night)", 2130, 2300],
		

					["POD Market @ The Atrium", 730, 1800], ["Starbucks @ The Atrium", 730, 1800], ["Subway @ The Atrium", 730, 1700], ["Topio's @ The Atrium", 1030, 1700], ["BT Station", 1100, 2300], 
					["Miller Market", 730, 1800], ["Rock's Edge Cafe", 730, 2000], ["The Haven", 1000, 2300], ["Underground Coffeehouse", 900, 2200], ["VU Cafe", 730, 1900], 
					["VU Market", 730, 1900], ["Panda Express @ VU", 1030, 1900], ["Subway @ VU", 730, 1900], ["Zoe's Bookside Bagels", 730, 2300]]; 
	}

	else if (weekday == "Friday") {
		locations = [["Ridgeway Commons (Breakfast)", 700, 1100], ["Ridgeway Commons (Lunch)", 1100, 1330], ["Ridgeway Commons (Lite Lunch)", 1330, 1700], 
							["Ridgeway Commons (Dinner)", 1700, 1830], ["Ridgeway Commons (Late Night)", 2030, 2200],
						
						["Viking Commons (Breakfast)", 700, 1100], ["Viking Commons (Lunch)", 1100, 1330], ["Viking Commons (Lite Lunch)", 1330, 1700], 
							["Viking Commons (Dinner)", 1700, 1900], ["Viking Commons (Late Night)", 2030, 2200],
						
						["Fairhaven Commons (Breakfast)", 700, 1100], ["Fairhaven Commons (Lunch)", 1100, 1330], ["Fairhaven Commons (Lite Lunch)", 1330, 1700], 
							["Fairhaven Commons (Dinner)", 1700, 1830], ["Fairhaven Commons (Late Night)", 2030, 2200],

					["VU Cafe", 730, 1900], ["VU Market", 730, 1900], ["Subway @ VU", 730, 1900], ["Panda Express @ VU", 1030, 1900], ["Underground Coffeehouse", 900, 2000], 
					["Miller Market", 730, 1700], ["Zoe's Bookside Bagels", 730, 1700], ["Rock's Edge Cafe", 730, 1700],["POD Market @ The Atrium", 730, 1630], 
					["Starbucks @ The Atrium", 730, 1650], ["Topio's @ The Atrium", 1030, 1430], ["Subway @ The Atrium", 730, 1430], ["BT Station", 1100, 1700], ["The Haven", 1000, 1700]];	
	}

	else if (weekday == "Saturday") {
		locations = [["Ridgeway Commons (Breakfast)", -1, -1], ["Ridgeway Commons (Brunch)", 1000, 1330], ["Ridgeway Commons (Lite Lunch)", -1, -1], 
							["Ridgeway Commons (Dinner)", 1700, 1830], ["Ridgeway Commons (Late Night)", 2030, 2200],
						
						["Viking Commons (Breakfast)", -1, -1], ["Viking Commons (Brunch)", 1000, 1330], ["Viking Commons (Lite Lunch)", -1, -1], 
							["Viking Commons (Dinner)", 1700, 1830], ["Viking Commons (Late Night)", 2030, 2200],
						
						["Fairhaven Commons (Breakfast)", -1, -1], ["Fairhaven Commons (Brunch)", 1000, 1330], ["Fairhaven Commons (Lite Lunch)", -1, -1], 
							["Fairhaven Commons (Dinner)", 1700, 1830], ["Fairhaven Commons (Late Night)", 2030, 2200],

					["VU Cafe", 900, 1300], ["VU Market", 1100, 1900], ["Subway @ VU", 1100, 1900], ["Panda Express @ VU", -1, -1], ["Underground Coffeehouse", -1, -1], 
					["Miller Market", -1, -1], ["Zoe's Bookside Bagels", 1100, 1700], ["Rock's Edge Cafe", -1, -1],["POD Market @ The Atrium", -1, -1], 
					["Starbucks @ The Atrium", -1, -1], ["Topio's @ The Atrium", -1, -1], ["Subway @ The Atrium", -1, -1], ["BT Station", -1, -1], ["The Haven", 1400, 2000]];				
	}

	else if (weekday == "Sunday") {
		locations = [["Ridgeway Commons (Breakfast)", -1, -1], ["Ridgeway Commons (Brunch)", 1000, 1330], ["Ridgeway Commons (Lite Lunch)", -1, -1], 
							["Ridgeway Commons (Dinner)", 1700, 1830], ["Ridgeway Commons (Late Night)", 2130, 2300],
						
						["Viking Commons (Breakfast)", -1, -1], ["Viking Commons (Brunch)", 1000, 1330], ["Viking Commons (Lite Lunch)", -1, -1], 
							["Viking Commons (Dinner)", 1700, 1830], ["Viking Commons (Late Night)", 2100, 2230],
						
						["Fairhaven Commons (Breakfast)", -1, -1], ["Fairhaven Commons (Brunch)", 1000, 1330], ["Fairhaven Commons (Lite Lunch)", -1, -1], 
							["Fairhaven Commons (Dinner)", 1700, 1830], ["Fairhaven Commons (Late Night)", 2130, 2300],

					["VU Café", -1, -1], ["VU Market", 1100, 1900], ["Subway @ VU", 1100, 1900], ["Panda Express @ VU", -1, -1], ["Underground Coffeehouse", -1, -1], 
					["Miller Market", -1, -1], ["Zoe's Bookside Bagels", 1200, 2300], ["Rock's Edge Café", -1, -1],["POD Market @ The Atrium", -1, -1], 
					["Starbucks @ The Atrium", -1, -1], ["Topio's @ The Atrium", -1, -1], ["Subway @ The Atrium", -1, -1], ["BT Station", -1, -1], ["The Haven", 1800, 2300]];			
	}
	printOpen(locations);
	
}


function addTime(current, min) {
	var firstTwo = Number(fourpad(current.toString()).split("")[0] + fourpad(current.toString()).split("")[1]);
	var lastTwo = Number(fourpad(current.toString()).split("")[2] + fourpad(current.toString()).split("")[3]);
	
	var d = new Date("Sun Jan 1 2000 " + firstTwo + ":" + lastTwo + ":00");
		
	d.setMinutes(d.getMinutes() + min);
		
	return Number((d.getHours().toString()) + (pad(d.getMinutes()).toString()));
}

function convertToTime(value) {
	var firstTwo = Number(fourpad(value.toString()).split("")[0] + fourpad(value.toString()).split("")[1]);
	var lastTwo = Number(fourpad(value.toString()).split("")[2] + fourpad(value.toString()).split("")[3]);
	
	var d = new Date("Sun Jan 1 2000 " + firstTwo + ":" + lastTwo + ":00");

	return (toTwelveHr(d.getHours())).toString() + ":" + pad(lastTwo.toString()) + " " + AMPM(firstTwo);
}


function printOpen(list) { 
	for (var i = 0; i < list.length; i++) {		
		if (shortTime >= list[i][1] && shortTime < list[i][2]) {
			opennow.push(["<p>" + list[i][0] + "<span>Closes at " + convertToTime(list[i][2]) + "</span></p>", [list[i][2]]]);
		}

		else if (shortTime < list[i][1] && addTime(shortTime, 120) > list[i][1]) {
			comingup.push(["<p>" + list[i][0] + "<span>Opens at " + convertToTime(list[i][1]) + "</span></p>", [list[i][1]]]);
		}
	}
	for (var index = 0; index < opennow.length; index++) {	
		opennow.sort(function (a, b) {
			return b[0].toString().localeCompare(a[0].toString());
		});

		opennow.sort(function (a, b) {
			return a[1].toString().localeCompare(b[1].toString());
		});		

		document.getElementById("output").innerHTML += opennow[index][0];		
	}

	
	for (var index = 0; index < comingup.length; index++) {
		comingup.sort(function (a, b) {
			return b[0].toString().localeCompare(a[0].toString());
		});
		
		comingup.sort(function (a, b) {
			return a[1].toString().localeCompare(b[1].toString());
		});
		
		document.getElementById("output2").innerHTML += comingup[index][0];
		
		
	}

}
