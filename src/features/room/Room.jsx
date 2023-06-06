import styles from './room.module.css'
import useApplicationStore from "../../store/useApplicationStore";
import Board from "../board/Board";
import Config from "../config/Config";
import {socket} from "../../App";

const Room = () => {
  return (
    <div className={styles.roomContainer}>
      <Config/>
      <Board/>
    </div>
  )
}

export default Room
