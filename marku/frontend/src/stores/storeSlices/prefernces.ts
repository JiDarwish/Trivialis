import { type StateCreator } from 'zustand';

export interface PreferencesStateType {
  startingPoint: string;
  dateRange: Date[];
  tripName: string;
  travelerName: string;
  selectedImages: string[];
  setStartDateRangeAndTripName: (startingPoint: string, dateRange: Date[], tripName: string) => void;
  // setStartingPointAndDateRange: (startingPoint: string, dateRange: Date[]) => void;
  // setTripNameAndTravelerName: (tripName: string, travelerName: string) => void;
  // setSelectedImages: (selectedImages: string[]) => void;
}

const createPreferencesSlice: StateCreator<PreferencesStateType> = (set) => ({
  startingPoint: '',
  dateRange: [],
  tripName: '',
  travelerName: '',
  selectedImages: [],
  setStartDateRangeAndTripName: (startingPoint: string, dateRange: Date[], tripName: string) => set({ startingPoint, dateRange, tripName }),
  // setStartingPointAndDateRange: (startingPoint: string, dateRange: Date[]) => set({ startingPoint, dateRange }),
  // setTripNameAndTravelerName: (tripName: string, travelerName: string) => set({ tripName, travelerName }),
  // setSelectedImages: (selectedImages: string[]) => set({ selectedImages }),
})


export default createPreferencesSlice;
