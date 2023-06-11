import {create} from "zustand";
import {devtools} from "zustand/middleware";
import {createSelectorHooks} from "auto-zustand-selectors-hook";
import zukeeper from "zukeeper";

const useBoardStoreBase = create(devtools((set, get) => ({
  boardRowNum: 7,
  setBoardRowNum: boardRowNum => {
    const boardColNum = get().boardColNum
    set({
      boardRowNum,
      boardMap: Array.from({length: boardRowNum}, e => Array(boardColNum).fill(false))
    })
  },
  boardColNum: 7,
  setBoardColNum: boardColNum => {
    const boardRowNum = get().boardRowNum
    set({
      boardColNum,
      boardMap: Array.from({length: boardRowNum}, e => Array(boardColNum).fill(false))
    })
  },
  ships: {
    destroyer: {
      size: 2,
      color: '#888'
    },
    submarine: {
      size: 3,
      color: '#f00'
    },
    cruiser: {
      size: 3,
      color: '#0f0'
    },
    battleship: {
      size: 4,
      color: '#00f'
    },
    carrier: {
      size: 5,
      color: '#ff0'
    }
  },
  boardMap: Array.from({length: 7}, e => Array(7).fill(false)),
  isAvailable: (startRow, startCol, direction, size) => {
    const boardMap = get().boardMap
    const boardRowNum = get().boardRowNum
    const boardColNum = get().boardColNum

    if (direction === 'row') {
      for (let i = startCol; i < startCol + size; i++) {
        if (boardMap[startRow][i] || i >= boardColNum) {
          return false
        }
      }
    } else {
      for (let i = startRow; i < startRow + size; i++) {
        if (boardMap[i]?.[startCol] || i >= boardRowNum) {
          return false
        }
      }
    }

    return true
  },
  fill: (startRow, startCol, direction, size, value=false) => {
    const boardMap = [...get().boardMap]
    const boardRowNum = get().boardRowNum
    const boardColNum = get().boardColNum

    const ships = {...get().ships}
    if (value) {
      ships[value]['startRow'] = startRow
      ships[value]['startCol'] = startCol
      ships[value]['direction'] = direction
    } else {
      const shipId = boardMap[startRow][startCol]
      'startRow' in ships[shipId] && delete ships[shipId].startRow
      'startCol' in ships[shipId] && delete ships[shipId].startCol
      'direction' in ships[shipId] && delete ships[shipId].direction
    }
    set({ships})

    if (direction === 'row') {
      for (let i = startCol; (i < startCol + size) && (i < boardColNum); i++) {
        boardMap[startRow][i] = value
      }
    } else {
      for (let i = startRow; (i < startRow + size) && (i < boardRowNum); i++) {
        boardMap[i][startCol] = value
      }
    }

    set({boardMap})
  },
  resetBoard: () => {
    const boardMap = [...get().boardMap]
    const ships = {...get().ships}

    Object.keys(ships).filter(val => 'startRow' in ships[val]).forEach(val => {
      const ship = ships[val]
      const startRow = ship.startRow
      const startCol = ship.startCol
      const direction = ship.direction
      const size = ship.size

      delete ships[val].startRow
      delete ships[val].startCol
      delete ships[val].direction

      if (direction === 'row') {
        for(let i = startCol; i < startCol + size; i++) {
          boardMap[startRow][i] = false
        }
      } else {
        for(let i = startRow; i < startRow + size; i++) {
          boardMap[i][startCol] = false
        }
      }
    })

    set({boardRowNum: 7, boardColNum: 7, ships, boardMap})
  }
})))

const useBoardStore = createSelectorHooks(useBoardStoreBase)

export default useBoardStore
