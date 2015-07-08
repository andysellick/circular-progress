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
				rotateBy: 3, //amount to change progress by in each animation frame
				animateOnLoad: 1, //FIXME?
				initialPerc: 0, //FIXME
				initialDeg: 360, //initial position on load
				targetPerc: 0, //FIXME
				targetDeg: 0, //target position to animate to on load
				speed: 50, //speed of animation
				innerHTML:'this is the inner wooo', //html to put inside the circle
                delayAnimation: 0, //FIXME also need callbacks
			}, this.defaults, this.options);
			
			this.panel1; //right
			this.panel2; //left
			this.currentpanel;
			this.timer;
			this.currentpos = 0;
			this.overallpos = 0;
			this.inner;
			this.rotateBy = 0;

            this.circles = {
                general: {
                    //create required variables
                    initSettings: function(){
                        //normalise settings
                        me.settings.rotateBy = Math.min(me.settings.rotateBy,360);
                        me.settings.initialPerc = Math.min(me.settings.initialPerc,100);
                        me.settings.targetDeg = Math.min(me.settings.targetDeg,360);

                        me.rotateBy = me.settings.rotateBy;
                    },
                    //create required elements
                    initElements: function(){
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
                    //set the position of the circle, no animation
                    setTargetPos: function(){
                        me.overallpos = me.settings.initialDeg;
                        if(me.settings.initialDeg > 180){
                            var extrapos = me.settings.initialDeg - 180;
                            me.circles.circle.rotateElement(me.currentpanel,180);
                            me.currentpos = extrapos;
                            me.currentpanel = me.panel2;
                        }
                        else {
                            me.currentpos = me.overallpos;
                        }
                        me.circles.circle.rotateElement(me.currentpanel,me.currentpos);
                        console.log(me.currentpos);
                    },
                    //given a starting point and an end point, animate the progress
                    //self calls itself until complete
                    animateCircle: function(orig,targ){
                        var rotateby = me.settings.rotateBy;
                        if(targ < orig){
                            rotateby = -rotateby;
                        }
                        var newpos = orig + rotateby;
                        if(orig < targ){
                            newpos = Math.min(newpos,targ);
                        }
                        else {
                            newpos = Math.max(newpos,targ);
                        }
                        me.overallpos = newpos;
                        if(newpos != targ){
                            setTimeout(function(){
                                me.circles.circle.animateCircle(newpos,targ);
                            },me.settings.speed);
                        }
                        me.circles.circle.renderCircle();
                    },
                    //draws the circular progress using the current position
                    renderCircle: function(){
                        if(me.overallpos < 180){
                            me.circles.circle.rotateElement(me.panel1,me.overallpos);
                            me.circles.circle.rotateElement(me.panel2,0);
                        }
                        else {
                            me.circles.circle.rotateElement(me.panel1,180);
                            me.circles.circle.rotateElement(me.panel2,me.overallpos - 180);
                        }
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
            me.circles.general.initSettings();
            me.circles.general.initElements();

            //option 1 - progress animates from initial to target
            if(me.settings.initialDeg && me.settings.animateOnLoad){
                if(me.settings.initialDeg > me.settings.targetDeg){ //if target is less than initial, we need to rotate backwards
                    me.rotateBy = -me.rotateBy;
                }
                me.circles.circle.setTargetPos();
                setTimeout(function(){
                    me.circles.circle.animateCircle(me.settings.initialDeg,me.settings.targetDeg);
                },me.settings.speed + me.settings.delayAnimation);

            }
            //option 2 - progress animates from 0 to target (no initial value)
            else if(me.settings.animateOnLoad){
                setTimeout(function(){
                    me.circles.circle.animateCircle(me.settings.initialDeg,me.settings.targetDeg);
                },me.settings.speed + me.settings.delayAnimation);
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