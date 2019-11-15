var shortTime;
var wkday;
var output;
var openIndex, openSoonIndex;
var opennow = [];
var openSoon = [];
var locations_json;
var debug;

var alert;
alert.active = true;
alert.content = "This application is currently disabled.";

var infoOutput = false;

var alternativeMsg = "";

window.onload = function() {
	windowOnload();
}

function windowOnload(state) {
	if (getAllUrlParams().mode == "debug") debug = true;

    loadJSON(function(response) {
        locations_json = JSON.parse(response);
     });

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
	$("#timeDisplay").html(calcTime("Bellingham", "+8"));

	$("#output").html("<h3>Open Locations</h3><div id='output-inner'></div>");
	$("#output2").html("<h3>Opening Soon</h3><div id='output2-inner'></div>");


	setTimeout(function() {
		if (infoOutput || debug) {
			printOpen(wkday);


			if (opennow.length < 1) {
				$("#output-inner").append("<p><i>Nothing right now</i></p>");
				favicon("sad");
			}
			else {
				favicon("happy");
			}

			if (openSoon.length < 1) {
				$("#output2-inner").append("<p><i>Nothing in the next 2 hours</i></p>");
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

	// report form popup
	$("#report").click(function() {
		$("#modalImg").attr("src", "form.html");
		$("#modalDiv").css("display", "block");
	});

	// modal closing mechanics
	$("#close").click(function() {
		$("#modalImg").attr("src", "");
		$("#modalDiv").css("display", "none");
	});
	$("#modalDiv").click(function(event) {
		$("#modalImg").attr("src", "");
		$("#modalDiv").css("display", "none");
	});
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

	var dayWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

	shortTime = Number(fullHour.toString() + pad(nd.getMinutes()).toString());

	wkday = dayWeek[nd.getDay()];

	var displayWkDay = wkday;

	if (debug) {
        wkday = prompt("Enter weekday");
		displayWkDay = wkday;
		shortTime = prompt("Enter time");
		return "<span style=\"color: red;\">Debugging: " + displayWkDay + ", " +  convertToTime(shortTime) + "</span><span><a href=\"./\">Exit debug mode</a>";
	}

    // return time as a string
    return displayWkDay + ", " +  toTwelveHr(nd.getHours()) + ":" + pad(nd.getMinutes()) + " " + AMPM(fullHour);
}

function printOpen(wkday) {
	$.each(locations_json, function(k, v) {
		if (shortTime >= v[wkday].start && shortTime < v[wkday].end) {
			// if location closes within next 30 mins (use 70 because shortTime rolls over at 100, not 60)
			if (v[wkday].end - shortTime <= 70) {
				opennow.push([v[wkday].end, "<p class=\"location__open " + v.alias + "\">" + v.display_name + "<a id=" + v.alias + " href='#' onclick='return false;' class='imgHover'><sup>(?)</sup></a><span class=\"closes-soon\"><i class=\"fa fa-exclamation-triangle\"></i>&nbsp;Closes soon: " + convertToTime(v[wkday].end) + "</span></p>"]);
			}
			// open locations that aren't closing in next 30 mins
			else {
				opennow.push([v[wkday].end, "<p class=" + v.alias + ">" + v.display_name + "<a id=" + v.alias + " href='#' onclick='return false;' class='imgHover'><sup>(?)</sup></a><span>Closes at " + convertToTime(v[wkday].end) + "</span></p>"]);
			}
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
			$("#modalImg").attr("src", getEmbed($(this).attr("id")));
			$("#modalDiv").css("display", "block");
		});
	});

	$(document).ready(function(){
	    $('[data-toggle="tooltip"]').tooltip();
	});

}

function getEmbed(location) {
	if (location == "vu_cafe" || location == "underground_coffeehouse") return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1315.6262630669914!2d-122.48757834170385!3d48.7388727637146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDQ0JzE5LjkiTiAxMjLCsDI5JzExLjMiVw!5e0!3m2!1sen!2sus!4v1518138063732";
	else if (location == "subway_vu" || location == "pexpress_vu" || location == "vu_market") return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1315.6227558950666!2d-122.48739034170386!3d48.73900676370991!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDQ0JzIwLjQiTiAxMjLCsDI5JzEwLjciVw!5e0!3m2!1sen!2sus!4v1518138286088";
	else if (location == "miller_market") return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1315.6836593040343!2d-122.48610934170391!3d48.736679763791656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDQ0JzEyLjAiTiAxMjLCsDI5JzA2LjEiVw!5e0!3m2!1sen!2sus!4v1518137244822";
	else if (location == "zoes_bagels") return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d657.8246067271543!2d-122.48631317073745!3d48.73799588316775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDQ0JzE2LjgiTiAxMjLCsDI5JzA4LjgiVw!5e0!3m2!1sen!2sus!4v1518138441509";
	else if (location == "rocks_cafe") return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1315.8129092870122!2d-122.4893911703614!3d48.731741097582834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDQzJzU0LjMiTiAxMjLCsDI5JzE5LjQiVw!5e0!3m2!1sen!2sus!4v1518138528635";
	else if (location == "bt_station") return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1315.8503675283262!2d-122.48683921055277!3d48.730309741303124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDQzJzQ5LjEiTiAxMjLCsDI5JzA4LjciVw!5e0!3m2!1sen!2sus!4v1518138755478";
	else if (location == "the_haven") return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d657.9717361183431!2d-122.48775317073753!3d48.72675188336555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDQzJzM2LjMiTiAxMjLCsDI5JzEzLjkiVw!5e0!3m2!1sen!2sus!4v1518139126220";
	else if (location == "starbucks_atrium" || location == "oath_pizza" || location == "topios_atrium" || location == "subway_atrium" || location == "pod_market") return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1315.7594303193364!2d-122.48678063718938!3d48.73378458431952!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDQ0JzAxLjYiTiAxMjLCsDI5JzA4LjkiVw!5e0!3m2!1sen!2sus!4v1518137780549";
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
