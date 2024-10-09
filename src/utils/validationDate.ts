import { CoastersModels } from '../models/coastersModels';
import { WagonsModels } from '../models/wagonsModels';

export const validateCoasterData = (
  staffCount: CoastersModels['staffCount'],
  clientCount: CoastersModels['clientCount'],
  trackLength: CoastersModels['trackLength'],
  openHours: CoastersModels['openHours'],
  closeHours: CoastersModels['closeHours']
) => {
  if (
    typeof staffCount !== 'number' ||
    !Number.isInteger(staffCount) ||
    staffCount <= 0
  ) {
    return 'Invalid staff count! Must be a positive integer.';
  }

  if (
    typeof clientCount !== 'number' ||
    !Number.isInteger(clientCount) ||
    clientCount <= 0
  ) {
    return 'Invalid client count! Must be a positive integer.';
  }

  if (
    typeof trackLength !== 'number' ||
    !Number.isInteger(trackLength) ||
    trackLength <= 0
  ) {
    return 'Invalid track length! Must be a positive integer.';
  }

  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(openHours)) {
    return 'Invalid open hours! Must be in the format HH:MM.';
  }
  if (!timeRegex.test(closeHours)) {
    return 'Invalid close hours! Must be in the format HH:MM.';
  }

  return null;
};

export const validateWagonData = (
  seatCount: WagonsModels['seatCount'],
  wagonSpeed: WagonsModels['wagonSpeed']
) => {
  if (typeof seatCount !== 'number' || seatCount <= 0) {
    return 'Invalid seat count! Must be a positive number.';
  }

  if (typeof wagonSpeed !== 'number' || !Number.isFinite(wagonSpeed)) {
    return 'Invalid wagon speed! Must be a valid float value.';
  }

  return null;
};
