export interface KULTimetable {
  timeSlots: {
    longDescription: string;
    weekDay: string;
    startTime: string;
    endTime: string;
  }[];
}

/**
 * Create a fake time table object filled with fake classes.
 * @returns a TimeTable object filled with classes.
 */
export function createFakeTimetable(): KULTimetable {
  const timeTable: KULTimetable = {
    timeSlots: [
      {
        longDescription: '',
        weekDay: '',
        startTime: '',
        endTime: '',
      },
    ],
  };
  let dayOfWeek = 0;
  while (dayOfWeek <= 7) {
    let timeofDay = 0;
    while (timeofDay <= 23) {
      const description = dayOfWeek.toString() + timeofDay.toString();
      timeTable.timeSlots.push({
        longDescription: description,
        weekDay: dayOfWeek.toString() + ' ',
        startTime: formattedTime(timeofDay),
        endTime: formattedTime(timeofDay + 1),
      });
      timeofDay++;
    }
    dayOfWeek++;
  }
  timeTable.timeSlots.shift();
  return timeTable;
}

/**
 * Formats the current date as a string in the format "PT00'H'00'M'00'S'.
 * @returns The formatted time string.
 */
function formattedTime(hours: number) {
  let hoursFormat = '';
  if (hours < 10) hoursFormat = '0' + hours.toString();
  else hoursFormat = hours.toString();
  return 'PT' + hoursFormat + 'H' + '00M' + '00S';
}
