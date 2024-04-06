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
    fr?: number;
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
} | CSSProps;

declare interface BasePoint {
    x: number;
    y: number;
}

declare interface BezierPoint extends BasePoint {
    cp: BasePoint[];
}

declare interface CSSProps {
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
     * Documentation: https://github.com/51fe/dynamicx/#reference
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
