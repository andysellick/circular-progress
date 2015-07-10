/*
    Usage:

    Markup:

    Options:
*/
(function (window,$) {
	var Plugin = function(elem,options){
		this.elem = elem;
		this.$elem = $(elem);
		this.options = options;
		this.init(); //FIXME have to manually call the init function - not sure why
	}

	Plugin.prototype = {
		init: function(){
			var me = this;
			this.settings = $.extend({
				rotateBy: 3, //amount to change progress by in each animation frame
				animateOnLoad: 1, //FIXME?
				initialPerc: 0, //FIXME
				initialDeg: 100, //initial position on load
				targetPerc: 0, //FIXME
				targetDeg: 200, //target position to animate to on load
				speed: 50, //speed of animation
				innerHTML:'this is the inner wooo', //html to put inside the circle
                delayAnimation: 500,
			}, this.defaults, this.options);

			this.rpanel; //right
			this.lpanel; //left
			this.overallpos = 0;
			this.inner;

            //create required variables and normalise settings
            this.settings.rotateBy = Math.min(this.settings.rotateBy,360);
            this.settings.initialPerc = Math.min(this.settings.initialPerc,100);
            this.settings.targetDeg = Math.min(this.settings.targetDeg,360);
            this.rotateBy = this.settings.rotateBy; //fixme this is currently used but probably isn't needed

            //create required elements
            var prog = $('<div/>').addClass('progressinner').appendTo(this.$elem);
            var lpane = $('<div/>').addClass('lpane').appendTo(prog);
            var rpane = $('<div/>').addClass('rpane').appendTo(prog);
            this.rpanel = $('<div/>').addClass('cover').appendTo(rpane);
            this.lpanel = $('<div/>').addClass('cover').appendTo(lpane);
            if(this.settings.innerHTML.length){
                this.inner = $('<div/>').addClass('display').html(this.settings.innerHTML).appendTo(prog);
            }
            //now get the plugin started
            //option 1 - progress animates from initial to target
            var me = this;

            if(this.settings.initialDeg && this.settings.animateOnLoad){
                if(this.settings.initialDeg > this.settings.targetDeg){ //if target is less than initial, we need to rotate backwards
                    this.rotateBy = -this.rotateBy;
                }
                this.setTargetPos(this.settings.initialDeg);
                setTimeout(function(){
                    me.animateCircle(me.settings.initialDeg,me.settings.targetDeg);
                },this.settings.speed + this.settings.delayAnimation);

            }
            //option 2 - progress animates from 0 to target (no initial value)
            else if(this.settings.animateOnLoad){
                setTimeout(function(){
                    me.animateCircle(me.settings.initialDeg,me.settings.targetDeg);
                },this.settings.speed + this.settings.delayAnimation);
            }
            //option 3 - progress appears immediately at target (no initial value, no animate)
            else {
                this.setTargetPos(this.settings.initialDeg);
            }
        },
        
        //set the position of the circle, no animation
        setTargetPos: function(targ){
            this.overallpos = targ;
            this.renderCircle();
        },

        //given a starting point and an end point, animate the progress
        //self calls itself until complete
        animateCircle: function(orig,targ){
            var me = this;
            var rotateby = this.settings.rotateBy;
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
            this.overallpos = newpos;
            if(newpos != targ){
                setTimeout(function(){
                    me.animateCircle(newpos,targ);
                },this.settings.speed);
            }
            this.renderCircle();
        },

        //draws the circular progress using the current position
        renderCircle: function(){
            if(this.overallpos < 180){
                this.rotateElement(this.rpanel,this.overallpos);
                this.rotateElement(this.lpanel,0);
            }
            else {
                this.rotateElement(this.rpanel,180);
                this.rotateElement(this.lpanel,this.overallpos - 180);
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
        },

		moveProgress: function(targ){
            this.animateCircle(this.overallpos,targ);
        },

        publicf: function(){
            console.log('public');
        },

        _privateMethod: function(){
            console.log('private');
        }
	}
	$.fn.circles = function(options){
		/* syntax to use outside the plugin - http://acuriousanimal.com/blog/2013/02/25/things-i-learned-creating-a-jquery-plugin-part-ii/
            var circle = $('.element').data('circles');
            circle.publicMethod();
		*/
        if (options === undefined || typeof options === 'object') {
            //create plugin instance for each element and store reference to the plugin within the data attr
            return this.each(function() {
                if (!$.data(this, 'circles')) {
                    var myplugin = new Plugin(this, options);
                    $.data(this, 'circles', new Plugin(this, options));
                }
            });
        }
	}
	window.Plugin = Plugin;
})(window,jQuery);