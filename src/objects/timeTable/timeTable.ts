export class TimeSlot {
  private description!: string;
  private startTime!: number;
  private endTime!: number;

  constructor(description: string, startTime: number, endTime: number) {
    this.description = description;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  getDescription(): string {
    return this.description;
  }

  getStartTime(): number {
    return this.startTime;
  }

  getEndTime(): number {
    return this.endTime;
  }

  toJSON() {
    return {
      description: this.description,
      startTime: this.startTime,
      endTime: this.endTime,
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
  toJSON(): Array<{ description: string; startTime: number; endTime: number }> {
    const arr = new Array<{ description: string; startTime: number; endTime: number }>();
    for (const element of this.timeSlots) {
      arr.push(element.toJSON());
    }
    return arr;
  }
}
