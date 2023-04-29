import { create } from 'zustand'
import createPreferencesSlice, { type PreferencesStateType } from './storeSlices/prefernces'

// This is how you get the stores
// const store = useAppStore();

// type StoreState = ProductSlice & CartSlice
type StoreState = PreferencesStateType

export const useAppStore = create<StoreState>()((...a) => ({
  ...createPreferencesSlice(...a),
}))
