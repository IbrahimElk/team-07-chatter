export interface KULTimetable {
    timeSlots: {
        longDescription: string;
        weekDay: string;
        startTime: string;
        endTime: string;
        building: string;
    }[];
}
/**
 * Create a fake time table object filled with fake classes.
 * @returns a TimeTable object filled with classes.
 */
export declare function createFakeTimetable(): KULTimetable;
//# sourceMappingURL=fakeTimeTable.d.ts.map