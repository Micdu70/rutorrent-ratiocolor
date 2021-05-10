/***
Ratiocolors!
Change the color of the ratio column according to the ratio
Original script written by Gyran
Modified by Micdu70 and senki
***/

plugin.loadLang();

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

// Change color opacity of cells [ only used for "cell-background" ]
colorOpacity = "0.5";

//changeWhatEnum = ["cell-background", "font"];

// what to change:
// cell-background
// font
changeWhat = "font";

// Set colors
// Set colors to all ratio columns ('trafic' plugin)
allRatioColumns = true;

/* Example
If ratio is 0 the color will be the first definde color. The the more the ratio approach
the next level the more it goes towards the next color. When the ratio is more then
the last level it will have the color of the last color.
*/

/****************/

function colorSub(a, b) {
	return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function colorAdd(a, b) {
	return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function colorMul(a, mul) {
	return [Math.floor(a[0] * mul), Math.floor(a[1] * mul), Math.floor(a[2] * mul)];
}

function colorRGB(color) {
	if(changeWhat === "cell-background")
		return "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + colorOpacity + ")";
	return "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
}

theWebUI.setRatioColors = function(column) {
	if(plugin.enabled) {
		$(column).each(function(index) {
			$(this).addClass("ratiocolor");
			ratio = $(this).children("div")[0].innerHTML;
			color = null;
			proc = 0;

			$.each(levels, function(index, level) {
				if(ratio < level) {
					leveldiff = level - levels[index - 1];
					proc = (ratio - levels[index - 1]) / leveldiff;

					diffColor = colorSub(colors[index], colors[index - 1]);

					color = colorAdd(colorMul(diffColor, proc), colors[index - 1]);

					return false;
				}
			});

			if(color === null) {
				color = colors[colors.length - 1];
			}

			switch(changeWhat)
			{
				case "cell-background":
					$(this).attr('style', function(i, s) { return s.replace(/background-color:(.*?);/, '') + 'background-color: ' + colorRGB(color) + ' !important;' });
					$(this).css("background-image", "none");
					break;
				case "font":
				default:
					$(this).css("color", colorRGB(color));
					break;
			}
		});
	}
};

plugin.onLangLoaded = function() {
	if(this.enabled) {
		error = false;

		// Error checking
		if(colors.length != levels.length) {
			log(theUILang.ratiocolorLengthError);
			error = true;
		}
		if(levels[0] != 0) {
			log(theUILang.ratiocolorLevel0);
			error = true;
		}

		if(!error) {
			plugin.tempFunc = theWebUI.tables.trt.obj.refreshRows;
			theWebUI.tables.trt.obj.refreshRows = function(height, fromScroll) {
				plugin.tempFunc.call(theWebUI.tables.trt.obj, height, fromScroll);
				theWebUI.setRatioColors(".stable-List-col-6");
				if(allRatioColumns && thePlugins.isInstalled("trafic")) {
					var c = theWebUI.tables.trt.columns.length;
					var n = 17;
					if(thePlugins.isInstalled("uploadeta"))
						n = 20;
					var x = 0;
					for(var i = n; i < c; i++) {
						var s = $(".stable-List-col-"+i).css("text-align");
						if(s === "right")
							x++;
						else
							x = 0;
						if(x === 3) {
							theWebUI.setRatioColors(".stable-List-col-"+i);
							i--;
							theWebUI.setRatioColors(".stable-List-col-"+i);
							i--;
							theWebUI.setRatioColors(".stable-List-col-"+i);
							break;
						}
					}
				}
			};
		}
	}
}

plugin.onRemove = function()
{
	$('.ratiocolor').attr('style', function(i, s) { return s.replace(/background-color:(.*?);/, '') });
	$('.ratiocolor').css("color", "");
	$('.ratiocolor').css("background-image", "");
	$('td').removeClass('ratiocolor');
}
