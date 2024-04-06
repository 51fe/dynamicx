import InterpolableNumber from './InterpolableNumber'
import InterpolableString from './InterpolableString'
import Matrix from './Matrix'
import Matrix2D from './Matrix2D'
import Set from './Set'
import { createInterpolable, propertyWithPrefix } from './utils'

type VisibleFn = (isVisible: boolean) => void

type AnimateElement = Element & Dic

type Target = Element | NodeList | HTMLCollection | Element[]

type PropValue = number | string

type AnimationProps = {
  azimuth?: number;
  baseFrequency?: number;
  begin?: string;
  bias?: number;
  cx?: PropValue;
  cy?: PropValue;
  d?: string;
  diffuseConstant?: number;
  divisor?: number;
  dx?: PropValue;
  dy?: PropValue;
  elevation?: number;
  filterRes?: number;
  floodColor?: string;
  floodOpacity?: number;
  fr?: number
  fx?: number;
  fy?: number;
  gradientTransform?: string;
  letterSpacing?: PropValue;
  lightingColor?: string;
  limitingConeAngle?: number;
  k1?: number;
  k2?: number;
  k3?: number;
  k4?: number;
  markerWidth?: PropValue;
  markerHeight?: PropValue;
  numOctaves?: number;
  kernelMatrix?: string;
  kernelUnitLength?: number;
  pathLength?: number;
  patternTransform?: string;
  points?: string;
  pointsAtX?: number;
  pointsAtY?: number;
  pointsAtZ?: number;
  r?: PropValue;
  radius?: PropValue;
  rx?: PropValue;
  ry?: PropValue;
  scrollLeft?: PropValue;
  scrollRight?: PropValue;
  scrollTop?: PropValue;
  scrollBottom?: PropValue;
  seed?: number;
  specularConstant?: number;
  specularExponent?: number;
  stdDeviation?: string;
  surfaceScale?: number;
  stopColor?: string;
  stopOpacity?: number;
  textLength?: number;
  viewBox?: string;
  x?: PropValue;
  y?: PropValue;
  x1?: PropValue;
  x2?: PropValue;
  y1?: PropValue;
  y2?: PropValue;
  z?: PropValue;
} | CSSProps

interface CSSProps {
  backgroundColor?: PropValue;
  borderColor?: PropValue;
  borderLeftColor?: PropValue;
  borderRightColor?: PropValue;
  borderTopColor?: PropValue;
  borderBottomColor?: PropValue;
  bottom?: PropValue;
  color?: PropValue;
  fill?: string;
  fillOpacity?: number;
  height?: PropValue;
  left?: PropValue;
  marginTop?: PropValue;
  marginLeft?: PropValue;
  marginBottom?: PropValue;
  marginRight?: PropValue;
  maxHeight?: PropValue;
  minHeight?: PropValue;
  minWidth?: PropValue;
  maxWidth?: PropValue;
  borderRadius?: PropValue;
  opacity?: PropValue;
  paddingTop?: PropValue;
  paddingLeft?: PropValue;
  paddingBottom?: PropValue;
  paddingRight?: PropValue;
  perspective?: string;
  perspectiveX?: string;
  perspectiveY?: string;
  perspectiveZ?: string;
  right?: PropValue;
  rotate?: PropValue;
  rotateX?: PropValue;
  rotateY?: PropValue;
  rotateZ?: PropValue;
  rotateC?: PropValue;
  rotateCX?: PropValue;
  rotateCY?: PropValue;
  rotateCZ?: PropValue;
  transform?: string;
  scale?: PropValue;
  scaleX?: PropValue;
  scaleY?: PropValue;
  scaleZ?: PropValue;
  stroke?: string;
  strokeDasharray?: string;
  strokeDashoffset?: PropValue;
  StrokeOpacity?: number;
  strokeWidth?: number;
  skew?: PropValue;
  skewX?: PropValue;
  skewY?: PropValue;
  skewZ?: PropValue;
  top?: PropValue;
  translate?: PropValue;
  translateX?: PropValue;
  translateY?: PropValue;
  translateZ?: PropValue;
  width?: PropValue;
}

interface AnimationOptions {
  anticipationSize?: number
  anticipationStrength?: number
  animated?: boolean,
  bounciness?: number
  duration?: number
  delay?: number
  elasticity?: number
  friction?: number
  frequency?: number
  returnsToSelf?: boolean
  points?: BezierPoint[]
  type?: (options: any) => any
  change?: (el: Element, value: number) => void
  complete?: (el: Element) => void
}

interface AnimationType {
  el: AnimateElement
  tStart?: number
  options: AnimationOptions
  properties: {
    start: Dic
    end: Dic,
  }
  curve: {
    (t: number): number
    returnsToSelf: boolean
  }
}

interface TimeOutProps {
  id: number
  el: Target
  timeout?: boolean
}

interface RealTimeout {
  id: number
  tStart: number
  timeout?: boolean
  realTimeoutId?: number
  delay: number
  originalDelay: number
  fn: () => void
}

interface StopOptions {
  timeout?: boolean
  filter?: (timeout: TimeOutProps) => boolean
}

interface BasePoint {
  x: number
  y: number
}

interface BezierPoint extends BasePoint {
  cp: BasePoint[]
}

type Bezier = {
  (value: number): BasePoint
}

// CSS Helpers
const pxProperties = new Set('marginTop,marginLeft,marginBottom,marginRight,paddingTop,paddingLeft,paddingBottom,paddingRight,top,left,bottom,right,translateX,translateY,translateZ,perspectiveX,perspectiveY,perspectiveZ,width,height,maxWidth,maxHeight,minWidth,minHeight,borderRadius'.split(','))
const degProperties = new Set('rotate,rotateX,rotateY,rotateZ,skew,skewX,skewY,skewZ'.split(','))
const transformProperties = new Set('translate,translateX,translateY,translateZ,scale,scaleX,scaleY,scaleZ,rotate,rotateX,rotateY,rotateZ,rotateC,rotateCX,rotateCY,skew,skewX,skewY,skewZ,perspective'.split(','))
const svgProperties = new Set('cx,cy,d,dx,dy,fill,fillOpacity,filterRes,floodColor,floodOpacity,gradientTransform,height,kernelMatrix,letterSpacing,lightingColor,limitingConeAngle,markerHeight,markerWidth,numOctaves,opacity,patternTransform,points,r,rx,ry,specularConstant,specularExponent,stdDeviation,stopColor,stopOpacity,stroke,strokeWidth,strokeDashoffset,strokeOpacity,textLength,transform,viewBox,width,x,x1,x2,y,y1,y2,z'.split(','))
// SVG Helpers
const stringProperties = new Set('azimuth,baseFrequency,bias,diffuseConstant,divisor,elevation,k1,k2,k3,k4,fr,fx,fy,limitingConeAngle,pathLength,pointsAtX,pointsAtY,pointsAtZ,radius,seed,surfaceScale'.split(','))

const isDocumentVisible = () => {
  return document?.visibilityState === 'visible';
};

// Visibility change
const observeVisibilityChange = (() => {
  const fns: VisibleFn[] = []
  document?.addEventListener('visibilitychange', () => {
    const _results = [];
    for (const fn of fns) {
      _results.push(fn(isDocumentVisible()))
    }
    return _results;
  })
  return (fn: VisibleFn) => fns.push(fn)
})()

const applyFrame = (el: AnimateElement, properties: Dic) => {
  if (el.style != null) {
    return applyProperties(el, properties)
  } else {
    const _results: any[] = []
    for (const k in properties) {
      const v: any = properties[k].format()
      el[k] = v
      _results.push(v)
    }
    return _results
  }
}

const applyProperties = (el: AnimateElement, properties: Dic) => {
  properties = parseProperties(properties)
  const transforms: [string, number][] = []
  const isSVG = isSVGElement(el)
  for (const k in properties) {
    let v = properties[k]
    if (transformProperties.contains(k)) {
      transforms.push([k, v])
    } else {
      if (v.format != null) {
        v = v.format()
      }
      if (typeof v === 'number') {
        v = '' + v + unitForProperty(k)
      }
      if (el.hasAttribute(k)) {
        // Int is required for numOctaves
        if (k === 'numOctaves') {
          v = parseInt(v)
        }
        el.setAttribute(k, v)
      } else if (el.style != null) {
        el.style[propertyWithPrefix(k)] = v
      }
      if (!(el instanceof SVGElement) && k in el) { // TODO
        el[k] = v;
      }
    }
  }
  if (transforms.length > 0) {
    if (isSVG) {
      const matrix = new Matrix2D()
      matrix.applyProperties(transforms)
      el.setAttribute('transform', matrix.decompose().format())
    } else {
      const v = transforms
        .map((transform: any) => {
          return transformValueForProperty(transform[0], transform[1])
        })
        .join(' ')

      el.style[propertyWithPrefix('transform')] = v
    }
  }
}

const isSVGElement = (el: AnimateElement) => {
  return el instanceof SVGElement && !(el instanceof SVGSVGElement);
};

const unitForProperty = (k: string): string => {
  if (pxProperties.contains(k)) {
    return 'px'
  } else if (degProperties.contains(k)) {
    return 'deg'
  }
  return ''
}

const transformValueForProperty = function (k: string, v: string): string {
  let match, unit
  match = ('' + v).match(/^([0-9.-]*)([^0-9]*)$/)
  if (match != null) {
    v = match[1]
    unit = match[2]
  }
  if (unit == null || unit === '') {
    unit = unitForProperty(k)
  }
  return `${k}(${v}${unit})`
}

const parseProperties = (properties: Dic) => {
  const parsed: Dic = {}
  for (const k in properties) {
    const value = properties[k]
    if (transformProperties.contains(k)) {
      const match = k.match(/(translate|rotateC|rotate|skew|scale|perspective)(X|Y|Z|)/)
      if (match && match[2].length > 0) {
        parsed[k] = value
      } else {
        for (const axis of ['X', 'Y', 'Z']) {
          if (match?.[1]) {
            parsed[match[1] + axis] = value
          }
        }
      }
    } else {
      parsed[k] = value
    }
  }
  return parsed
}

const defaultValueForKey = (key: string): string => {
  const v = key === 'opacity' ? 1 : 0
  return `${v}${unitForProperty(key)}`
}

const getCurrentProperties = (el: AnimateElement, keys: string[]) => {
  const properties: Dic = {}
  const isSVG = isSVGElement(el);
  if (el?.style != null) {
    const style: Dic = window.getComputedStyle(el, null)
    for (let key of keys) {
      if (transformProperties.contains(key)) {
        if (properties['transform'] == null) {
          let matrix
          if (isSVG && el.transform != null) {
            matrix = new Matrix2D((el.transform as SVGAnimatedTransformList).baseVal.consolidate()?.matrix)
          } else {
            matrix = Matrix.fromTransform(style[propertyWithPrefix('transform')])
          }
          properties['transform'] = matrix.decompose()
        }
      } else {
        let v
        if (el.hasAttribute(key)) {
          v = el.getAttribute(key)
        } else if (key in el) {
          v = el[key]
        } else {
          v = style[key]
        }
        if ((v == null || key === 'd') && svgProperties.contains(key)) {
          v = el.getAttribute(key)
        }
        if (v === '' || v == null) {
          v = defaultValueForKey(key)
        }
        properties[key] = createInterpolable(v)
      }
    }
  } else {
    for (const k of keys) { // TODO
      properties[k] = createInterpolable(el[k])
    }
  }
  addUnitsToNumberInterpolables(el, properties)
  return properties
}

const addUnitsToNumberInterpolables = (el: AnimateElement, properties: Dic) => {
  for (const k in properties) {
    let interpolable = properties[k]
    if (interpolable instanceof InterpolableNumber) {
      if (el.style != null && k in el.style) {
        interpolable = new InterpolableString([interpolable, unitForProperty(k)]) // TODO
      }
    }
    properties[k] = interpolable
  }
}

let slow = false,
  slowRatio = 1


let rAF = window?.requestAnimationFrame

window?.addEventListener('keyup', e => {
  if (e.key === 'D' && e.shiftKey) {
    return dynamicx.toggleSlow()
  }
})

if (rAF == null) {
  let lastTime = 0;
  rAF = callback => {
    const currTime = Date.now()
    const timeToCall = Math.max(0, 16 - (currTime - lastTime))
    const id = window.setTimeout(() => {
      return callback(currTime + timeToCall)
    }, timeToCall)
    lastTime = currTime + timeToCall
    return id
  }
}

let runLoopRunning = false,
  runLoopPaused = false

const startRunLoop = () => {
  if (!runLoopRunning) {
    runLoopRunning = true
    return rAF(runLoopTick)
  }
}

let animations: AnimationType[] = []

const runLoopTick = (t: number) => {
  if (runLoopPaused) {
    rAF(runLoopTick)
    return
  }
  let animation: AnimationType
  const toRemoveAnimations: AnimationType[] = []
  const len = animations.length
  for (let i = 0; i < len; i++) {
    animation = animations[i]
    if (!animationTick(t, animation)) {
      toRemoveAnimations.push(animation)
    }
  }
  animations = animations.filter(item => !toRemoveAnimations.includes(item))
  if (animations.length === 0) {
    return runLoopRunning = false
  } else {
    return rAF(runLoopTick)
  }
}

const animationTick = (t: number, animation: AnimationType) => {
  if (animation.tStart === undefined) {
    animation.tStart = t
  }
  const tt = (t - animation.tStart) / animation.options.duration!
  const y: number = animation.curve(tt)
  let properties: Dic = {}

  if (tt >= 1) {
    if (animation.curve.returnsToSelf) {
      properties = animation.properties.start
    } else {
      properties = animation.properties.end
    }
  } else {
    const _ref = animation.properties.start
    for (const key in _ref) {
      const property = _ref[key]
      const end = animation.properties.end
      properties[key] = interpolate(property, end?.[key], y)
    }
  }
  applyFrame(animation.el, properties)

  const _base = animation.options
  if (typeof _base.change === 'function') {
    _base.change(animation.el, Math.min(1, tt))
  }
  if (tt >= 1) {
    const _base1 = animation.options
    if (typeof _base1.complete === 'function') {
      _base1.complete(animation.el)
    }
  }
  return tt < 1
}

const interpolate = (start: InterpolableString, end: InterpolableString, y: number) => { // TODO
  if (start.interpolate != null) {
    return start.interpolate(end, y)
  }
  return null
}

let animationsTimeouts: TimeOutProps[] = []

const startAnimation = (el: AnimateElement,
  properties: AnimationProps,
  options: AnimationOptions,
  timeoutId?: number) => {
  if (timeoutId != null) {
    animationsTimeouts = animationsTimeouts.filter(item => item.id !== timeoutId)
  }
  dynamicx.stop(el, { timeout: false })
  if (!options.animated) {
    dynamicx.css(el, properties as CSSProps)
    if (typeof options.complete === 'function') {
      options.complete(el)
    }
    return
  }
  const startProperties: Dic = getCurrentProperties(el, Object.keys(properties))
  const props: Dic = parseProperties(properties)
  const endProperties: Dic = {}
  const transforms: [string, number][] = []
  for (const k in props) {
    let v = props[k]
    if (el.style != null && transformProperties.contains(k)) {
      transforms.push([k, v])
    } else if (stringProperties.contains(k)) {
      // number conversion for some svg attrs (elevation, fx...)
      endProperties[k] = InterpolableString.create(v) // TODO
    } else {
      endProperties[k] = createInterpolable(v)
    }
  }
  if (transforms.length > 0) {
    const isSVG = isSVGElement(el)
    let matrix;
    if (isSVG) {
      matrix = new Matrix2D()
      matrix.applyProperties(transforms)
    } else if (Array.isArray(transforms)) {
      const v = transforms
        .map(transform => {
          return transformValueForProperty(transform[0], transform[1].toString())
        })
        .join(' ')
      matrix = Matrix.fromTransform(Matrix.matrixForTransform(v))
    }
    if (matrix) {
      endProperties['transform'] = matrix.decompose()
    }

    if (isSVG) {
      startProperties.transform.applyRotateCenter([
        endProperties.transform.props.rotate[1],
        endProperties.transform.props.rotate[2]
      ])
    }
  }
  addUnitsToNumberInterpolables(el, endProperties)
  if (endProperties) {
    animations.push({
      el,
      properties: {
        start: startProperties,
        end: endProperties
      },
      options,
      curve: options.type!(options)
    })
    return startRunLoop()
  }
}

let timeouts: RealTimeout[] = [],
  timeoutLastId = 0

const setRealTimeout = (timeout: RealTimeout) => {
  if (isDocumentVisible()) {
    return rAF(() => {
      if (timeouts.indexOf(timeout) !== -1) {
        return timeout.realTimeoutId = window.setTimeout(() => {
          timeout.fn()
          return cancelTimeout(timeout.id)
        }, timeout.delay)
      }
    })
  }
}

const addTimeout = (fn: () => void, delay: number) => {
  timeoutLastId += 1
  const timeout: RealTimeout = {
    id: timeoutLastId,
    tStart: Date.now(),
    fn,
    delay,
    originalDelay: delay
  }
  setRealTimeout(timeout)
  timeouts.push(timeout)
  return timeoutLastId
}

const cancelTimeout = (id: number) => {
  return (timeouts = timeouts.filter(timeout => {
    if (timeout.id === id && timeout.realTimeoutId) {
      window.clearTimeout(timeout.realTimeoutId)
    }
    return timeout.id !== id
  }))
}

const leftDelayForTimeout = (time: number, timeout: RealTimeout) => {
  let consumedDelay = 0
  if (time !== null) {
    consumedDelay = time - timeout.tStart
    return timeout.originalDelay - consumedDelay
  } else {
    return timeout.originalDelay
  }
}

// Visibility change
// Need to pause rAF and timeouts
// This is a hack for Safari to fix the case where the user does back/forward
// between this page. If this event is not listened to, it seems like safari is keeping
// the javascript state but this cause problems with setTimeout/rAF

let timeBeforeVisibilityChange = null;

observeVisibilityChange(visible => {
  runLoopPaused = !visible
  if (!visible) {
    timeBeforeVisibilityChange = Date.now()
    const _results = [];
    for (const timeout of timeouts) {
      _results.push(window.clearTimeout(timeout.realTimeoutId))
    }
    return _results
  } else {
    if (runLoopRunning) {
      const difference = Date.now() - timeBeforeVisibilityChange!
      for (const animation of animations) {
        if (animation.tStart != null) {
          animation.tStart += difference
        }
      }
    }
    for (const timeout of timeouts) {
      timeout.delay = leftDelayForTimeout(timeBeforeVisibilityChange!, timeout)
      setRealTimeout(timeout)
    }
    timeBeforeVisibilityChange = undefined
    return timeBeforeVisibilityChange
  }
})

class Dynamicx {
  /**
   * linear animation
   */
  linear = () => (t: number) => t

  /**
   * spring animation
   * @param options
   */
  spring = (options: {
    frequency?: number
    friction?: number
    anticipationSize?: number
    anticipationStrength?: number
  } = {}) => {
    const opt = {
      frequency: 300,
      friction: 200,
      anticipationSize: 0,
      anticipationStrength: 0,
      ...options
    }
    const frequency = Math.max(1, opt.frequency / 20)
    const friction = Math.pow(20, opt.friction / 100)
    const s = opt.anticipationSize / 1000
    // In case of anticipation
    const A1 = (t: number) => {
      let M, a, b, x0, x1
      M = 0.8
      x0 = s / (1 - s)
      x1 = 0
      b = (x0 - M * x1) / (x0 - x1)
      a = (M - b) / x0
      return (a * t * opt.anticipationStrength) / 100 + b
    }
    // Normal curve
    const A2 = (t: number) => {
      return Math.pow(friction / 10, -t) * (1 - t)
    }
    return (t: number) => {
      let A, At, a, angle, b, frictionT, y0, yS
      frictionT = t / (1 - s) - s / (1 - s)
      if (t < s) {
        yS = s / (1 - s) - s / (1 - s)
        y0 = 0 / (1 - s) - s / (1 - s)
        b = Math.acos(1 / A1(yS))
        a = (Math.acos(1 / A1(y0)) - b) / (frequency * -s)
        A = A1
      } else {
        A = A2
        b = 0
        a = 1
      }
      At = A(frictionT)
      angle = frequency * (t - s) * a + b
      return 1 - At * Math.cos(angle)
    }
  }

  /**
   * bounce animation
   * @param options 
   */
  bounce = (options: {
    frequency?: number
    friction?: number
    anticipationSize?: number
    anticipationStrength?: number
  } = {}) => {
    const opt = {
      frequency: 300,
      friction: 200,
      ...options
    }
    const frequency = Math.max(1, opt.frequency / 20)
    const friction = Math.pow(20, opt.friction / 100)
    const A = (t: number) => {
      return Math.pow(friction / 10, -t) * (1 - t)
    }
    const fn = (t: number) => {
      const b = -3.14 / 2
      const a = 1
      const At = A(t)
      const angle = frequency * t * a + b
      return At * Math.cos(angle)
    }
    fn.returnsToSelf = true
    return fn
  }
  /**
   * gravity animation
   * @param options
   */
  gravity = (options: {
    bounciness?: number
    elasticity?: number
    returnsToSelf?: boolean
  } = {}) => {
    const opt = {
      bounciness: 400,
      elasticity: 200,
      ...options
    }
    const bounciness = Math.min(opt.bounciness / 1250, 0.8)
    const elasticity = opt.elasticity / 1000
    const gravity = 100
    const curves: {
      a: number
      b: number
      H: number
    }[] = []
    const returnsToSelf = opt.returnsToSelf
    let L = 0
    L = (() => {
      const b = Math.sqrt(2 / gravity)
      let curve = {
        a: -b,
        b: b,
        H: 1
      }
      if (returnsToSelf) {
        curve.a = 0
        curve.b = curve.b * 2
      }
      while (curve.H > 0.001) {
        L = curve.b - curve.a
        curve = {
          a: curve.b,
          b: curve.b + L * bounciness,
          H: curve.H * bounciness * bounciness
        }
      }
      return curve.b
    })()
    const getPointInCurve = (a: number, b: number, H: number, t: number) => {
      L = b - a
      const t2 = (2 / L) * t - 1 - (a * 2) / L
      let c = t2 * t2 * H - H + 1
      if (returnsToSelf) {
        c = 1 - c
      }
      return c
    }
      ; (() => {
        let L2, b, curve, _results
        b = Math.sqrt(2 / (gravity * L * L))
        curve = {
          a: -b,
          b: b,
          H: 1
        }
        if (returnsToSelf) {
          curve.a = 0
          curve.b = curve.b * 2
        }
        curves.push(curve)
        L2 = L
        _results = []
        while (curve.b < 1 && curve.H > 0.001) {
          L2 = curve.b - curve.a
          curve = {
            a: curve.b,
            b: curve.b + L2 * bounciness,
            H: curve.H * elasticity
          }
          _results.push(curves.push(curve))
        }
        return _results
      })()
    const fn = (t: number) => {
      let curve, i, v
      i = 0
      curve = curves[i]
      while (!(t >= curve.a && t <= curve.b)) {
        i += 1
        curve = curves[i]
        if (!curve) {
          break
        }
      }
      if (!curve) {
        v = returnsToSelf ? 0 : 1
      } else {
        v = getPointInCurve(curve.a, curve.b, curve.H, t)
      }
      return v
    }
    fn.returnsToSelf = returnsToSelf
    return fn
  }

  /**
   * force with gravity
   * @param options
   */
  forceWithGravity = (options: {
    bounciness?: number
    elasticity?: number
    returnsToSelf?: boolean
  } = {}) => {
    const opt = {
      bounciness: 400,
      elasticity: 200,
      returnsToSelf: true,
      ...options
    }
    return dynamicx.gravity(opt)
  }

  /**
   * bezier animation
   * @param options 
   */
  bezier = (options: { points: BezierPoint[] }) => {
    const Bezier_ = (t: number, p0: number, p1: number, p2: number, p3: number) => {
      return (
        Math.pow(1 - t, 3) * p0 +
        3 * Math.pow(1 - t, 2) * t * p1 +
        3 * (1 - t) * Math.pow(t, 2) * p2 +
        Math.pow(t, 3) * p3
      )
    }
    const Bezier = (t: number, p0: BasePoint, p1: BasePoint, p2: BasePoint, p3: BasePoint) => {
      return {
        x: Bezier_(t, p0.x, p1.x, p2.x, p3.x),
        y: Bezier_(t, p0.y, p1.y, p2.y, p3.y)
      }
    }
    // Find the right Bezier curve first
    const yForX = (xTarget: number, Bs: Bezier[], returnsToSelf: boolean) => {
      let B: Bezier | null = null
      const len = Bs.length
      for (let i = 0; i < len; i++) {
        const aB = Bs[i]
        if (xTarget >= aB(0).x && xTarget <= aB(1).x) {
          B = aB
        }
        if (B !== null) {
          break
        }
      }
      if (!B) {
        if (returnsToSelf) {
          return 0
        } else {
          return 1
        }
      }
      // Find the percent with dichotomy
      const xTolerance = 0.0001
      let lower = 0
      let upper = 1
      let percent = (upper + lower) / 2
      let x = B(percent).x
      let i = 0
      while (Math.abs(xTarget - x) > xTolerance && i < 100) {
        if (xTarget > x) {
          lower = percent
        } else {
          upper = percent
        }
        percent = (upper + lower) / 2
        x = B(percent).x
        i += 1
      }
      // Returns y at this specific percent
      return B(percent).y
    }
    const points = options.points
    const _Bs = (() => {
      const Bs: Bezier[] = []
      const _fn = (pointA: BezierPoint, pointB: BezierPoint) => {
        const B2 = (t: number) => {
          return Bezier(t, pointA, pointA.cp[pointA.cp.length - 1], pointB.cp[0], pointB)
        }
        return Bs.push(B2)
      }
      for (const i in points) {
        const k = parseInt(i)
        if (k >= points.length - 1) {
          break
        }
        _fn(points[k], points[k + 1])
      }
      return Bs
    })()
    const fn = (t: number) => {
      if (t === 0) {
        return 0
      } else if (t === 1) {
        return 1
      } else {
        return yForX(t, _Bs, fn.returnsToSelf)
      }
    }
    fn.returnsToSelf = points[points.length - 1].y === 0
    return fn
  }

  /**
   * easeInOut animation
   * @param options 
   */
  easeInOut = (options = {}) => {
    const opt = {
      friction: 500,
      ...options
    }
    const friction = opt.friction;
    return dynamicx.bezier({
      points: [
        {
          x: 0,
          y: 0,
          cp: [
            {
              x: 0.92 - friction / 1000,
              y: 0
            }
          ]
        },
        {
          x: 1,
          y: 1,
          cp: [
            {
              x: 0.08 + friction / 1000,
              y: 1
            }
          ]
        }
      ]
    })
  }

  /**
   * easeIn animation
   * @param options 
   */
  easeIn = (options = {}) => {
    const opt = {
      friction: 500,
      ...options
    }
    const friction = opt.friction;
    return dynamicx.bezier({
      points: [
        {
          x: 0,
          y: 0,
          cp: [
            {
              x: 0.92 - friction / 1000,
              y: 0
            }
          ]
        },
        {
          x: 1,
          y: 1,
          cp: [
            {
              x: 1,
              y: 1
            }
          ]
        }
      ]
    })
  }

  /**
   * easeOut animation
   * @param options 
   * @returns 
   */
  easeOut = (options = {}) => {
    const opt = {
      friction: 500,
      ...options
    }
    const friction = opt.friction;
    return dynamicx.bezier({
      points: [
        {
          x: 0,
          y: 0,
          cp: [
            {
              x: 0,
              y: 0
            }
          ]
        },
        {
          x: 1,
          y: 1,
          cp: [
            {
              x: 0.08 + friction / 1000,
              y: 1
            }
          ]
        }
      ]
    })
  }

  /**
   * Animates an element to the properties with the animation options
   * @param el Element | NodeList | HTMLCollection | Array | Object
   * @param properties animate properties
   * @param settings animate options
   * 
   * @example 
   * 
   * ```js
   * const el = document.querySelector('#triangle')
   * dynamicx.animate(el, {
   *   rotateZ: 180,
   *   scale: 1.5,
   *   borderBottomColor: '#43F086'
   * }, {
   *   type: dynamicx.spring,
   *   friction: 400,
   *   duration: 1300,
   *   complete: animate2
   * })
   * ```
   * Documentation: https://github.com/51fe/dynamicx/#reference
   */
  animate<T = Target>(el: T,
    properties: (T extends Target ? AnimationProps : Record<string, PropValue | PropValue[]>),
    options: AnimationOptions): void {
    const fn = (el: Target, properties: AnimationProps, options: AnimationOptions) => {
      const opt = {
        type: dynamicx.easeInOut,
        duration: 1000,
        delay: 0,
        animated: true,
        ...options
      }
      opt.duration = Math.max(0, opt.duration! * slowRatio)
      opt.delay = Math.max(0, opt.delay!)
      if (opt.delay === 0) {
        return startAnimation(el as AnimateElement, properties, opt)
      } else {
        const id = dynamicx.setTimeout(() => {
          return startAnimation(el as AnimateElement, properties, opt, id)
        }, opt.delay)
        return animationsTimeouts.push({
          id,
          el
        })
      }
    }
    if (el instanceof Array && el.length) {
      el.map(item => fn(item as AnimateElement, properties, options));
    } else if (el instanceof NodeList || el instanceof HTMLCollection) {
      Array.from(el).map(item => fn(item as AnimateElement, properties, options));
    } else {
      fn(el as Element, properties, options);
    }
  }

  /**
  * This is applying the CSS properties to your element with the correct browser prefixes
  * @param el Element | NodeList | HTMLCollection | Object
  * @param properties css properties
  */
  css(el: Target, properties: CSSProps) {
    if (el instanceof Array) {
      el.map(item => applyProperties(item as AnimateElement, properties));
    } else if (el instanceof NodeList || el instanceof HTMLCollection) {
      Array.from(el).map(item => applyProperties(item as AnimateElement, properties));
    } else {
      applyProperties(el as AnimateElement, properties);
    }
  }

  /**
   * Stops the animation applied on the element
   * @param el 
   * @param options 
   */
  stop(el: Element, options: StopOptions = {}) {
    const fn = (el: Element, options: StopOptions) => {
      const opt = {
        timeout: true,
        ...options
      }
      if (opt.timeout) {
        animationsTimeouts = animationsTimeouts.filter(timeout => {
          if (timeout.el === el && ((opt.filter == null) || opt.filter(timeout))) {
            dynamicx.clearTimeout(timeout.id);
            return false;
          }
          return true;
        });
      }
      return animations = animations.filter(animation => animation.el !== el)
    }

    if (el instanceof Array) {
      el.map(item => fn(item as AnimateElement, options));
    } else if (el instanceof NodeList || el instanceof HTMLCollection) {
      Array.from(el).map(item => fn(item as AnimateElement, options));
    } else {
      fn(el as AnimateElement, options);
    }
  }

  /**
   * Defines a setTimeout
   * @param fn callback
   * @param delay milliseconds
   */
  setTimeout(fn: () => void, delay: number) {
    return addTimeout(fn, delay * slowRatio)
  }

  /**
   * Clears the timeout that was defined earlier
   * @param id timeout id
   */
  clearTimeout(id: number) {
    return cancelTimeout(id)
  }

  /**
   * Toggles a debug mode to slow down every animations and timeout
   */
  toggleSlow() {
    slow = !slow
    if (slow) {
      slowRatio = 3
    } else {
      slowRatio = 1
    }
    return console.log('dynamicx: slow animations ' + (slow ? 'enabled' : 'disabled'))
  }
}

const dynamicx = new Dynamicx()
export default dynamicx