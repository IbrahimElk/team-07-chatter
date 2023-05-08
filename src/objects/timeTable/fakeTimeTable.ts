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
export function createFakeTimetable(): KULTimetable {
  const timeTable: KULTimetable = {
    timeSlots: [
      {
        longDescription: '',
        weekDay: '',
        startTime: '',
        endTime: '',
        building: '',
      },
    ],
  };
  let dayOfWeek = 0;
  while (dayOfWeek <= 7) {
    let timeofDay = 0;
    while (timeofDay <= 23) {
      const description = dayOfWeek.toString() + timeofDay.toString();
      timeTable.timeSlots.push({
        longDescription: description, // SHOULD BE CHANNELID, but in this case, can also be time, has same function
        weekDay: dayOfWeek.toString() + ' ',
        startTime: formattedTime(timeofDay),
        endTime: formattedTime(timeofDay + 1),
        building: hashDescriptionToBuilding(description), // GWN GEBOUW OF AULA
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

/**
 * Hashes a class description to a building. Using the djb2 algorithm.
 * @param description The description of the class.
 * @returns A Building name.
 */
function hashDescriptionToBuilding(description: string): string {
  const buildings = [
    '200 K',
    '200 S',
    '200 M',
    '200 L',
    '200 N',
    '200 A',
    '200 C',
    '200 E',
    '200 B',
    'MONITORIAAT',
    '200 F',
    '200 H',
    'NANO',
    '200 D',
    'QUADRIVIUM',
    '200 G',
  ];
  let hash = 5381;
  for (let i = 0; i < description.length; i++) {
    hash = hash * 33 + description.charCodeAt(i);
  }
  const building = buildings[hash % buildings.length];
  if (building === undefined) throw new Error('Unknown building');
  else return building;
}
