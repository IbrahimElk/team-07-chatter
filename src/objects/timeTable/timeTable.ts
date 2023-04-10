// @author Barteld Van Nieuwenhove
// @date 2023-4-4

import { z } from 'zod';
import { BuildingNames } from '../../front-end/threejs/dataToImport.js';
export type timeTable = z.infer<typeof timeTable>;

const timeTable = z.array(
  z.object({
    longDescription: z.string(),
    weekDay: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    building: z.string(),
  })
);

/**
 * Create a fake time table object filled with fake classes.
 * @returns a TimeTable object filled with classes.
 */
export function createFakeTimeTable(): timeTable {
  const timeTable: timeTable = [];
  let dayOfWeek = 0;
  while (dayOfWeek < 7) {
    let timeofDay = 0;
    while (timeofDay < 23) {
      const description = dayOfWeek.toString() + timeofDay.toString();
      timeTable.push({
        longDescription: description,
        weekDay: dayOfWeek.toString() + ' ',
        startTime: formattedTime(timeofDay),
        endTime: formattedTime(timeofDay + 1),
        building: hashDescriptionToBuilding(description),
      });
      timeofDay++;
    }
    dayOfWeek++;
  }
  return timeTable;
}

/**
 * Formats the current date as a string in the format "PTH'H'00'M'00'S'.
 * @returns The formatted time string.
 */
function formattedTime(timeofDay: number) {
  let timeFormatString = '';
  if (timeofDay < 10) timeFormatString = '0' + timeofDay.toString();
  else timeFormatString = timeofDay.toString();
  return 'PT' + timeFormatString + 'H' + '00M' + '00S';
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
 * Hashes a class description to a building name. Using the djb2 algorithm.
 * @param description The description of the class.
 * @returns A Building name.
 */
export function hashDescriptionToBuilding(description: string): string {
  const numberOfBuildings = Object.keys(BuildingNames).length / 2;
  let hash = 5381;
  for (let i = 0; i < description.length; i++) {
    hash = hash * 33 + description.charCodeAt(i);
  }
  const buildingName = Object.keys(BuildingNames)[hash % numberOfBuildings];
  if (buildingName === undefined) throw new Error('Unknown building');
  else return buildingName;
}
