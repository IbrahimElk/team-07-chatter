export declare class TimeSlot {
    private CourseID;
    private startTime;
    private endTime;
    private building;
    constructor(CourseID: string, startTime: number, endTime: number, building: string);
    getDescription(): string;
    getStartTime(): number;
    getEndTime(): number;
    toJSON(): {
        description: string;
        startTime: number;
        endTime: number;
        building: string;
    };
}
export declare class Timetable {
    private timeSlots;
    constructor(timeSlots: TimeSlot[]);
    getAllCoursesId(): Array<string>;
    getTimeSlots(): TimeSlot[];
    toJSON(): Array<{
        description: string;
        startTime: number;
        endTime: number;
        building: string;
    }>;
}
//# sourceMappingURL=timeTable.d.ts.map