import { Jovo } from '@jovotech/framework';
import { TableReservationData } from './TableReservationComponent';

export function extractSlotsFromEntities(
  jovo: Jovo,
  data?: TableReservationData,
): TableReservationData {
  const slots = data || {};
  if (jovo.$entities.numberOfPeople) {
    slots.numberOfPeople = extractNumberOfPeople(jovo);
  }
  if (jovo.$entities.seatingType) {
    slots.seatingType = extractSeatingType(jovo);
  }
  if (jovo.$entities.date) {
    slots.date = extractDate(jovo);
  }
  return slots;
}

export function extractNumberOfPeople(jovo: Jovo): TableReservationData['numberOfPeople'] {
  const numberOfPeople = jovo.$entities.numberOfPeople!.resolved;
  if (typeof numberOfPeople === 'string') {
    return parseInt(numberOfPeople);
  }
  return numberOfPeople;
}

export function extractSeatingType(jovo: Jovo): TableReservationData['seatingType'] {
  const seatingType = jovo.$entities.seatingType!.resolved;

  // Although the SeatingType entity type (see models/en.json) only includes the two values below,
  // NLU mismatches can happen. If there's a different value, we return undefined.
  if (seatingType !== 'inside' && seatingType !== 'outside') {
    return undefined;
  }
  return seatingType;
}

export function extractDate(jovo: Jovo): TableReservationData['date'] {
  if (!jovo.$entities.date?.resolved) {
    return undefined;
  }
  // NOTE: For simplicity, we're not checking whether the user submitted both a day and time
  const date = new Date(jovo.$entities.date.resolved);
  return date;
}
