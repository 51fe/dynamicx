import dynamicx from '../lib/dynamicx.js'

const el = document.querySelector('path')
const textEl = document.querySelector('span')
const pathOver = el.getAttribute('data-over-path')
const pathOut = el.getAttribute('d')

// Over animation
function animateOver() {
  dynamicx.animate(el, {
    d: pathOver,
    fill: "teal"
  }, {
    type: dynamicx.spring,
    complete: animateOut
  })

  dynamicx.animate(textEl, {
    scale: 1.06
  }, {
    type: dynamicx.spring
  })
}

// Out animation
function animateOut() {
  dynamicx.animate(el, {
    d: pathOut,
    fill: "darkred"
  }, {
    type: dynamicx.easeInOut,
    friction: 100
  })

  dynamicx.animate(textEl, {
    scale: 1
  }, {
    type: dynamicx.easeInOut,
    friction: 100,
    complete: function() {
      dynamicx.setTimeout(animateOver, 500)
    }
  })
}

// Start
animateOver()