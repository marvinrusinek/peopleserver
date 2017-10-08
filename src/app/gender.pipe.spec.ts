import { GenderPipe } from './gender.pipe';

let pipe: GenderPipe;
beforeEach(() => {
  pipe = new GenderPipe();
});

describe('Pipe: Gender', () => {
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('converts F to Female', () => {
    expect(pipe.transform('F')).toBe('Female');
  });

  it('converts M to Male', () => {
    expect(pipe.transform('M')).toBe('Male');
  });

  it('converts X to Unknown', () => {
    expect(pipe.transform('X')).toBe('unknown');
  });
});