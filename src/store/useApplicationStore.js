import {create} from "zustand";
import {devtools} from "zustand/middleware";
import {createSelectorHooks} from "auto-zustand-selectors-hook";
import zukeeper from "zukeeper";

const useApplicationStoreBase = create(
    devtools((set, get) => ({
  appState: 'menu',
  setAppState: appState => {
    set({appState})
  },
  roomConfig: null,
  setRoomConfig: roomConfig => {
    set({roomConfig})
  },
  draggedElement: null,
  setDraggedElement: draggedElement => {
    set({draggedElement})
  }
})))

const useApplicationStore =createSelectorHooks(useApplicationStoreBase)

export default useApplicationStore
