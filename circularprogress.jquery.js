/*
    JQUERY CIRCULAR PROGRESS PLUGIN
    Usage:
        $('.element').circles();

    Markup:
        See example

    Options:
        See https://github.com/andysellick/circular-progress
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
			this.settings = $.extend({
				rotateBy: 1, //amount to change progress by in each animation frame
				initialPos: 0, //initial position on plugin load
				targetPos: 0, //target position to animate to on plugin load
				scale: 360, //sets the scale of the circle. Common uses would be to have a progress meter to show percentage progress (set this to 100) or a much smaller number of steps
				speed: 5, //speed of animation
				includeInner: 0, //if true, make the progress a 'ring' instead of a solid circle
				innerHTML:'', //html to put inside the circle
				showProgress: 0, //add an additional element into the inner to show the current position
				progPreText:'', //text to show prior to the progress output
				progPostText:'', //text to show after the progress output
                delayAnimation: 0, //how long to delay the initial animation on plugin load
                onFinishMoving: function() {}, //callback function
			}, this.defaults, this.options);

			this.rpanel; //right
			this.lpanel; //left
			this.overallpos = 0;
			this.inner;
			this.innerhtml;
			this.innerprogress;
			this.timer;

            //create required variables and normalise settings
            this.settings.rotateBy = Math.min(this.settings.rotateBy,this.settings.scale);
            this.settings.initialPos = Math.min(this.settings.initialPos,this.settings.scale);
            this.settings.targetPos = Math.min(this.settings.targetPos,this.settings.scale);
            
            //this.settings.rotateBy = this.calculateScale(this.settings.rotateBy);
            this.settings.initialPos = this.calculateScale(this.settings.initialPos);
            this.settings.targetPos = this.calculateScale(this.settings.targetPos);
            this.rotateBy = this.settings.rotateBy; //fixme this is currently used but probably isn't needed

            //create required elements
            var prog = $('<div/>').addClass('progressinner').appendTo(this.$elem);
            var lpane = $('<div/>').addClass('lpane').appendTo(prog);
            var rpane = $('<div/>').addClass('rpane').appendTo(prog);
            this.rpanel = $('<div/>').addClass('cover').appendTo(rpane);
            this.lpanel = $('<div/>').addClass('cover').appendTo(lpane);

            if(this.settings.innerHTML.length || this.settings.showProgress || this.settings.includeInner){
                this.inner = $('<div/>').addClass('display').appendTo(prog);
            }
            if(this.settings.innerHTML.length){
                this.innerhtml = $('<div/>').addClass('extrahtml').html(this.settings.innerHTML).appendTo(this.inner);
            }
            if(this.settings.showProgress){
                this.innerprogress = $('<div/>').addClass('displayprogress').appendTo(this.inner);
            }
            //now get the plugin started
            var me = this;
            //option 1 - progress animates from initial to target
            if(this.settings.initialPos && this.settings.initialPos != this.settings.targetPos){
                if(this.settings.initialPos > this.settings.targetPos){ //if target is less than initial, we need to rotate backwards
                    this.rotateBy = -this.rotateBy;
                }
                this.setTargetPos(this.settings.initialPos);
                this.timer = setTimeout(function(){
                    me.animateCircle(me.settings.initialPos,me.settings.targetPos);
                },this.settings.speed + this.settings.delayAnimation);

            }
            //option 2 - progress animates from 0 to target (no initial value)
            else if(this.settings.initialPos != this.settings.targetPos){
                this.timer = setTimeout(function(){
                    me.animateCircle(me.settings.initialPos,me.settings.targetPos);
                },this.settings.speed + this.settings.delayAnimation);
            }
            //option 3 - progress appears immediately at target (no initial value, no animate)
            else {
                this.setTargetPos(this.settings.initialPos);
            }
        },
        
        //given a scale and a position, work out actual degrees
        calculateScale: function(position){
            var multiplier = 360 / this.settings.scale;
            return(Math.ceil(position * multiplier));
        },
        convertScale: function(degrees){
            var divider = 360 / this.settings.scale;
            return(Math.floor(degrees / divider));
        },

        //set the position of the circle, no animation
        setTargetPos: function(targ){
            this.overallpos = targ;
            this.renderCircle();
        },

        //given a starting point and an end point, animate the progress
        //self calls itself until complete
        animateCircle: function(orig,targ){
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
            var me = this;
            this.overallpos = newpos;
            if(newpos != targ){
                this.timer = setTimeout(function(){
                    me.animateCircle(newpos,targ);
                },this.settings.speed);
            }
            else {
                var output = this.convertScale(this.overallpos);
                this.settings.onFinishMoving.call(this,output); //call callback
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
            if(this.settings.showProgress){
                var output = this.settings.progPreText + this.convertScale(this.overallpos) + this.settings.progPostText;
                this.innerprogress.html(output);
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

        //intended as a public function, pass through the position you want
		moveProgress: function(targ){
            clearTimeout(this.timer);
            targ = this.calculateScale(targ);
            targ = Math.min(360,targ);
            if(targ != this.overallpos){
                this.animateCircle(this.overallpos,targ);
            }
        },

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
                    $.data(this, 'circles', new Plugin(this, options));
                }
            });
        }
	}
	window.Plugin = Plugin;
})(window,jQuery);