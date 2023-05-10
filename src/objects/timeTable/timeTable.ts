export class TimeSlot {
  private CourseID!: string;
  private startTime!: number;
  private endTime!: number;
  private building!: string;

  constructor(CourseID: string, startTime: number, endTime: number, building: string) {
    this.CourseID = CourseID;
    this.startTime = startTime;
    this.endTime = endTime;
    this.building = building;
  }

  getDescription(): string {
    return this.CourseID;
  }

  getStartTime(): number {
    return this.startTime;
  }

  getEndTime(): number {
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
  private timeSlots!: TimeSlot[];

  constructor(timeSlots: TimeSlot[]) {
    this.timeSlots = timeSlots.map((timeSlot) => timeSlot);
  }

  getAllCoursesId(): Array<string> {
    const result: Array<string> = [];
    for (const timeSlot of this.timeSlots) {
      result.push(timeSlot.getDescription());
    }
    return result;
  }

  getTimeSlots(): TimeSlot[] {
    return this.timeSlots.map((timeSlot) => timeSlot);
  }
  toJSON(): Array<{ description: string; startTime: number; endTime: number; building: string }> {
    const arr = new Array<{ description: string; startTime: number; endTime: number; building: string }>();
    for (const element of this.timeSlots) {
      arr.push(element.toJSON());
    }
    return arr;
  }
}
