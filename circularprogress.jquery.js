/*
    Usage:

    Markup:

    Options:
*/
(function (window,$) {
	var Plugin = function(elem,options){
		this.elem = elem;
		this.$elem = $(elem);
		this.options = options
	}

	Plugin.prototype = {
		init: function(){
			var thisobj = this;
			this.settings = $.extend({
				rotateBy: 40, //amount to change progress by in each animation frame
				animateOnLoad: 1, //FIXME?
				initialPerc: 60, //FIXME
				initialDeg: 270, //initial position to animate to on load
				speed: 600, //speed of animation
				innerHTML:'this is the inner wooo', //html to put inside the circle
                delayAnimation: 0, //FIXME also need callbacks
			}, this.defaults, this.options);
			
			this.panel1;
			this.panel2;
			this.currentpanel;
			this.timer;
			this.currentpos = 0;
			this.overallpos = 0;
			this.inner;

            this.circles = {
                general: {
                    initialise: function(){
                        //normalise settings
                        thisobj.settings.rotateBy = Math.min(thisobj.settings.rotateBy,360);
                        thisobj.settings.initialPerc = Math.min(thisobj.settings.initialPerc,100);
                        thisobj.settings.initialDeg = Math.min(thisobj.settings.initialDeg,360);

                        //create required elements and variables
                        var prog = $('<div/>').addClass('progressinner').appendTo(thisobj.$elem);
                        var lpane = $('<div/>').addClass('lpane').appendTo(prog);
                        var rpane = $('<div/>').addClass('rpane').appendTo(prog);
                        
                        thisobj.panel1 = $('<div/>').addClass('cover').appendTo(rpane);
                        thisobj.panel2 = $('<div/>').addClass('cover').appendTo(lpane);
                        thisobj.currentpanel = thisobj.panel1;
                        
                        if(thisobj.settings.innerHTML.length){
                            thisobj.inner = $('<div/>').addClass('display').html(thisobj.settings.innerHTML).appendTo(prog);
                        }
                    }
                },
                circles: {
                    //manages the rotation of the involved elements
                    rotateLoop: function(){
                        if(thisobj.currentpos > 180){
                            var nextpos = thisobj.currentpos - 180; //to make sure the first panel has fully rotated, need to work out any leftover
                            thisobj.circles.circles.rotateElement(thisobj.currentpanel,180); //fully rotate the first panel
                            thisobj.currentpos = nextpos;
                            thisobj.currentpanel = thisobj.panel2;
                        }

                        //if we've not finished animating, keep animating
                        if(thisobj.overallpos <= thisobj.settings.initialDeg){
                            thisobj.circles.circles.rotateElement(thisobj.currentpanel,thisobj.currentpos);
                            thisobj.timer = setTimeout(thisobj.circles.circles.rotateLoop,thisobj.settings.speed);
                        }
                        //otherwise stop and make sure we stop at the right place
                        else {
                            var endpos = thisobj.overallpos - thisobj.settings.initialDeg; //need to also subtract what gets added on at the end of this function
                            thisobj.currentpos -= endpos;
                            thisobj.overallpos -= endpos;
                            thisobj.circles.circles.rotateElement(thisobj.currentpanel,thisobj.currentpos);
                        }
                        thisobj.currentpos += thisobj.settings.rotateBy;
                        thisobj.overallpos += thisobj.settings.rotateBy;
                    },
                    rotateElement: function(elem,deg){
                        elem.css({
                            'transform': 'rotate('+deg+'deg)',
                            '-ms-transform': 'rotate('+deg+'deg)',
                            '-moz-tranform': 'rotate('+deg+'deg)',
                            '-webkit-transform': 'rotate('+deg+'deg)',
                            '-o-transform': 'rotate('+deg+'deg)'
                        });
                    }
                }

            };


            thisobj.circles.general.initialise();
            if(thisobj.settings.animateOnLoad){
                thisobj.timer = setTimeout(thisobj.circles.circles.rotateLoop,0); //no delay on initial load
            }

		},
	}
	$.fn.circles = function(options){
		return this.each(function(){
			new Plugin(this,options).init();
		});
	}
	window.Plugin = Plugin;
})(window,jQuery);