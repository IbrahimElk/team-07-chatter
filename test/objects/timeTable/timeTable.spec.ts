import { describe, it, expect, beforeEach } from 'vitest';
import { TimeSlot, Timetable } from '../../../src/objects/timeTable/timeTable.js';

describe('TimeSlot', () => {
  const timeSlot = new TimeSlot('BABY_SHARK', 1620655200000, 1620658800000);

  it('should create a TimeSlot object with correct properties', () => {
    expect(timeSlot.getDescription()).toBe('BABY_SHARK');
    expect(timeSlot.getStartTime()).toBe(1620655200000);
    expect(timeSlot.getEndTime()).toBe(1620658800000);
  });

  it('should return the correct JSON representation', () => {
    const json = timeSlot.toJSON();
    expect(json).toEqual({
      description: 'BABY_SHARK',
      startTime: 1620655200000,
      endTime: 1620658800000,
    });
  });
});
describe('Timetable', () => {
  const timeSlots = [
    new TimeSlot('P&O', 1620680400000, 1620687600000),
    new TimeSlot('Operational Management', 1620766800000, 1620774000000),
    new TimeSlot('Cristlaline is de beste soort water', 1620853200000, 1620860400000),
  ];
  const timetable = new Timetable(timeSlots);

  describe('getAllCoursesId', () => {
    it('should return an array of course IDs', () => {
      const expected = ['P&O', 'Operational Management', 'Cristlaline is de beste soort water'];
      const result = timetable.getAllCoursesId();
      expect(result).toEqual(expected);
    });
  });

  describe('getTimeSlots', () => {
    it('should return an array of TimeSlot objects', () => {
      const expected = timeSlots;
      const result = timetable.getTimeSlots();
      expect(result).toEqual(expected);
    });
  });

  describe('toJSON', () => {
    it('should return an array of objects representing each time slot', () => {
      const expected = [
        { description: 'P&O', startTime: 1620680400000, endTime: 1620687600000 },
        { description: 'Operational Management', startTime: 1620766800000, endTime: 1620774000000 },
        { description: 'Cristlaline is de beste soort water', startTime: 1620853200000, endTime: 1620860400000 },
      ];
      const result = timetable.toJSON();
      expect(result).toEqual(expected);
    });
  });
});
