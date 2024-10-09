import { CoastersModels } from '../models/coastersModels';
import { readJsonFile } from '../utils/jsonUtils';

const calculateTripsPerDay = (
  openHours: CoastersModels['openHours'],
  closeHours: CoastersModels['closeHours'],
  trackLength: CoastersModels['trackLength'],
  wagonSpeed: CoastersModels['wagons'][number]['wagonSpeed']
) => {
  const operationTimeInMinutes = calculateOperationTimeInMinutes(
    openHours,
    closeHours
  );
  const tripTimeInMinutes = trackLength / wagonSpeed / 60;
  const totalTripTimeIncludingBreak = tripTimeInMinutes + 5;

  return Math.floor(operationTimeInMinutes / totalTripTimeIncludingBreak);
};

const calculateOperationTimeInMinutes = (
  openHours: CoastersModels['openHours'],
  closeHours: CoastersModels['closeHours']
) => {
  const [openH, openM] = openHours.split(':').map(Number);
  const [closeH, closeM] = closeHours.split(':').map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  return closeMinutes >= openMinutes
    ? closeMinutes - openMinutes
    : 24 * 60 - openMinutes + closeMinutes;
};

const isCoasterOperating = (
  openHours: CoastersModels['openHours'],
  closeHours: CoastersModels['closeHours']
) => {
  const [openH, openM] = openHours.split(':').map(Number);
  const [closeH, closeM] = closeHours.split(':').map(Number);
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  return closeMinutes < openMinutes
    ? currentMinutes >= openMinutes || currentMinutes < closeMinutes
    : currentMinutes >= openMinutes && currentMinutes < closeMinutes;
};

export const monitorCoasters = () => {
  const data = readJsonFile();
  const currentTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  console.log(`[Time: ${currentTime}]`);

  for (const coasterId in data) {
    console.log('---');
    const coaster: CoastersModels = data[coasterId];

    if (!isCoasterOperating(coaster.openHours, coaster.closeHours)) {
      console.log(
        `Coaster closed (${coaster.openHours} - ${coaster.closeHours})`
      );
      continue;
    }

    if (coaster.wagons.length === 0) {
      console.warn(`No wagons for coaster with id: ${coasterId}`);
      continue;
    }

    const staffRequired = 1 + coaster.wagons.length * 2;
    const availableStaff = coaster.staffCount;
    const clientsDaily = coaster.clientCount;

    const clientsPerWagonPerDay =
      coaster.wagons[0].seatCount *
      calculateTripsPerDay(
        coaster.openHours,
        coaster.closeHours,
        coaster.trackLength,
        coaster.wagons[0].wagonSpeed
      );
    const requiredWagons = Math.max(
      1,
      Math.ceil(clientsDaily / clientsPerWagonPerDay)
    );

    console.log(
      `Operating hours: ${coaster.openHours} - ${coaster.closeHours}`
    );
    console.log(`Number of wagons: ${coaster.wagons.length}/${requiredWagons}`);
    console.log(`Available staff: ${availableStaff}/${staffRequired}`);
    console.log(`Daily clients: ${clientsDaily}`);

    if (clientsPerWagonPerDay * coaster.wagons.length >= clientsDaily * 2) {
      console.warn(
        `Excess: The coaster can serve twice the number of planned clients. Excess wagons: ${
          coaster.wagons.length - requiredWagons
        }, Excess staff: ${availableStaff - staffRequired}`
      );
    } else if (
      availableStaff < staffRequired ||
      coaster.wagons.length < requiredWagons
    ) {
      console.warn(
        `Problem: Missing ${Math.max(
          0,
          staffRequired - availableStaff
        )} staff members, missing ${Math.max(
          0,
          requiredWagons - coaster.wagons.length
        )} wagons`
      );
    } else {
      console.log('Status: OK');
    }
  }
  console.log('---');
};

setInterval(monitorCoasters, 60000);
