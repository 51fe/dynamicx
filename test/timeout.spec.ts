import dynamicx from '../lib/index'

describe('dynamicx.setTimeout', () => {
  test('works', (done) => {
    const t = Date.now();
    dynamicx.setTimeout(() => {
      expect(Math.abs(Date.now() - t - 100)).toBeLessThan(50); // TODP
      done();
    }, 100);
  });
});

describe('dynamicx.clearTimeout', () => {
  it('works', (done) => {
    const i = dynamicx.setTimeout(() => {
      expect(false).toBeTruthy();
    }, 100);
    dynamicx.clearTimeout(i);
    setTimeout(() => {
      done();
    }, 200);
  });
});