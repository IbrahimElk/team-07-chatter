// @author Barteld Van Nieuwenhove
// @date 2023-4-4

import type { Timetable } from '../../objects/timeTable/timeTable.js';
import type { KULTimetable } from '../../objects/timeTable/fakeTimeTable.js';
import type { User } from '../../objects/user/user.js';
/**
 * Checks for a current ongoing Class and returns it if non ongoing it returns the upcoming one.
 * @returns
 */
export function requestTimetable(user: User, data: KULTimetable): undefined | Timetable {
  user.updateTimeTable(data);
  const timeTable: Timetable | undefined = user.getTimeTable();
  return timeTable;
}
