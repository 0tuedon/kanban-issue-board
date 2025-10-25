import { getSeverityColor, getColumnColor } from '../colors';

describe('getSeverityColor', () => {
  it('should return green for severity 1', () => {
    expect(getSeverityColor(1)).toBe('#10b981');
  });

  it('should return amber for severity 2', () => {
    expect(getSeverityColor(2)).toBe('#f59e0b');
  });

  it('should return red for severity 3', () => {
    expect(getSeverityColor(3)).toBe('#ef4444');
  });

  it('should return red for severity greater than 3', () => {
    expect(getSeverityColor(4)).toBe('#ef4444');
    expect(getSeverityColor(10)).toBe('#ef4444');
  });
});

describe('getColumnColor', () => {
  it('should return gray for Backlog', () => {
    expect(getColumnColor('Backlog')).toBe('#6b7280');
  });

  it('should return blue for In Progress', () => {
    expect(getColumnColor('In Progress')).toBe('#3b82f6');
  });

  it('should return green for Done', () => {
    expect(getColumnColor('Done')).toBe('#10b981');
  });

  it('should return gray for unknown status', () => {
    expect(getColumnColor('Unknown' as any)).toBe('#6b7280');
  });
});

