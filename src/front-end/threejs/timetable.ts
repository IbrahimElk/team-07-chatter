// @author Barteld Van Nieuwenhove
// @date 2023-4-4

import { getBuildings } from './layout.js';

export interface ClassProtocol {
  longDescription: string;
  startTime: number;
  endTime: number;
  building: string;
}

export interface TimeTable {
  timeSlots: {
    longDescription: string;
    weekDay: string;
    startTime: string;
    endTime: string;
  }[];
}

const TIMETABLE = createFakeTimeTable();
const classMap = new Array<ClassProtocol>();

/**
 * Create a fake time table object filled with fake classes.
 * @returns a TimeTable object filled with classes.
 */
export function createFakeTimeTable(): TimeTable {
  const timeTable: TimeTable = {
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
  while (dayOfWeek < 7) {
    let timeofDay = 0;
    while (timeofDay < 23) {
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

function populateClassMap(timeTable: TimeTable) {
  for (const timeSlot of timeTable.timeSlots) {
    const startHours = Number.parseInt(timeSlot.startTime.slice(2, 4));
    const startMinutes = Number.parseInt(timeSlot.startTime.slice(5, 7));
    const startSeconds = Number.parseInt(timeSlot.startTime.slice(8, 10));
    const startTime = new Date().setUTCHours(startHours, startMinutes, startSeconds);

    const endHours = Number.parseInt(timeSlot.endTime.slice(2, 4));
    const endMinutes = Number.parseInt(timeSlot.endTime.slice(5, 7));
    const endSeconds = Number.parseInt(timeSlot.endTime.slice(8, 10));
    const endTime = new Date().setUTCHours(endHours, endMinutes, endSeconds);

    const classRoom: ClassProtocol = {
      longDescription: timeSlot.longDescription,
      startTime: startTime,
      endTime: endTime,
      building: hashDescriptionToBuilding(timeSlot.longDescription),
    };
    classMap.push(classRoom);
  }
}

/**
 * Checks for a current ongoing Class and returns it if non ongoing it returns the upcoming one.
 * @returns
 */
export function getClass(): ClassProtocol | undefined {
  populateClassMap(TIMETABLE);
  const currentTime = Date.now();
  for (const classProtocol of classMap) {
    // if the class ends after the current time
    if (classProtocol.endTime > currentTime) {
      return classProtocol;
    }
  }
  return undefined;
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

/**
 * Creates a timetable query for the KUL API for a specific student and for just today's classes.
 * @param uNumber uNumnber of the student.
 * @returns The timetable query for the KUL API.
 */
export function generateTimeTableQuery(uNumber: string): string {
  return (
    'https://webwsq.aps.kuleuven.be/sap/opu/odata/sap/zc_ep_uurrooster_oauth_srv/users(’' +
    uNumber +
    '’)/classEvents?$filter=date eq datetime’' +
    formattedDate() +
    '’&$format=json'
  );
}

/**
 * Formats the current date as a string in the format "YYYY-M-DT00:00:00".
 * @returns The formatted date string.
 */
function formattedDate(): string {
  const currentDate = new Date();
  const isoString = currentDate.toISOString().slice(0, 19);
  const [year, month, day] = isoString.split('-');
  let formattedDate = '';
  if (year && month && day) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    formattedDate = `${year}-${month[0] === '0' ? month[1] : month}-${day[0] === '0' ? day[1] : day}T00:00:00`;
  }
  return formattedDate;
}

/**
 * Hashes a class description to a building. Using the djb2 algorithm.
 * @param description The description of the class.
 * @returns A Building name.
 */
export function hashDescriptionToBuilding(description: string): string {
  const numberOfBuildings = getBuildings().length;
  let hash = 5381;
  for (let i = 0; i < description.length; i++) {
    hash = hash * 33 + description.charCodeAt(i);
  }
  const building = getBuildings()[hash % numberOfBuildings];
  if (building === undefined) throw new Error('Unknown building');
  else return building.name;
}
