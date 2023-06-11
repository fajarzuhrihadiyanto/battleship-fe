import styles from './game.module.css'
import useBoardStore from "../../store/useBoardStore";
import useGameStore from "../../store/useGameStore";
import {socket} from "../../App";
import useApplicationStore from "../../store/useApplicationStore";
import Log from "../log/Log";

const Game = () => {
  const roomConfig = useApplicationStore.useRoomConfig()
  const ships = useBoardStore.useShips()
  const boardMap = useBoardStore.useBoardMap()

  const boardRowNum = useBoardStore.useBoardRowNum()
  const boardColNum = useBoardStore.useBoardColNum()
  const turn = useGameStore.useTurn()
  const board = turn ? useGameStore.useOpponentsBoard() : useGameStore.useMyBoard()

  return (
    <div>
      <h1>Board</h1>
      <div
        className={styles.gridContainer}
        style={{
          gridTemplateColumns: `repeat(${boardColNum}, 1fr)`
        }}
      >
        {Array.from(Array(boardRowNum * boardColNum)).map((_, i) => {
          const rowNum = Math.floor(i/boardColNum)
          const colNum = i-(rowNum * boardColNum)

          let additionalProps = {}

          const val = board[rowNum]?.[colNum]
          if (turn) {
            console.log(val)
            if (val) {
              additionalProps['style'] = {backgroundColor: val === 'hit' ? 'green' : 'salmon' }
            } else {
              additionalProps['onClick'] = () => {
                socket.emit('guess', roomConfig.roomCode, [rowNum, colNum])
              }
              additionalProps['style'] = {cursor: 'pointer'}
            }
          } else {
            if (boardMap[rowNum][colNum]) {
              additionalProps['style'] = {backgroundColor: ships[boardMap[rowNum][colNum]].color}
            }
          }



          return (
            <div key={i} className={styles.gridContent} {...additionalProps}>
              {val && <b>X</b>}
            </div>
          )
        })}
      </div>
      <Log/>
    </div>
  )
}

export default Game
