Circles
=======

A jQuery plugin to create a circular progress bar.

---

## Options

**rotateBy** - _default:_ **_1_**

The amount that the progress animation should move per frame. Leave at default for a smooth animation, increase and increase the speed for a 'stepped' animation.

**initialPos** - _default:_ **_0_**

The initial position for this instance of the plugin on page load.

**targetPos** - _default:_ **_0_**

The target position to animate to from initialPos on page load. If both options are set to the same number, the plugin will not animate on load.

**scale** - _default:_ **_360_**

Number of increments round the plugin. Default uses degrees. Other likely choices would be 100 (for a percentage) or a small number of steps e.g. 5. See 'progPreText' and 'progPostText' options for how to enhance this.

**speed** - _default:_ **_5_**

Speed of the animation in milliseconds.

**includeInner** - _default:_ **_0_**

If true, make the plugin instance a 'ring' instead of a solid circle.

**innerHTML** - _default:_ **_''_**

Any markup or text to put inside the circle. Note that if this option is set there is no need to also explicitly set the includeInner option as well.

**showProgress** - _default:_ **_0_**

Include inside the circle a changing readout showing the current position of the progress. Uses whatever scale has been set.

**progPreText** - _default:_ **_''_**

Text to put before the progress output.

**progPostText** - _default:_ **_''_**

Text to put after the progress output. For example, '%'. Or you could set the pretext to 'Step ' and the posttext to ' of 5', with a scale of 5.

**delayAnimation** - _default:_ **_0_**

Milliseconds before the animation should start on plugin load.

## Callbacks

**onFinishMoving** - called when the progress has finished moving in its current animation. Returns a value of pos, the position where it has stopped.

## Public methods

**moveProgress** - pass a value to animate the current position to a new position.

## Examples

Make a progress meter of 5 steps, loading at step 1 and animating round to step 3, with a callback when it has finished animating.

```html
<div class="progress example1"></div>

<script>
    $('.example1').circles({
        showProgress: 1,
        initialPos:1,
        targetPos:3,
        scale: 5,
        progPreText: 'Step ',
        progPostText: ' of 5',
        delayAnimation: 1000,
        onFinishMoving:function(pos){
            console.log('stopped moving at step ',pos);
        }
    });
</script>
```

See http://www.custarddoughnuts.co.uk/article/2015/8/17/jquery-circular-progress-plugin-improved for examples and code snippets.



