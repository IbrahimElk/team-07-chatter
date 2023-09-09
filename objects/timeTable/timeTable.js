export class TimeSlot {
    CourseID;
    startTime;
    endTime;
    building;
    constructor(CourseID, startTime, endTime, building) {
        this.CourseID = CourseID;
        this.startTime = startTime;
        this.endTime = endTime;
        this.building = building;
    }
    getDescription() {
        return this.CourseID;
    }
    getStartTime() {
        return this.startTime;
    }
    getEndTime() {
        return this.endTime;
    }
    toJSON() {
        return {
            description: this.CourseID,
            startTime: this.startTime,
            endTime: this.endTime,
            building: this.building,
        };
    }
}
export class Timetable {
    timeSlots;
    constructor(timeSlots) {
        this.timeSlots = timeSlots.map((timeSlot) => timeSlot);
    }
    getAllCoursesId() {
        const result = [];
        for (const timeSlot of this.timeSlots) {
            result.push(timeSlot.getDescription());
        }
        return result;
    }
    getTimeSlots() {
        return this.timeSlots.map((timeSlot) => timeSlot);
    }
    toJSON() {
        const arr = new Array();
        for (const element of this.timeSlots) {
            arr.push(element.toJSON());
        }
        return arr;
    }
}
//# sourceMappingURL=timeTable.js.map