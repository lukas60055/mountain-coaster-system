import { WagonsModels } from './wagonsModels';

export interface CoastersModels {
  staffCount: number;
  clientCount: number;
  trackLength: number;
  openHours: string;
  closeHours: string;
  wagons: WagonsModels[];
}
