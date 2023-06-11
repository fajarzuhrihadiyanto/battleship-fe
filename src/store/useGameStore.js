import {create} from "zustand";
import {devtools} from "zustand/middleware";
import {createSelectorHooks} from "auto-zustand-selectors-hook";

const useGameStoreBase = create(devtools((set, get) => ({
  myBoard: [],
  opponentsBoard: [],
  initGame: (row, col) => {
    set({
      myBoard: Array.from({length: row}, e => Array(col).fill(false)),
      opponentsBoard: Array.from({length: row}, e => Array(col).fill(false)),
    })
  },
  resetGame: () => {
    set({
      myBoard: [],
      opponentsBoard: [],
      log: []
    })
  },
  hitMyBoard: (row, col, val) => {
    const newBoard = [...get().myBoard]
    newBoard[row][col] = val
    set({myBoard: newBoard})
  },
  hitOpponentsBoard: (row, col, val) => {
    const newBoard = get().opponentsBoard
    newBoard[row][col] = val
    set({opponentsBoard: newBoard})
  },
  turn: 0,
  initTurn: turn => {
    set({turn})
  },
  switchTurn: () => {
    set({turn: (get().turn + 1) % 2})
  },
  log: [],
  addLog: log => {
    set({log: [...get().log, log]})
  }
})))

const useGameStore = createSelectorHooks(useGameStoreBase)

export default useGameStore
