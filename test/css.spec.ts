import dynamicx from '../lib/index'

describe('dynamicx.css', () => {
  test('apply css to a DOM element', () => {
    const el = document.createElement('div');
    dynamicx.css(el, {
      left: 0,
      top: "5px",
      backgroundColor: "#FF0000"
    });
    expect(el.style.left).toEqual('0px');
    expect(el.style.top).toEqual('5px');
    expect(el.style.backgroundColor).toEqual('rgb(255, 0, 0)');
  });

  test('apply transform to a DOM element', () => {
    const el = document.createElement('div');
    dynamicx.css(el, {
      translateX: 10,
      translateY: "0px",
      translateZ: "25%",
      rotateZ: "90deg",
      rotateX: 45,
      skewX: 10,
      scale: 2
    });
    expect(el.style.transform).toBe("translateX(10px) translateY(0px) translateZ(25%) rotateZ(90deg) rotateX(45deg) skewX(10deg) scaleX(2) scaleY(2) scaleZ(2)");
  });

  test('works with an array of DOM element', () => {
    const els = [
      document.createElement('div'),
      document.createElement('div')
    ];
    dynamicx.css(els, {
      left: "10px"
    });
    expect(els[0].style.left).toBe('10px');
    expect(els[1].style.left).toBe('10px');
  });

});