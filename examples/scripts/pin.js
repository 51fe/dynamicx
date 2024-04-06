import dynamicx from '../lib/dynamicx.js'

const pin = document.querySelector('.pin')
const svg = document.querySelector('.pin svg')

function horizontalBounce() {
  // The bounce animation will return to the original state
  // In this case, it will go from 0deg to -45deg to 0deg
  dynamicx.animate(pin, {
    rotateZ: -45
  }, {
    type: dynamicx.bounce,
    duration: 1800,
    complete: verticalBounce
  })
}

function verticalBounce() {
  // We animate the two elements (svg, pin) independently
  dynamicx.animate(svg, {
    scaleY: 0.8
  }, {
    type: dynamicx.bounce,
    duration: 800,
    bounciness: 0
  })

  // Use the delay option to delay your animations
  dynamicx.animate(pin, {
    translateY: -60
  }, {
    type: dynamicx.forceWithGravity,
    bounciness: 0,
    duration: 500,
    delay: 150
  })

  dynamicx.animate(svg, {
    scaleY: 0.8
  }, {
    type: dynamicx.bounce,
    duration: 800,
    bounciness: 600,
    delay: 650,
    complete: horizontalBounce
  })
}

// Start the horizontal bounce first!
horizontalBounce()