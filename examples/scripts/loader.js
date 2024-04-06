import dynamicx from '../lib/dynamicx.js'

const colors = ['#007EFF', '#FF3700', '#92FF00']
const dots = document.querySelectorAll('.dot')

// Start the 3 dot animations with different delays
function animateDots() {
  for (let i = 0; i < dots.length; i++) {
    dynamicx.animate(
      dots[i],
      {
        translateY: -70,
        backgroundColor: colors[i]
      },
      {
        type: dynamicx.forceWithGravity,
        bounciness: 800,
        elasticity: 200,
        duration: 2000,
        delay: i * 450
      }
    )
  }

  dynamicx.setTimeout(animateDots, 2500)
}

animateDots()