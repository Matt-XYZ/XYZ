var shortTime;
var wkday;
var output;
var openIndex, comingUpIndex;
var opennow = [];
var comingup = [];
window.onload = function() {
	windowOnload();
}
function windowOnload() {
	opennow = [];
	comingup = [];
	openIndex = 0;
	comingUpIndex = 0;

	$("#timeDisplay").html(calcTime("Bellingham", "+8"));

	$("#output").html("<h3>Open Locations</h3><img id='loader' src='spinner.gif' />");
	$("#output2").html("<h3>Coming Up</h3><img id='loader2' src='spinner.gif' />");

	setTimeout(function() {
		$("#loader").css("display", "none");
		$("#loader2").css("display", "none");
		findOpen(wkday);

		// keep refresh button disabled until initial load completes
		$("#refresh-link").removeClass("disabled");

		if (opennow.length < 1) {
			$("#output").append("<p><i>Nothing right now</i></p>");
		}

		if (comingup.length < 1) {
			$("#output2").append("<p><i>Nothing in the next 2 hours</i></p>");
		}
	}, 1500);


} // end windowOnload


function refresh() {
	windowOnload();

	// add disabled class on button click (will be removed when windowOnload finishes executing)
	$("#refresh-link").addClass("disabled");
}

// add a leading zero to a number when needed
function pad(num) {
	var s = num+"";
	while (s.length < 2) s = "0" + s;
	return s;
}

// add leading zero to 3 digit number
function fourpad(num) {
	var s = num+"";
	if (s.length == 3) s = "0" + s;
	return s;
}

// convert 24hr hours to 12hr
function toTwelveHr(hr) {
	if (hr > 12) {
		return hr - 12;
	}
	else if (hr === 0) {
	   return 12;
	}
	else return hr;
}

// determine AM or PM value of a time
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

	if (getAllUrlParams().mode == "debug") {
		shortTime = prompt("Enter time");
		wkday = prompt("Enter weekday");
		return "<span style=\"color: red;\">Debugging: " + wkday + ", " +  shortTime + "</span>";
	}

    // return time as a string
    return "WWU Dining locations open as of " + wkday + ", " +  toTwelveHr(nd.getHours()) + ":" + pad(nd.getMinutes()) + " " + AMPM(fullHour);
}

function findOpen(weekday) {

	var locations = [];

	// Monday through Thursday
	if (weekday == "Monday" || weekday == "Tuesday" || weekday == "Wednesday" || weekday == "Thursday") {
		locations = [["Ridgeway Commons (Breakfast)", 700, 1100], ["Ridgeway Commons (Lunch)", 1100, 1330], ["Ridgeway Commons (Lite Lunch)", 1330, 1700],
							["Ridgeway Commons (Dinner)", 1700, 1930], ["Ridgeway Commons (Late Night)", 2100, 2230],

						["Viking Commons (Breakfast)", 700, 1100], ["Viking Commons (Lunch)", 1100, 1330], ["Viking Commons (Lite Lunch)", 1330, 1700],
							["Viking Commons (Dinner)", 1700, 1930], ["Viking Commons (Late Night)", 2100, 2230],

						["Fairhaven Commons (Breakfast)", 700, 1100], ["Fairhaven Commons (Lunch)", 1100, 1330], ["Fairhaven Commons (Lite Lunch)", 1330, 1700],
							["Fairhaven Commons (Dinner)", 1700, 1930], ["Fairhaven Commons (Late Night)", 2100, 2230],


					["VU Cafe", 730, 1900, "vu-cafe"], ["VU Market", 730, 1900, "vu-market"], ["Subway @ VU", 730, 1900, "vu-subway"], ["Panda Express @ VU", 1030, 1900, "vu-pexpress"], ["Underground Coffeehouse", 900, 2200, "coffeehouse"],
					["Miller Market", 730, 1800, "miller-market"], ["Zoe's Bookside Bagels", 730, 2300, "zoes-bagels"], ["Rock's Edge Cafe", 730, 2000, "rocks-cafe"], ["POD Market @ The Atrium", 730, 1800, "pod-market"], ["Freshens Fresh Food Studio", 800, 1700, "freshens"],
					["Starbucks @ The Atrium", 730, 1800, "atrium-starbucks"], ["Topio's @ The Atrium", 1030, 1700, "atrium-topios"], ["Subway @ The Atrium", 730, 1700, "atrium-subway"], ["BT Station", 1100, 2300, "bt-station"],
					["The Haven", 1000, 2300, "haven"]];
	}

	// Friday
	else if (weekday == "Friday") {
		locations = [["Ridgeway Commons (Breakfast)", 700, 1100], ["Ridgeway Commons (Lunch)", 1100, 1330], ["Ridgeway Commons (Lite Lunch)", 1330, 1700],
							["Ridgeway Commons (Dinner)", 1700, 1830], ["Ridgeway Commons (Late Night)", 2030, 2200],

						["Viking Commons (Breakfast)", 700, 1100], ["Viking Commons (Lunch)", 1100, 1330], ["Viking Commons (Lite Lunch)", 1330, 1700],
							["Viking Commons (Dinner)", 1700, 1830], ["Viking Commons (Late Night)", 2030, 2200],

						["Fairhaven Commons (Breakfast)", 700, 1100], ["Fairhaven Commons (Lunch)", 1100, 1330], ["Fairhaven Commons (Lite Lunch)", 1330, 1700],
							["Fairhaven Commons (Dinner)", 1700, 1830], ["Fairhaven Commons (Late Night)", 2030, 2200],

					["VU Cafe", 730, 1900, "vu-cafe"], ["VU Market", 730, 1900, "vu-market"], ["Subway @ VU", 730, 1900, "vu-subway"], ["Panda Express @ VU", 1030, 1900, "vu-pexpress"], ["Underground Coffeehouse", 900, 2000, "coffeehouse"],
					["Miller Market", 730, 1700, "miller-market"], ["Zoe's Bookside Bagels", 730, 1700, "zoes-bagels"], ["Rock's Edge Cafe", 730, 1700, "rocks-cafe"],["POD Market @ The Atrium", 730, 1630, "pod-market"], ["Freshens Fresh Food Studio", 800, 1700, "freshens"],
					["Starbucks @ The Atrium", 730, 1650, "atrium-starbucks"], ["Topio's @ The Atrium", 1030, 1430, "atrium-topios"], ["Subway @ The Atrium", 730, 1430, "atrium-subway"], ["BT Station", 1100, 1700, "bt-station"], ["The Haven", 1000, 1700, "haven"]];
	}

	// Saturday
	else if (weekday == "Saturday") {
		locations = [["Ridgeway Commons (Breakfast)", -1, -1], ["Ridgeway Commons (Brunch)", 1000, 1330], ["Ridgeway Commons (Lite Lunch)", -1, -1],
							["Ridgeway Commons (Dinner)", 1700, 1830], ["Ridgeway Commons (Late Night)", 2030, 2200],

						["Viking Commons (Breakfast)", -1, -1], ["Viking Commons (Brunch)", 1000, 1330], ["Viking Commons (Lite Lunch)", -1, -1],
							["Viking Commons (Dinner)", 1700, 1830], ["Viking Commons (Late Night)", 2030, 2200],

						["Fairhaven Commons (Breakfast)", -1, -1], ["Fairhaven Commons (Brunch)", 1000, 1330], ["Fairhaven Commons (Lite Lunch)", -1, -1],
							["Fairhaven Commons (Dinner)", 1700, 1830], ["Fairhaven Commons (Late Night)", 2030, 2200],

					["VU Cafe", 900, 1300, "vu-cafe"], ["VU Market", 1100, 1900, "vu-market"], ["Subway @ VU", 1100, 1900, "vu-subway"], ["Panda Express @ VU", -1, -1, "vu-pexpress"], ["Underground Coffeehouse", -1, -1, "coffeehouse"],
					["Miller Market", -1, -1, "miller-market"], ["Zoe's Bookside Bagels", 1100, 1700, "zoes-bagels"], ["Rock's Edge Cafe", -1, -1, "rocks-cafe"],["POD Market @ The Atrium", -1, -1, "pod-market"], ["Freshens Fresh Food Studio", -1, -1, "freshens"],
					["Starbucks @ The Atrium", -1, -1, "atrium-starbucks"], ["Topio's @ The Atrium", -1, -1, "atrium-topios"], ["Subway @ The Atrium", -1, -1, "atrium-subway"], ["BT Station", -1, -1, "bt-station"], ["The Haven", 1400, 2000, "haven"]];
	}

	// Sunday
	else if (weekday == "Sunday") {
		locations = [["Ridgeway Commons (Breakfast)", -1, -1], ["Ridgeway Commons (Brunch)", 1000, 1330], ["Ridgeway Commons (Lite Lunch)", -1, -1],
							["Ridgeway Commons (Dinner)", 1700, 1830], ["Ridgeway Commons (Late Night)", 2100, 2230],

						["Viking Commons (Breakfast)", -1, -1], ["Viking Commons (Brunch)", 1000, 1330], ["Viking Commons (Lite Lunch)", -1, -1],
							["Viking Commons (Dinner)", 1700, 1830], ["Viking Commons (Late Night)", 2100, 2230],

						["Fairhaven Commons (Breakfast)", -1, -1], ["Fairhaven Commons (Brunch)", 1000, 1330], ["Fairhaven Commons (Lite Lunch)", -1, -1],
							["Fairhaven Commons (Dinner)", 1700, 1830], ["Fairhaven Commons (Late Night)", 2100, 2230],

					["VU Café", -1, -1, "vu-cafe"], ["VU Market", 1100, 1900, "vu-market"], ["Subway @ VU", 1100, 1900, "vu-subway"], ["Panda Express @ VU", -1, -1 ,"vu-pexpress"], ["Underground Coffeehouse", -1, -1, "coffeehouse"],
					["Miller Market", -1, -1, "miller-market"], ["Zoe's Bookside Bagels", 1200, 2300, "zoes-bagels"], ["Rock's Edge Café", -1, -1, "rocks-cafe"],["POD Market @ The Atrium", -1, -1, "pod-market"], ["Freshens Fresh Food Studio", -1, -1, "freshens"],
					["Starbucks @ The Atrium", -1, -1, "atrium-starbucks"], ["Topio's @ The Atrium", -1, -1, "atrium-topios"], ["Subway @ The Atrium", -1, -1, "atrium-subway"], ["BT Station", -1, -1, "bt-station"], ["The Haven", 1800, 2300, "haven"]];
	}
	printOpen(locations);
}

// Add an amount of minutes to a number so that it rolls over at 60, rather than 100
function addTime(current, min) {
	var firstTwo = Number(fourpad(current.toString()).split("")[0] + fourpad(current.toString()).split("")[1]);
	var lastTwo = Number(fourpad(current.toString()).split("")[2] + fourpad(current.toString()).split("")[3]);

	var d = new Date("Sun Jan 1 2000 " + firstTwo + ":" + lastTwo + ":00");

	d.setMinutes(d.getMinutes() + min);

	return Number((d.getHours().toString()) + (pad(d.getMinutes()).toString()));
}

// convert a number value to a formatted string for display
function convertToTime(value) {
	var firstTwo = Number(fourpad(value.toString()).split("")[0] + fourpad(value.toString()).split("")[1]);
	var lastTwo = Number(fourpad(value.toString()).split("")[2] + fourpad(value.toString()).split("")[3]);

	var d = new Date("Sun Jan 1 2000 " + firstTwo + ":" + lastTwo + ":00");

	return (toTwelveHr(d.getHours())).toString() + ":" + pad(lastTwo.toString()) + " " + AMPM(firstTwo);
}


function printOpen(list) {
	for (var i = 0; i < list.length; i++) {
		if (shortTime >= list[i][1] && shortTime < list[i][2]) {
			opennow.push([ [list[i][2]], "<p class=" + list[i][3] + ">" + list[i][0] + "<a href='#' class='imgHover'>?</a><span>Closes at " + convertToTime(list[i][2]) + "</span></p>"]);
			openIndex++;
		}

		else if (shortTime < list[i][1] && addTime(shortTime, 120) >= list[i][1]) {
			comingup.push([ [list[i][1]] , "<p>" + list[i][0] + "<span>Opens at " + convertToTime(list[i][1]) + "</span></p>", ]);
			comingUpIndex++;
		}
	}
	for (var index = 0; index < opennow.length; index++) {
		// sort the array of open locations
		opennow.sort();

		// append current item to the HTML output
		$("#output").append(opennow[index][1]);
	}


	for (var index = 0; index < comingup.length; index++) {
		// sort the array of coming up locations
		comingup.sort();

		// append current item to the HTML output2
		$("#output2").append(comingup[index][1]);
	}

	// update headings with indexes
	$("#output h3").text("Open Locations (" + openIndex + ")");
	$("#output2 h3").text("Coming Up (" + comingUpIndex + ")");

	$(".imgHover").click(function() {
		$("#locationImg").css("display", "block");
	});
}

function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

	// stuff after # is not part of query string, so get rid of it
	queryString = queryString.split('#')[0];

	// split our query string into its component parts
	var arr = queryString.split('&');

	for (var i=0; i<arr.length; i++) {
	  // separate the keys and the values
	  var a = arr[i].split('=');

	  // in case params look like: list[]=thing1&list[]=thing2
	  var paramNum = undefined;
	  var paramName = a[0].replace(/\[\d*\]/, function(v) {
		paramNum = v.slice(1,-1);
		return '';
	  });

	  // set parameter value (use 'true' if empty)
	  var paramValue = typeof(a[1])==='undefined' ? true : a[1];

	  // (optional) keep case consistent
	  //paramName = paramName.toLowerCase();
	  //paramValue = paramValue.toLowerCase();

	  // if parameter name already exists
	  if (obj[paramName]) {
		// convert value to array (if still string)
		if (typeof obj[paramName] === 'string') {
		  obj[paramName] = [obj[paramName]];
		}
		// if no array index number specified...
		if (typeof paramNum === 'undefined') {
		  // put the value on the end of the array
		  obj[paramName].push(paramValue);
		}
		// if array index number specified...
		else {
		  // put the value at that index number
		  obj[paramName][paramNum] = paramValue;
		}
	  }
	  // if param name doesn't exist yet, set it
	  else {
		obj[paramName] = paramValue;
	  }
	}
  }

  return obj;
}
