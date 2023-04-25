export class TimeSlot {
  private description!: string;
  private startTime!: number;
  private endTime!: number;
  // private building!: string;

  constructor(
    description: string,
    startTime: number,
    endTime: number
    // building: string
  ) {
    this.description = description;
    this.startTime = startTime;
    this.endTime = endTime;
    // this.building = building;
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

  // getBuilding(): string {
  //   return this.building;
  // }

  toJSON() {
    return {
      description: this.description,
      startTime: this.startTime,
      endTime: this.endTime,
      // building: this.building,
    };
  }
}

export class Timetable {
  private timeSlots!: TimeSlot[];

  constructor(timeSlots: TimeSlot[]) {
    this.timeSlots = timeSlots.map((timeSlot) => timeSlot);
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
