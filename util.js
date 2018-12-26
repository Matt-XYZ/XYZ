// convert a text url to an HTML anchor tag
function convertToURL(text) {
	var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	return text.replace(exp,"<a href='$1' target='_blank'>$1</a>");
}

// load a local json file
function loadJSON(callback) {
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', 'locations.json?revision=' + new Date().getTime(), true);
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			callback(xobj.responseText);
		}
	};
	xobj.send(null);
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

function getAllUrlParams(url) {
	var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
	var obj = {};
	if (queryString) {
		queryString = queryString.split('#')[0];

		// split query string
		var arr = queryString.split('&');
		for (var i=0; i<arr.length; i++) {
			// separate the keys and the values
			var a = arr[i].split('=');
			var paramNum = undefined;
			var paramName = a[0].replace(/\[\d*\]/, function(v) {
				paramNum = v.slice(1,-1);
				return '';
			});

			// set parameter value
			var paramValue = typeof(a[1])==='undefined' ? true : a[1];
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
