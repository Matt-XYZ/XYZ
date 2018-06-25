var shortTime;
var wkday;
var output;
var openIndex, openSoonIndex;
var opennow = [];
var openSoon = [];

var alert;
alert.active = true;
alert.content = "Updated with summer hours. All locations closed July 4.";

var infoOutput = true;

var alternativeMsg = "";

window.onload = function() {
	windowOnload();
}

function convertToURL(text) {
	var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	return text.replace(exp,"<a href='$1' target='_blank'>$1</a>");
}

function windowOnload(state) {

	//$("#debug").text(JSON.atrium_subway.Monday.start);

	var returnRate;
	if (state != "refresh") {
		returnRate = 500;
	}
	else {
		returnRate = 0;
		setTimeout(function() {
			// let the refresh icon make a full rotation
			$("#refreshIcon").removeClass("fa-spin");
			// keep refresh button disabled until initial load completes
			$("#refresh-link").removeClass("disabled");
		}, 500);
	}

	opennow = [];
	openSoon = [];
	openIndex = 0;
	openSoonIndex = 0;

	// use +7 during DST, +8 otherwise
	$("#timeDisplay").html(calcTime("Bellingham", "+7"));

	$("#output").html("<h3>Open Locations</h3><div id='output-inner'></div>");
	$("#output2").html("<h3>Opening Soon</h3><div id='output2-inner'></div>");


	setTimeout(function() {
		if (infoOutput) {
			printOpen(wkday);
		

			if (opennow.length < 1) {
				$("#output-inner").append("<p><i>Nothing right now</i></p>");
				favicon("sad");
			}
			else {
				favicon("happy");
			}

			if (openSoon.length < 1) {
				$("#output2-inner").append("<p><i>Nothing in the next 2 hours</i></p>"
				+ "<span>Find this site useful? Consider using my Uber Eats code:</span><span class=\"special\">eats-mattj12786ui</span>");
			}
		}
		else {
			$("#output-inner, #output2-inner").append("<div id=\"alternativeMsg\">" + alternativeMsg + "</div>");
		}

		$("#output-inner, #output2-inner").slideToggle();
		
		// display alert if active
		if(alert.active && $("div.alert-info").css("display") == "none") {
			$("div.alert-info").html(alert.content);
			$("div.alert-info").slideToggle();
		}
		
		// remove disabled class from refresh button if this is a page load
		if (state != "refresh") $("#refresh-link").removeClass("disabled");
	}, returnRate);
} // end windowOnload


function refresh() {
	$("#output-inner, #output2-inner").slideToggle();
	$("#refreshIcon").addClass("fa-spin");

	setTimeout(function() {
		windowOnload("refresh");
	}, 500);


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

	var displayWkDay = wkday;

	if (getAllUrlParams().mode == "debug") {
        wkday = prompt("Enter weekday");
		displayWkDay = wkday;
		shortTime = prompt("Enter time");
		return "<span style=\"color: red;\">Debugging: " + displayWkDay + ", " +  convertToTime(shortTime) + "</span><span><a href=\"./\">Exit debug mode</a>";
	}

    // return time as a string
    return displayWkDay + ", " +  toTwelveHr(nd.getHours()) + ":" + pad(nd.getMinutes()) + " " + AMPM(fullHour);
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


function printOpen(wkday) {
	$.each(JSON, function(k, v) {
		if (shortTime >= v[wkday].start && shortTime < v[wkday].end) {
			opennow.push([v[wkday].end, "<p class=" + v.alias + ">" + v.display_name + "<a id=" + v.alias + " href='#' onclick='return false;' class='imgHover'><sup>(?)</sup></a><span>Closes at " + convertToTime(v[wkday].end) + "</span></p>"]);
			openIndex++;
		}

		else if (shortTime < v[wkday].start && addTime(shortTime, 120) >= v[wkday].start) {
			openSoon.push([v[wkday].start , "<p class=" + v.alias + ">" + v.display_name + "<a id=" + v.alias + " href='#' onclick='return false;' class='imgHover'><sup>(?)</sup></a><span>Opens at " + convertToTime(v[wkday].start) + "</span></p>", ]);
			openSoonIndex++;
		}
	});

	for (var index = 0; index < opennow.length; index++) {
		// sort the array of open locations
		opennow.sort();

		// append current item to the HTML output
		$("#output-inner").append(opennow[index][1]);
	}


	for (var index = 0; index < openSoon.length; index++) {
		// sort the array of Opening Soon locations
		openSoon.sort();

		// append current item to the HTML output2
		$("#output2-inner").append(openSoon[index][1]);
	}

	// update headings with indexes
	$("#output h3").html("<b>" + openIndex + "</b> Open Locations");
	$("#output2 h3").html("<b>" + openSoonIndex + "</b> Opening Soon");

	$(".imgHover").each(function(index) {
		$(this).click(function() {
			$("#modalImg").attr("src", getMapEmbed($(this).attr("id")));
			$("#modalDiv").css("display", "block");
		});
	});

	// When the user clicks on <span> (x), close the modal
	$("#close").click(function() {
		$("#modalImg").attr("src", "");
		$("#modalDiv").css("display", "none");
	});

	$("#modalDiv").click(function(event) {
		$("#modalImg").attr("src", "");
		$("#modalDiv").css("display", "none");
	});

	$(document).ready(function(){
	    $('[data-toggle="tooltip"]').tooltip();
	});

}

function getMapEmbed(location) {
	if (location == "vu_cafe" || location == "underground_coffeehouse") return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1315.6262630669914!2d-122.48757834170385!3d48.7388727637146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDQ0JzE5LjkiTiAxMjLCsDI5JzExLjMiVw!5e0!3m2!1sen!2sus!4v1518138063732";
	else if (location == "subway_vu" || location == "pexpress_vu" || location == "vu_market") return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1315.6227558950666!2d-122.48739034170386!3d48.73900676370991!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDQ0JzIwLjQiTiAxMjLCsDI5JzEwLjciVw!5e0!3m2!1sen!2sus!4v1518138286088";
	else if (location == "miller_market") return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1315.6836593040343!2d-122.48610934170391!3d48.736679763791656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDQ0JzEyLjAiTiAxMjLCsDI5JzA2LjEiVw!5e0!3m2!1sen!2sus!4v1518137244822";
	else if (location == "zoes_bagels") return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d657.8246067271543!2d-122.48631317073745!3d48.73799588316775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDQ0JzE2LjgiTiAxMjLCsDI5JzA4LjgiVw!5e0!3m2!1sen!2sus!4v1518138441509";
	else if (location == "rocks_cafe") return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1315.8129092870122!2d-122.4893911703614!3d48.731741097582834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDQzJzU0LjMiTiAxMjLCsDI5JzE5LjQiVw!5e0!3m2!1sen!2sus!4v1518138528635";
	else if (location == "bt_station") return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1315.8503675283262!2d-122.48683921055277!3d48.730309741303124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDQzJzQ5LjEiTiAxMjLCsDI5JzA4LjciVw!5e0!3m2!1sen!2sus!4v1518138755478";
	else if (location == "the_haven") return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d657.9717361183431!2d-122.48775317073753!3d48.72675188336555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDQzJzM2LjMiTiAxMjLCsDI5JzEzLjkiVw!5e0!3m2!1sen!2sus!4v1518139126220";
	else if (location == "starbucks_atrium" || location == "topios_atrium" || location == "subway_atrium" || location == "pod_market") return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1315.7594303193364!2d-122.48678063718938!3d48.73378458431952!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDQ0JzAxLjYiTiAxMjLCsDI5JzA4LjkiVw!5e0!3m2!1sen!2sus!4v1518137780549";
	else if (location == "freshens") return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1315.7002519643306!2d-122.48697793225266!3d48.73604577601202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDQ0JzA5LjgiTiAxMjLCsDI5JzA5LjIiVw!5e0!3m2!1sen!2sus!4v1518137908653";
	else if (location == "f_commons") return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1315.8503675283262!2d-122.48683921055277!3d48.730309741303124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDQzJzQ5LjEiTiAxMjLCsDI5JzA4LjciVw!5e0!3m2!1sen!2sus!4v1518138755478";
	else if (location == "r_commons") return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d657.875052822489!2d-122.4906651707535!3d48.73414088323561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDQ0JzAyLjkiTiAxMjLCsDI5JzI0LjQiVw!5e0!3m2!1sen!2sus!4v1518139499053"
	else if (location == "v_commons") return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d657.8088899681655!2d-122.48582617075354!3d48.739196883146704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDQ0JzIxLjEiTiAxMjLCsDI5JzA3LjAiVw!5e0!3m2!1sen!2sus!4v1518139543466";
	else return "https://placehold.it/1152x679?text=Error+loading+map";
}

function favicon(state) {
	var icon;
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
	
	if (state == "happy") {
		var icons = [
			"favicons/happy(1).ico",
			"favicons/happy(2).ico",
			"favicons/happy(3).ico",
			"favicons/happy(4).ico",
			"favicons/happy(5).ico",
			"favicons/happy(6).ico",
		];
		var randomNumber = Math.floor(Math.random()*icons.length);

		icon = icons[randomNumber];
	}
	else if (state == "sad") {
		var icons = [
			"favicons/sad(1).ico",
			"favicons/sad(2).ico",
			"favicons/sad(3).ico",
			"favicons/sad(4).ico",
			"favicons/sad(5).ico",
			"favicons/sad(6).ico",
		];
		var randomNumber = Math.floor(Math.random()*icons.length);

		icon = icons[randomNumber];
	}
	
    link.href = icon;
    document.getElementsByTagName('head')[0].appendChild(link);
};

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
