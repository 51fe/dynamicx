import dynamicx from '../lib/index'

const spinner = document.querySelector('.spinner')!
const background = document.querySelector('.background')!
const line = document.querySelector('.line')!
const tick = document.querySelector('.tick')!
const arrows = document.querySelectorAll('.arrow')!

function start() {
  // Show the spinner
  dynamicx.animate(
    spinner,
    {
      opacity: 1
    },
    {
      duration: 250,
      complete: animateLine
    }
  )

  // Fake the syncing success after 2.5s for this demo
  dynamicx.setTimeout(animateSuccess, 2600)
}

// This rotate the background (circle+arrows) indefinitely
function rotate() {
  dynamicx.animate(
    background,
    {
      rotateZ: 180,
      rotateC: 60
    },
    {
      type: dynamicx.linear,
      duration: 500,
      complete: function () {
        dynamicx.css(background, { rotateZ: 0 })
        rotate()
      }
    }
  )
}

// Animate the line
function animateLine() {
  dynamicx.animate(
    line,
    {
      strokeDasharray: '40, 117'
    },
    {
      type: dynamicx.easeInOut,
      duration: 400,
      friction: 700,
      complete: function () {
        dynamicx.animate(
          line,
          {
            strokeDasharray: '120, 37'
          },
          {
            type: dynamicx.easeInOut,
            duration: 800,
            complete: animateLine
          }
        )
      }
    }
  )
}

// Animate the success state
function animateSuccess() {
  // First, we animate the line to form a whole circle
  dynamicx.animate(
    line,
    {
      strokeDasharray: '157, 0'
    },
    {
      type: dynamicx.easeIn,
      duration: 500,
      friction: 200,
      complete: function () {
        // Then we change the line color and make it a full circle
        // by increasing the strokeWidth
        dynamicx.animate(
          line,
          {
            strokeWidth: 100,
            stroke: '#0AB000'
          },
          {
            friction: 200,
            duration: 300
          }
        )

        // We hide the arrows
        dynamicx.animate(
          arrows,
          {
            fill: '#0AB000',
            translate: 5.5,
            scale: 0.5
          },
          {
            friction: 200,
            duration: 300
          }
        )

        // Animate the tick icon
        dynamicx.animate(
          tick,
          {
            opacity: 1,
            rotateZ: 0,
            rotateC: 60
          },
          {
            type: dynamicx.spring,
            friction: 300,
            duration: 1000,
            delay: 300
          }
        )

        // Restart the whole animation for this demo
        dynamicx.setTimeout(restart, 1500)
      }
    }
  )
}

// Restart the whole animation
function restart() {
  dynamicx.animate(
    spinner,
    {
      opacity: 0
    },
    {
      duration: 250,
      complete: function () {
        // Reset css properties to originals
        dynamicx.css(tick, {
          opacity: 0,
          rotateZ: -45,
          rotateC: 60
        })
        dynamicx.css(line, {
          strokeDasharray: '120, 37',
          stroke: '#0083FF',
          strokeWidth: 10
        })
        dynamicx.css(arrows, {
          opacity: 1,
          fill: '#0083FF',
          scale: 1
        })

        // Start!
        dynamicx.setTimeout(start, 500)
      }
    }
  )
}

// Start!
start()
rotate()
