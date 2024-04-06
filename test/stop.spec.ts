import assert from 'assert';
import dynamicx from '../lib/index'

describe('dynamicx.stop', () => {
  test('actually stops current animation', (done) => {
    const el = document.createElement('div');
    let changeCanBeCalled = true;
    dynamicx.animate(el, {
      left: 100
    }, {
      duration: 100,
      type: dynamicx.easeInOut,
      change: () => {
        expect(changeCanBeCalled).toBeTruthy();
      },
      complete: () => {
        assert(false, "complete shouldn't be called");
      }
    });
    setTimeout(() => {
      dynamicx.stop(el);
      changeCanBeCalled = false;
    }, 50);
    setTimeout(() => {
      done();
    }, 150);
  });

  test('also works with a delayed animation', (done) => {
    const el = document.createElement('div');
    dynamicx.animate(el, {
      left: 100
    }, {
      duration: 100,
      delay: 100,
      change: () => {
        expect.assertions(0)
        assert(false, "change shouldn't be called");
      },
      complete: () => {
        expect.assertions(0)
        assert(false, "complete shouldn't be called");
      }
    });
    setTimeout(() => {
      dynamicx.stop(el);
    }, 50);
    setTimeout(() => {
      done();
    }, 150);
  });

  test('also works with multiple delayed animations', (done) => {
    const els = [document.createElement('div'), document.createElement('div'), document.createElement('div')];
    let delay = 100;
    for (const el of els) {
      dynamicx.animate(el, {
        left: 100
      }, {
        duration: 100,
        delay: delay,
        change: () => {
          assert(false, "change shouldn't be called");
        },
        complete: () => {
          assert(false, "complete shouldn't be called");
        }
      });
      delay += 50;
    }
    setTimeout(() => {
      for (const el of els) {
        dynamicx.stop(el);
      }
    }, 50);
    setTimeout(() => {
      done();
    }, 450);
  });
});