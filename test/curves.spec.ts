import dynamicx from '../lib/index'

describe('dynamicx.linear', () => {
  test('works', () => {
    const curve = dynamicx.linear();
    expect(curve(0)).toEqual(0);
    expect(curve(0.1)).toEqual(0.1);
    expect(curve(5)).toEqual(5);
    expect(curve(5.6)).toEqual(5.6);
    expect(curve(7.8)).toEqual(7.8);
    expect(curve(1)).toEqual(1);
  });
});

describe('dynamicx.easeInOut', () => {
  test('d works', () => {
    const curve = dynamicx.easeInOut();
    expect(curve(0)).toEqual(0);
    expect(curve(0.25)).toBeGreaterThan(0);
    expect(curve(0.25)).toBeLessThan(0.5);
    expect(curve(0.5)).toEqual(0.5);
    expect(curve(0.75)).toBeGreaterThan(0.5);
    expect(curve(0.75)).toBeLessThan(1);
    expect(curve(1)).toEqual(1);
  });
});

describe('dynamicx.easeIn', () => {
  test('increases exponentially', () => {
    const curve = dynamicx.easeIn();
    let inter = 0.1;
    let diff = 0;
    for (let i = 1; i <= 10; i++) {
      const t1 = inter * (i - 1);
      const t2 = inter * i;
      const newDiff = curve(t2) - curve(t1);
      expect(newDiff).toBeGreaterThan(diff);
      diff = newDiff;
    }
  });
});

describe('dynamicx.easeOut', () => {
  test('dynamicx.easeOut increases 1/exponentially', () => {
    const curve = dynamicx.easeOut();
    let inter = 0.1;
    let diff = 1;
    for (let i = 1; i <= 10; i++) {
      const t1 = inter * (i - 1);
      const t2 = inter * i;
      const newDiff = curve(t2) - curve(t1);
      expect(newDiff).toBeLessThan(diff);
      diff = newDiff;
    }
  });
});

describe('dynamicx.bounce', () => {
  test('dynamicx.bounce starts and returns to initial state', () => {
    const curve = dynamicx.bounce();
    expect(curve(0)).toBeLessThan(0.001);
    expect(curve(0)).toBeGreaterThanOrEqual(0);
    expect(curve(1)).toBeLessThan(0.001);
    expect(curve(1)).toBeGreaterThanOrEqual(0);
  });
});

describe('dynamicx.forceWithGravity', () => {
  test('dynamicx.forceWithGravity starts and returns to initial state,', () => {
    const curve = dynamicx.forceWithGravity();
    expect(curve(0)).toBeLessThan(0.001);
    expect(curve(0)).toBeGreaterThanOrEqual(0);
    expect(curve(1)).toBeLessThan(0.001);
    expect(curve(1)).toBeGreaterThanOrEqual(0);
  });
});
