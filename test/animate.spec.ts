import assert from 'assert';
import dynamicx from '../lib/index'

/* const matrixForTransform = (transform: string) => {
  if (transform === "translateX(50px) rotateZ(45deg)") {
    return "matrix3d(0.7071067811865476, 0.7071067811865475, 0, 0, -0.7071067811865475, 0.7071067811865476, 0, 0, 0, 0, 1, 0, 50, 0, 0, 1)";
  }
  return ''
}

const expectEqualMatrix3d = (a: string, b: string) => {
  const r = /matrix3?d?\(([-0-9, \.]*)\)/;
  const argsA = a.match(r)![1].split(',');
  const argsB = b.match(r)![1].split(',');
  for (let i = 0; i < argsA.length; i++) {
    expect(Math.abs(parseFloat(argsA[i]) - parseFloat(argsB[i]))).toBeLessThan(1);
  }
}; */

describe('dynamicx.animate', () => {
  test('animate position properties of a DOM element', (done) => {
    const el = document.createElement('div')
    dynamicx.animate(el, {
      left: 100,
      top: '50px',
      translateX: 50,
      rotateZ: 45
    }, {
      duration: 25,
      type: dynamicx.easeInOut
    })

    setTimeout(() => {
      expect(el.style.left).toBe('100px')
      expect(el.style.top).toBe('50px')
      // expectEqualMatrix3d(el.style.transform, matrixForTransform('translateX(50px) rotateZ(45deg)'))
      done()
    }, 50);
  })

  test('animate with a delay', (done) => {
    const el = document.createElement('div')
    el.style.left = '0px'

    el.attributes
    dynamicx.animate(el, {
      left: 100
    }, {
      duration: 25,
      delay: 100,
      type: dynamicx.easeInOut
    })
    setTimeout(() => {
      expect(el.style.left).toBe('0px')
    }, 50)
    setTimeout(() => {
      expect(el.style.left).not.toBe('10px')
    }, 110)
    setTimeout(() => {
      expect(el.style.left).toBe('100px')
      done()
    }, 300)
  })

  test('animate scrollTop of a DOM element', (done) => {
    const el = document.createElement('div')
    dynamicx.animate(el, {
      scrollTop: 100,
    }, {
      duration: 25,
      type: dynamicx.easeInOut
    })
    setTimeout(() => {
      expect(el.scrollTop).toBe(100)
      done()
    }, 300)
  })

  test('works with an array of elements', (done) => {
    const el1 = document.createElement('div');
    const el2 = document.createElement('div');
    const els = [el1, el2];
    let el1Asserted = false;
    let el2Asserted = false;

    dynamicx.animate(els, {
      left: 100,
    }, {
      duration: 25,
      complete: (el: Element) => {
        if (el === el1) el1Asserted = true;
        if (el === el2) el2Asserted = true;
      }
    });
    setTimeout(() => {
      expect(el1.style.left).toBe('100px');
      expect(el2.style.left).toBe('100px');
      assert(el1Asserted, "complete wasn't called with the right element");
      assert(el2Asserted, "complete wasn't called with the right element");
      done()
    }, 150)
  });

  test('calls change with progress incrementing', (done) => {
    const el = document.createElement('div');
    let savedProgress = -1;
    dynamicx.animate(el, {
      left: 100,
      top: '50px'
    }, {
      duration: 100,
      type: dynamicx.easeInOut,
      change: (_el: Element, progress: number) => {
        expect(progress).toBeGreaterThan(savedProgress);
        expect(progress).toBeGreaterThanOrEqual(0);
        expect(progress).toBeLessThanOrEqual(1);
        savedProgress = progress;
      }
    });
    setTimeout(() => {
      expect(savedProgress).toBe(1);
      done();
    }, 300);
  });

  test('actually animates properties while the animation is running', (done) => {
    const el = document.createElement('div');
    let previous = { left: 0, top: 0, transform: 'none' };
    dynamicx.animate(el, {
      left: 100,
      top: '50px',
      translateX: 50,
      rotateZ: 45
    }, {
      duration: 100,
      type: dynamicx.easeInOut
    });
    const interval = setInterval(() => {
      const current = { left: parseFloat(el.style.left), top: parseFloat(el.style.top), transform: el.style.transform };
      expect(current.left).toBeGreaterThanOrEqual(previous.left);
      expect(current.top).toBeGreaterThanOrEqual(previous.top);
      expect(current.transform !== previous.transform ||
        (current.transform === previous.transform && current.transform !== 'none'))
        .toBeTruthy();
      previous = current;
    }, 20);
    setTimeout(() => {
      clearInterval(interval);
      done();
    }, 150);
  });

  test('calls complete when the animation is over', (done) => {
    const el = document.createElement('div');
    dynamicx.animate(el, {
      left: 100,
      top: '50px'
    }, {
      duration: 25,
      complete: () => {
        done();
      }
    });
  });

  test('comes back to the original value with dynamicx.bounce', (done) => {
    const el = document.createElement('div');
    dynamicx.animate(el, {
      left: 100
    }, {
      duration: 25,
      type: dynamicx.bounce,
      complete: () => {
        expect(el.style.left).toEqual('0px');
        done();
      }
    });
  });

  test('animates the points of a svg element correctly', (done) => {
    const regex = /M([.\d]*),([.\d]*) C([.\d]*),([.\d]*)/;
    const el: HTMLElement = document.createElement('polygon');
    el.setAttribute('points', 'M101.88,22 C101.88,18.25');
    let previous = el.getAttribute('points')!.match(regex) as string[];
    dynamicx.animate(el, {
      points: 'M50,10 C88.11,20.45'
    }, {
      duration: 100
    });
    const interval = setInterval(() => {
      const current = el.getAttribute('points')!.match(regex) as string[];
      expect(current).toBeTruthy();
      expect(parseFloat(current[1])).toBeLessThanOrEqual(parseFloat(previous[1]));
      expect(parseFloat(current[2])).toBeLessThanOrEqual(parseFloat(previous[2]));
      expect(parseFloat(current[3])).toBeLessThanOrEqual(parseFloat(previous[3]));
      expect(parseFloat(current[4])).toBeGreaterThanOrEqual(parseFloat(previous[4]));
      previous = current;
    }, 20);
    setTimeout(() => {
      clearInterval(interval);
      expect(el.getAttribute('points')).toEqual('M50,10 C88.11,20.45');
      done();
    }, 150);
  });

  test('animates the points of a svg path correctly', (done) => {
    const el = document.createElement('path');

    // On chrome 52 getComputedStyle give a 'd' property for path
    // Mock window.getComputedStyle
    const style = window.getComputedStyle(el, null);
    style.setProperty('d', 'path(10 20 30)');
    const oldComputed = window.getComputedStyle;
    window.getComputedStyle = (el, pseudoElt) => style;

    el.setAttribute('d', 'M101.88,22 C101.88,18.25');
    dynamicx.animate(el, {
      d: 'M50,10 C88.11,20.45'
    }, {
      duration: 100
    });
    setTimeout(() => {
      expect(el.getAttribute('d')![0]).toBe('M');
      window.getComputedStyle = oldComputed; // remove mock to avoid conflict for the next test
      done();
    }, 150);
  });

  test('animates properties of an object correctly', (done) => {
    const assertTypes = (object: Record<string, any>) => {
      expect(typeof (object.number)).toBe('number');
      expect(typeof (object.negative)).toBe('number');
      expect(typeof (object.string)).toBe('string');
      expect(typeof (object.stringArray)).toBe('string');
      expect(Array.isArray(object.array)).toBeTruthy();
      expect(typeof (object.hexColor)).toBe('string');
      expect(typeof (object.rgbColor)).toBe('string');
      expect(typeof (object.rgbaColor)).toBe('string');
      expect(typeof (object.background)).toBe('string');
    };

    const assertFormats = (object) => {
      expect(object.stringArray.match(/^([.\d]*) ([.\d]*), d([.\d]*):([.\d]*)$/)).toBeTruthy();
      expect(String(object.array[0]).match(/^([.\d]*)deg$/)).toBeTruthy();
      expect(String(object.array[2]).match(/^([.\d]*)$/)).toBeTruthy();
      expect(String(object.array[4]).match(/^#([a-zA-Z\d]{6})$/)).toBeTruthy();
      expect(object.hexColor.match(/^#([a-zA-Z\d]{6})$/)).toBeTruthy();
      expect(object.rgbColor.match(/^rgb\(([.\d]*), ([.\d]*), ([.\d]*)\)$/)).toBeTruthy();
      expect(object.rgbaColor.match(/^rgba\(([.\d]*), ([.\d]*), ([.\d]*), ([.\d]*)\)$/)).toBeTruthy();
      expect(object.background.match(/^linear-gradient\(#([a-zA-Z\d]{6}), #([a-zA-Z\d]{6})\)$/)).toBeTruthy();
    };

    const object = {
      number: 0,
      negative: -10,
      string: '10',
      stringArray: '10 50, d10:50',
      array: ['0deg', 0, '1.10', 10, '#FFFFFF'],
      hexColor: '#FFFFFF',
      rgbColor: 'rgb(255, 255, 255)',
      rgbaColor: 'rgba(255, 255, 255, 0)',
      translateX: 0,
      rotateZ: 0,
      background: 'linear-gradient(#FFFFFF, #000000)',
    };

    let previous = JSON.parse(JSON.stringify(object));
    dynamicx.animate<object>(object, {
      number: 10,
      negative: 50,
      string: '50',
      stringArray: '100 1, d0:100',
      array: ['100deg', 40, '2.20', 20, '#123456'],
      hexColor: '#123456',
      rgbColor: 'rgb(18, 52, 86)',
      rgbaColor: 'rgba(18, 52, 86, 1)',
      translateX: 10,
      rotateZ: 1,
      background: 'linear-gradient(#FF0000, #F0F0F0)',
    }, {
      duration: 100
    });
    const interval = setInterval(() => {
      const current = JSON.parse(JSON.stringify(object));

      assertTypes(current);
      assertFormats(current);

      // Assert values are changing
      expect(current.number).toBeGreaterThanOrEqual(previous.number);
      expect(current.negative).toBeGreaterThanOrEqual(previous.negative);
      expect(parseFloat(current.string)).toBeGreaterThanOrEqual(parseFloat(previous.string));
      const stringArrayArgs = current.stringArray.match(/^([.\d]*) ([.\d]*), d([.\d]*):([.\d]*)$/);
      const previousStringArrayArgs = previous.stringArray.match(/^([.\d]*) ([.\d]*), d([.\d]*):([.\d]*)$/);
      expect(parseFloat(stringArrayArgs[1])).toBeGreaterThanOrEqual(parseFloat(previousStringArrayArgs[1]));
      expect(parseFloat(stringArrayArgs[2])).toBeLessThanOrEqual(parseFloat(previousStringArrayArgs[2]));
      expect(parseFloat(stringArrayArgs[3])).toBeLessThanOrEqual(parseFloat(previousStringArrayArgs[3]));
      expect(parseFloat(stringArrayArgs[4])).toBeGreaterThanOrEqual(parseFloat(previousStringArrayArgs[4]));

      previous = current;
    }, 20);
    setTimeout(() => {
      clearInterval(interval);
      assertTypes(object);
      assertFormats(object);

      done();
    }, 150);
  });

  test('animates actual properties of an object correctly', (done) => {
    const object: Record<string, any> = {};
    Object.defineProperty(object, 'prop', {
      set: function (v) {
        this._prop = v;
      },
      get: function () {
        return this._prop;
      }
    });
    object.prop = 1;

    dynamicx.animate(object, {
      prop: 0
    }, {
      duration: 100
    });

    let previousProp = object.prop;

    const interval = setInterval(() => {
      expect(object.prop).toBeGreaterThanOrEqual(0);
      expect(object.prop).toBeLessThanOrEqual(1);
      expect(object.prop < previousProp || object.prop === 0).toBeTruthy();

      previousProp = object.prop;
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      expect(object.prop).toBe(0);
      done();
    }, 150);
  });

  test('finishes the animation with the correct end state while using a specific bezier curve', (done) => {
    const el = document.createElement('div');
    dynamicx.animate(el, {
      left: 100,
    }, {
      duration: 25,
      type: dynamicx.bezier,
      points: [
        { 'x': 0, 'y': 0, 'cp': [{ 'x': 0, 'y': 1 }] },
        { 'x': 1, 'y': 0, 'cp': [{ 'x': 0.5, 'y': 0 }] }
      ],
      complete: () => {
        expect(el.style.left).toEqual('0px');
        done();
      }
    });
  });
})




