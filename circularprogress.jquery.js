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
			var me = this;
			this.settings = $.extend({
				rotateBy: 40, //amount to change progress by in each animation frame
				animateOnLoad: 1, //FIXME?
				initialPerc: 60, //FIXME
				initialDeg: 10, //initial position on load
				targetPerc: 0, //FIXME
				targetDeg: 270, //target position to animate to on load
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
                        me.settings.rotateBy = Math.min(me.settings.rotateBy,360);
                        me.settings.initialPerc = Math.min(me.settings.initialPerc,100);
                        me.settings.targetDeg = Math.min(me.settings.targetDeg,360);

                        //create required elements and variables
                        var prog = $('<div/>').addClass('progressinner').appendTo(me.$elem);
                        var lpane = $('<div/>').addClass('lpane').appendTo(prog);
                        var rpane = $('<div/>').addClass('rpane').appendTo(prog);
                        
                        me.panel1 = $('<div/>').addClass('cover').appendTo(rpane);
                        me.panel2 = $('<div/>').addClass('cover').appendTo(lpane);
                        me.currentpanel = me.panel1;
                        
                        if(me.settings.innerHTML.length){
                            me.inner = $('<div/>').addClass('display').html(me.settings.innerHTML).appendTo(prog);
                        }
                    }
                },
                circle: {
                    //set the initial position of the circle
                    setTargetPos: function(){
                        me.overallpos = me.settings.initialDeg;
                        if(me.settings.initialDeg <= 180){
                            me.currentpos = me.overallpos;
                            me.circles.circle.rotateElement(me.currentpanel,me.overallpos);
                        }
                        else {
                            var extrapos = me.settings.initialDeg - 180;
                            me.circles.circle.rotateElement(me.currentpanel,180);
                            me.currentpos = extrapos;
                            me.currentpanel = me.panel2;
                            me.circles.circle.rotateElement(me.currentpanel,extrapos);
                        }
                    },
                    //manages the rotation of the involved elements
                    rotateLoop: function(){
                        //var newpos = me.overallpos + me.settings.rotateBy;

                        if(me.currentpos > 180){
                            var nextpos = me.currentpos - 180; //to make sure the first panel has fully rotated, need to work out any leftover
                            me.circles.circle.rotateElement(me.currentpanel,180); //fully rotate the first panel
                            me.currentpos = nextpos;
                            me.currentpanel = me.panel2;
                        }

                        //if we've not finished animating, keep animating
                        if(me.overallpos <= me.settings.targetDeg){
                            me.circles.circle.rotateElement(me.currentpanel,me.currentpos);
                            me.timer = setTimeout(me.circles.circle.rotateLoop,me.settings.speed);
                        }
                        //otherwise stop and make sure we stop at the right place
                        else {
                            var endpos = me.overallpos - me.settings.targetDeg; //need to also subtract what gets added on at the end of this function
                            me.currentpos -= endpos;
                            me.overallpos -= endpos;
                            me.circles.circle.rotateElement(me.currentpanel,me.currentpos);
                        }
                        me.currentpos += me.settings.rotateBy;
                        me.overallpos += me.settings.rotateBy;
                    },
                    //check that we're not exceeding any boundaries
                    checkLimits: function(val){
                        if(val > 360){
                            return(1);
                        }
                        else if(val > 180){
                            return(2);
                        }
                        else if(val < 0){
                            return(3);
                        }
                        return(0);
                    },
                    //given an element, apply a css transform to rotate it
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
            me.circles.general.initialise();

            //option 1 - progress animates from initial to target
            if(me.settings.initialDeg && me.settings.animateOnLoad){
                me.circles.circle.setTargetPos();
                me.circles.circle.rotateLoop();
            }
            //option 2 - progress animates from 0 to target (no initial value)
            else if(me.settings.animateOnLoad){
                me.circles.circle.rotateLoop();
            }
            //option 3 - progress appears immediately at target (no initial value, no animate)
            else {
                me.circles.circle.setTargetPos();
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