import styles from './board.module.css'
import useBoardStore from "../../store/useBoardStore";
import Grid from "../grid/Grid";
import Ships from "../ships/Ships";
import useApplicationStore from "../../store/useApplicationStore";
import {socket} from "../../App";

const Board = () => {

  const appState = useApplicationStore.useAppState()
  const roomConfig = useApplicationStore.useRoomConfig()
  const boardRowNum = useBoardStore.useBoardRowNum()
  const boardColNum = useBoardStore.useBoardColNum()

  return (
    <div className={styles.boardContainer}>
      {appState === 'placement' && <Ships/>}
      {(socket.id === roomConfig.creator || appState === 'placement') ?
        <Grid row={boardRowNum} col={boardColNum}/>
      : <div>
          <h3>The room creator is setting up board size</h3>
        </div>}
    </div>
  )
}

export default Board
