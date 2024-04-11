declare interface AnimationOptions {
    anticipationSize?: number;
    anticipationStrength?: number;
    animated?: boolean;
    bounciness?: number;
    duration?: number;
    delay?: number;
    elasticity?: number;
    friction?: number;
    frequency?: number;
    returnsToSelf?: boolean;
    points?: BezierPoint[];
    type?: (options: any) => any;
    change?: (el: Element, value: number) => void;
    complete?: (el: Element) => void;
}

declare type AnimationProps = {
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/azimuth */
    azimuth?: number;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/baseFrequency */
    baseFrequency?: number;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/bias */
    bias?: number;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/cx */
    cx?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/cy */
    cy?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d */
    d?: string;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/diffuseConstant */
    diffuseConstant?: number;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/divisor */
    divisor?: number;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/dx */
    dx?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/dy */
    dy?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/elevation */
    elevation?: number;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/flood-color */
    floodColor?: string;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/flood-opacity */
    floodOpacity?: number;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/fx */
    fx?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/fy */
    fy?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/gradientTransform */
    gradientTransform?: string;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/letter-spacing */
    letterSpacing?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/lighting-color */
    lightingColor?: string;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/limitingConeAngle */
    limitingConeAngle?: number;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/k1 */
    k1?: number;
    k2?: number;
    k3?: number;
    k4?: number;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/markerWidth */
    markerWidth?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/markerHeight */
    markerHeight?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/numOctaves */
    numOctaves?: number;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/kernelMatrix */
    kernelMatrix?: string;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/pathLength */
    pathLength?: number;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/patternTransform */
    patternTransform?: string;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/points */
    points?: string;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/pointsAtX */
    pointsAtX?: number;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/pointsAtY */
    pointsAtY?: number;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/pointsAtZ */
    pointsAtZ?: number;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/r */
    r?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/radius */
    radius?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/rx */
    rx?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/ry */
    ry?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollLeft */
    scrollLeft?: PropValue;
    scrollRight?: PropValue;
    scrollTop?: PropValue;
    scrollBottom?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/seed */
    seed?: number;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/specularConstant */
    specularConstant?: number;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/specularExponent */
    specularExponent?: number;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stdDeviation */
    stdDeviation?: string;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/surfaceScale */
    surfaceScale?: number;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stop-color */
    stopColor?: string;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stop-opacity */
    stopOpacity?: number;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/textLength */
    textLength?: number;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox */
    viewBox?: string;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/x */
    x?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/y */
    y?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/x1 */
    x1?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/x2 */
    x2?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/y1 */
    y1?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/y2 */
    y2?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/z */
    z?: PropValue;
} | CSSProps;

declare interface BasePoint {
    x: number;
    y: number;
}

declare interface BezierPoint extends BasePoint {
    cp: BasePoint[];
}

declare interface CSSProps {
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/background-color */
    backgroundColor?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/border-color */
    borderColor?: PropValue;
    borderLeftColor?: PropValue;
    borderRightColor?: PropValue;
    borderTopColor?: PropValue;
    borderBottomColor?: PropValue;
    bottom?: PropValue;
    color?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/fill */
    fill?: string;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/fill-opacity */
    fillOpacity?: number;
    height?: PropValue;
    left?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/margin */
    margin?: PropValue;
    marginTop?: PropValue;
    marginLeft?: PropValue;
    marginBottom?: PropValue;
    marginRight?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/max-height */
    maxHeight?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/min-height */
    minHeight?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/min-width */
    minWidth?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/max-width */
    maxWidth?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius */
    borderRadius?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/opacity */
    opacity?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/padding */
    padding?: PropValue;
    paddingTop?: PropValue;
    paddingLeft?: PropValue;
    paddingBottom?: PropValue;
    paddingRight?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/perspective */
    perspective?: string;
    perspectiveX?: string;
    perspectiveY?: string;
    perspectiveZ?: string;
    right?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/rotate */
    rotate?: PropValue;
    rotateX?: PropValue;
    rotateY?: PropValue;
    rotateZ?: PropValue;
    rotateC?: PropValue;
    rotateCX?: PropValue;
    rotateCY?: PropValue;
    rotateCZ?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/transform */
    transform?: string;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/scale */
    scale?: PropValue;
    scaleX?: PropValue;
    scaleY?: PropValue;
    scaleZ?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/stroke */
    stroke?: string;
    strokeDasharray?: string;
    strokeDashoffset?: PropValue;
    StrokeOpacity?: number;
    strokeWidth?: number;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/skew */
    skew?: PropValue;
    skewX?: PropValue;
    skewY?: PropValue;
    skewZ?: PropValue;
    top?: PropValue;
    /** MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/translate */
    translate?: PropValue;
    translateX?: PropValue;
    translateY?: PropValue;
    translateZ?: PropValue;
    width?: PropValue;
}

declare class Dynamicx {
    /**
     * linear animation
     */
    linear: () => (t: number) => number;
    /**
     * spring animation
     * @param options
     */
    spring: (options?: {
        frequency?: number;
        friction?: number;
        anticipationSize?: number;
        anticipationStrength?: number;
    }) => (t: number) => number;
    /**
     * bounce animation
     * @param options
     */
    bounce: (options?: {
        frequency?: number;
        friction?: number;
        anticipationSize?: number;
        anticipationStrength?: number;
    }) => {
        (t: number): number;
        returnsToSelf: boolean;
    };
    /**
     * gravity animation
     * @param options
     */
    gravity: (options?: {
        bounciness?: number;
        elasticity?: number;
        returnsToSelf?: boolean;
    }) => {
        (t: number): number;
        returnsToSelf: boolean | undefined;
    };
    /**
     * force with gravity
     * @param options
     */
    forceWithGravity: (options?: {
        bounciness?: number;
        elasticity?: number;
        returnsToSelf?: boolean;
    }) => {
        (t: number): number;
        returnsToSelf: boolean | undefined;
    };
    /**
     * bezier animation
     * @param options
     */
    bezier: (options: {
        points: BezierPoint[];
    }) => {
        (t: number): number;
        returnsToSelf: boolean;
    };
    /**
     * easeInOut animation
     * @param options
     */
    easeInOut: (options?: {}) => {
        (t: number): number;
        returnsToSelf: boolean;
    };
    /**
     * easeIn animation
     * @param options
     */
    easeIn: (options?: {}) => {
        (t: number): number;
        returnsToSelf: boolean;
    };
    /**
     * easeOut animation
     * @param options
     * @returns
     */
    easeOut: (options?: {}) => {
        (t: number): number;
        returnsToSelf: boolean;
    };
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
     * Doc: https://github.com/51fe/dynamicx/#reference
     */
    animate<T = Target>(el: T, properties: (T extends Target ? AnimationProps : Record<string, PropValue | PropValue[]>), options: AnimationOptions): void;
    /**
     * This is applying the CSS properties to your element with the correct browser prefixes
     * @param el Element | NodeList | HTMLCollection | Object
     * @param properties css properties
     */
    css(el: Target, properties: CSSProps): void;
    /**
     * Stops the animation applied on the element
     * @param el
     * @param options
     */
    stop(el: Element, options?: StopOptions): void;
    /**
     * Defines a setTimeout
     * @param fn callback
     * @param delay milliseconds
     */
    setTimeout(fn: () => void, delay: number): number;
    /**
     * Clears the timeout that was defined earlier
     * @param id timeout id
     */
    clearTimeout(id: number): RealTimeout[];
    /**
     * Toggles a debug mode to slow down every animations and timeout
     */
    toggleSlow(): void;
}

declare const dynamicx: Dynamicx;
export default dynamicx;

declare type PropValue = number | string;

declare interface RealTimeout {
    id: number;
    tStart: number;
    timeout?: boolean;
    realTimeoutId?: number;
    delay: number;
    originalDelay: number;
    fn: () => void;
}

declare interface StopOptions {
    timeout?: boolean;
    filter?: (timeout: TimeOutProps) => boolean;
}

declare type Target = Element | NodeList | HTMLCollection | Element[];

declare interface TimeOutProps {
    id: number;
    el: Target;
    timeout?: boolean;
}

export { }
