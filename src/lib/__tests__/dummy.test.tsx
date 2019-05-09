const sum = (a: number, b: number) => a + b;

describe('dummy test', () => {
  it('should add', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
