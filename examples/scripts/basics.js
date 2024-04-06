import dynamicx from '../lib/dynamicx.js'

const el = document.querySelector('#triangle')

// From purple to green
function animate1() {
  dynamicx.animate(el, {
    rotateZ: 180,
    scale: 1.5,
    borderBottomColor: 'teal'
  }, {
    type: dynamicx.spring,
    friction: 400,
    duration: 1300,
    complete: animate2
  })
}

// From green to purple
function animate2() {
  dynamicx.animate(el, {
    rotateZ: 360,
    scale: 1,
    borderBottomColor: 'darkred'
  }, {
    type: dynamicx.spring,
    frequency: 600,
    friction: 400,
    duration: 1800,
    anticipationSize: 350,
    anticipationStrength: 400,
    complete: animate1
  })
}

// Start first animation
animate1()