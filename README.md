# Dynamicx

Dynamicx is the ES version of dynamics.js (a JavaScript library to create physics-based animations) for better coding experience. Here are some [examples](https://51fe.github.io/dynamicx)

## Usage
Download:
- [GitHub releases](https://github.com/51fe/dynamicx/releases)
- [npm](https://www.npmjs.com/package/dynamicx): `npm install dynamicx`

import `dynamicx` into your modue:

```javascript
import dynamicx from 'dynamicx'
```

You can animate [CSS properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference) of DOM element. Here in  dynamicx, [Length properties](https://developer.mozilla.org/en-US/docs/Web/CSS/length), [transform functions](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function) are most used. For length property values, we can simply use number, the default unit is `px`. 

```javascript
var el = document.getElementById('logo')
dynamicx.animate(el, {
  translateX: 350,
  scale: 2,
  opacity: 0.5
}, {
  type: dynamicx.spring,
  frequency: 200,
  friction: 200,
  duration: 1500
})
```

You also can animate [SVG attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute).

```javascript
var path = document.querySelector('path')
dynamicx.animate(path, {
  d: 'M0,0 L0,100 L100,50 L0,0 Z',
  fill: 'red',
  rotateZ: 45,
  // rotateCX and rotateCY are the center of the rotation
  rotateCX: 100,
  rotateCY: 100
}, {
  friction: 800
})
```

And any JavaScript object.
```javascript
var o = {
  number: 10,
  color: '#FFFFFF',
  string: '10deg',
  array: [ 1, 10 ]
}
dynamicx.animate(o, {
  number: 20,
  color: '#000000',
  string: '90deg',
  array: [-9, 99 ]
})
```

## Reference
### dynamicx.animate(el, properties, options)
Animates an element to the properties with the animation options.
- `el` is a DOM element, a JavaScript object or an Array of elements
- `properties` is an object of the properties/values you want to animate
- `options` is an object representing the animation
  - `type` is the [animation type](#dynamicx-and-properties): `dynamicx.spring`, `dynamicx.easeInOut`,... (default: `dynamicx.easeInOut`)
  - `frequency`, `friction`, `bounciness`,... are specific to the animation type you are using
  - `duration` is in milliseconds (default: `1000`)
  - `delay` is in milliseconds (default: `0`)
  - `complete` (optional) is the completion callback
  - `change` (optional) is called at every change. Two arguments are passed to the function. `function(el, progress)`
    - `el` is the element it's animating
    - `progress` is the progress of the animation between 0 and 1

### dynamicx.stop(el)
Stops the animation applied on the element

### dynamicx.css(el, properties)
This is applying the CSS properties to your element with the correct browser prefixes.
- `el` is a DOM element
- `properties` is an object of the CSS properties

### dynamicx.setTimeout(fn, delay)
Dynamicx has its own `setTimeout`. The reason is that `requestAnimationFrame` and `setTimeout` have different behaviors. In most browsers, `requestAnimationFrame` will not run in a background tab while `setTimeout` will. This can cause a lot of problems while using `setTimeout` along your animations. I suggest you use Dynamicx's `setTimeout` and `clearTimeout` to handle these scenarios.
- `fn` is the callback
- `delay` is in milliseconds

Returns a unique id

### dynamicx.clearTimeout(id)
Clears a timeout that was defined earlier
- `id` is the timeout id

### dynamicx.toggleSlow()
Toggle a debug mode to slow down every animations and timeouts.
This is useful for development mode to tweak your animation.
This can be activated using `Shift + D` in the browser.

## Dynamicx and properties
### dynamicx.spring
- `frequency` default is 300
- `friction` default is 200
- `anticipationSize` (optional)
- `anticipationStrength` (optional)

### dynamicx.bounce
- `frequency` default is 300
- `friction` default is 200

### dynamicx.forceWithGravity and dynamicx.gravity
- `bounciness` default is 400
- `elasticity` default is 200

### dynamicx.easeInOut, dynamicx.easeIn and dynamicx.easeOut
- `friction` default is 500

### dynamicx.linear
No properties

### dynamicx.bezier
- `points` array of points and control points

The easiest way to output this kind of array is to use the [curve creator](https://dynamicx.netlify.app). Here is an example:

```javascript
[{x:0, y:0, cp:[{x:0.2, y:0}]},
 {x:0.5, y:-0.4, cp:[{x:0.4, y:-0.4},{x:0.8, y:-0.4}]},
 {x:1, y:1, cp:[{x:0.8,y:1}]}]
```

## Contributing
Compile: `npm run build`

Run tests: `npm test`