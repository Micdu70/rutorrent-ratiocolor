/***
Ratiocolors!
Change the color of the ratio column according to the ratio
Original script written by Gyran
Modified by Micdu70
***/

plugin.loadLang();
plugin.loadMainCSS();

/*** Settings ***/
// Diffrent color between diffrents levels. First level must be 0.
levels = [0, 0.8, 1, 2.2];

// Colors of the diffrent levels. [r, g, b]
colors =
[
	[255, 0, 0],
	[255, 153, 0],
	[0, 200, 0],
	[0, 233, 0]
];

//changeWhatEnum = ["cell-background", "font"];

// what to change:
// cell-background
// font
changeWhat = "font";

// Set colors to all ratio columns ('trafic' plugin)
allRatioColumns = true;

/* Example
If ratio is 0 the color will be the first definde color. The the more the ratio approach
the next level the more it goes towards the next color. When the ratio is more then
the last level it will have the color of the last color.
*/

/****************/

function colorSub(a, b){
	return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function colorAdd(a, b){
	return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function colorMul(a, mul){
	return [Math.floor(a[0] * mul), Math.floor(a[1] * mul), Math.floor(a[2] * mul)];
}

function colorRGB(color){
	return "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
}

theWebUI.setRatioColors = function(){
	$(".stable-List-col-6").each(function(index) {
		ratio = $(this).children("div")[0].innerHTML
		color = null;
		proc = 0;

		$.each(levels, function(index, level){
			if(ratio < level){
				leveldiff = level - levels[index - 1];
				proc = (ratio - levels[index - 1]) / leveldiff;

				diffColor = colorSub(colors[index], colors[index - 1]);

				color = colorAdd(colorMul(diffColor, proc), colors[index - 1]);

				return false;
			}
		});

		if(color === null){
			color = colors[colors.length - 1];
		}

		switch(changeWhat)
		{
			case "font":
				$(this).css("color", colorRGB(color));
				break;
			case "cell-background":
			default:
		$(this).attr('style', function(i, s) { return s.replace(/background-color:(.*?);/, '') + 'background-color:' + colorRGB(color) + important });
				$(this).css("background-image", "none");
				break;
		}
	});
};

theWebUI.setRatioColors2 = function(){
	/* Ratio/Day */
	$(".stable-List-col-24").each(function(index) {
		ratio = $(this).children("div")[0].innerHTML
		color = null;
		proc = 0;

		$.each(levels, function(index, level){
			if(ratio < level){
				leveldiff = level - levels[index - 1];
				proc = (ratio - levels[index - 1]) / leveldiff;

				diffColor = colorSub(colors[index], colors[index - 1]);

				color = colorAdd(colorMul(diffColor, proc), colors[index - 1]);

				return false;
			}
		});

		if(color === null){
			color = colors[colors.length - 1];
		}

		switch(changeWhat)
		{
			case "font":
				$(this).css("color", colorRGB(color));
				break;
			case "cell-background":
			default:
		$(this).attr('style', function(i, s) { return s.replace(/background-color:(.*?);/, '') + 'background-color:' + colorRGB(color) + important });
				$(this).css("background-image", "none");
				break;
		}
	});
	/* Ratio/Week */
	$(".stable-List-col-25").each(function(index) {
		ratio = $(this).children("div")[0].innerHTML
		color = null;
		proc = 0;

		$.each(levels, function(index, level){
			if(ratio < level){
				leveldiff = level - levels[index - 1];
				proc = (ratio - levels[index - 1]) / leveldiff;

				diffColor = colorSub(colors[index], colors[index - 1]);

				color = colorAdd(colorMul(diffColor, proc), colors[index - 1]);

				return false;
			}
		});

		if(color === null){
			color = colors[colors.length - 1];
		}

		switch(changeWhat)
		{
			case "font":
				$(this).css("color", colorRGB(color));
				break;
			case "cell-background":
			default:
		$(this).attr('style', function(i, s) { return s.replace(/background-color:(.*?);/, '') + 'background-color:' + colorRGB(color) + important });
				$(this).css("background-image", "none");
				break;
		}
	});
	/* Ratio/Month */
	$(".stable-List-col-26").each(function(index) {
		ratio = $(this).children("div")[0].innerHTML
		color = null;
		proc = 0;

		$.each(levels, function(index, level){
			if(ratio < level){
				leveldiff = level - levels[index - 1];
				proc = (ratio - levels[index - 1]) / leveldiff;

				diffColor = colorSub(colors[index], colors[index - 1]);

				color = colorAdd(colorMul(diffColor, proc), colors[index - 1]);

				return false;
			}
		});

		if(color === null){
			color = colors[colors.length - 1];
		}

		switch(changeWhat)
		{
			case "font":
				$(this).css("color", colorRGB(color));
				break;
			case "cell-background":
			default:
		$(this).attr('style', function(i, s) { return s.replace(/background-color:(.*?);/, '') + 'background-color:' + colorRGB(color) + important });
				$(this).css("background-image", "none");
				break;
		}
	});
};

plugin.onLangLoaded = function() {
	if(this.enabled) {
	   error = false;

	   // Error checking
	   if(colors.length != levels.length){
		   log(theUILang.ratiocolorLengthError);
		   error = true;
	   }
	   if(levels[0] != 0){
		   log(theUILang.ratiocolorLevel0);
		   error = true;
	   }

	   if(!error){
		   plugin.tempFunc = theWebUI.tables.trt.obj.refreshRows;
		   theWebUI.tables.trt.obj.refreshRows = function(height, fromScroll){
			   plugin.tempFunc.call(theWebUI.tables.trt.obj, height, fromScroll);
			   theWebUI.setRatioColors();
			   if(allRatioColumns && thePlugins.isInstalled("trafic"))
				   theWebUI.setRatioColors2();
			};
			if(settings){
				rcSettingsDiv = $('<div>').attr("id","st_ratiocolor");
				fieldset = $('<fieldset>').html("<legend>" + theUILang.ratiocolorName + "</legend>");
				fieldset.append(theWebUI.ratiocolorLevelsbar(levels, colors));

				// New level add
				divAdd = $('<div>').attr("id", "ratiocolorAddNewLevel");
				divAdd.html('Level: <input id="rcAddLvl" type="text" /><br />Color: #<input id="rcAddColor" type="text" />')
				btnAdd = $('<input>').attr("type", "button").attr("value", "New level");
				btnAdd.click(function()
				{
					levels.push($("#rcAddLvl").val());
					//colors.add($("#rcAddColor").val());
					colors.push([255,255,255]);

					theWebUI.updateRatiocolorsLevelsBar(levels, colors);
				});
				divAdd.append(btnAdd);
				fieldset.append(divAdd);

				rcSettingsDiv.append(fieldset);
				typehis.attachPageToOptions(rcSettingsDiv[0], theUILang.ratiocolorName);
			}
		}
	}
}

theWebUI.ratiocolorLevelsbar = function(levels, colors){
	div = $("<div>").attr("id","ratiocolorLevelsbar");
	width = Math.floor(100/(colors.length-1)) + "%";
	for(i=1;i<colors.length;++i)
	{
		level = $("<div>").addClass("level").html(levels[i]);
		level.attr("style", "background-image: -webkit-gradient(linear, 0% 0%, 100% 0%, from(" + colorRGB(colors[i-1]) + "), to(" + colorRGB(colors[i]) + "));");
		level.css("width", width);
		div.append(level[0]);
	}
	return div;
}

theWebUI.updateRatiocolorsLevelsBar = function(levels, colors)
{
	$('#ratiocolorLevelsbar').html(theWebUI.ratiocolorLevelsbar(levels, colors).html());
}

plugin.onRemove = function()
{
	if(settings){
		this.removePageFromOptions("st_ratiocolors");
	}
}
