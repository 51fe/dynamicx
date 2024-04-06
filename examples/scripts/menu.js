import dynamicx from '../lib/dynamicx.js'

const nav = document.querySelector('nav')
const items = document.querySelectorAll('li')

function show() {
  // Animate the popover
  dynamicx.animate(nav, {
    opacity: 1,
    scale: 1
  }, {
    type: dynamicx.spring,
    frequency: 200,
    friction: 270,
    duration: 800
  })

  // Animate each line individually
  for (var i = 0; i < items.length; i++) {
    var item = items[i]
    // Define initial properties
    dynamicx.css(item, {
      opacity: 0,
      translateY: 20
    })

    // Animate to final properties
    dynamicx.animate(item, {
      opacity: 1,
      translateY: 0
    }, {
      type: dynamicx.spring,
      frequency: 300,
      friction: 435,
      duration: 1000,
      delay: 100 + i * 40
    })
  }

  dynamicx.setTimeout(hide, 2000)
}

function hide() {
  // Animate the popover
  dynamicx.animate(nav, {
    opacity: 0,
    scale: .1
  }, {
    type: dynamicx.easeInOut,
    duration: 300,
    friction: 100
  })

  dynamicx.setTimeout(show, 1000)
}

show()