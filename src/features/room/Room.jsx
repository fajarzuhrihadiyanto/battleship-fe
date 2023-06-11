import styles from './room.module.css'
import useApplicationStore from "../../store/useApplicationStore";
import Board from "../board/Board";
import Config from "../config/Config";
import {socket} from "../../App";
import Game from "../game/Game";

const Room = () => {
  const appState = useApplicationStore.useAppState()
  return (
    <div className={styles.roomContainer}>
      <Config/>
      {appState !== 'game' && <Board/>}
      {appState === 'game' && <Game/>}
    </div>
  )
}

export default Room
