import React from "react";
import useApplicationStore from "../../store/useApplicationStore";
import styles from "./config.module.css";
import useBoardStore from "../../store/useBoardStore";
import {socket} from "../../App";
import PlayerList from "./PlayerList";
import BoardConfig from "./BoardConfig";

const Config = () => {
  const appState = useApplicationStore.useAppState()
  const roomConfig = useApplicationStore.useRoomConfig()
  const setRoomConfig = useApplicationStore.useSetRoomConfig()

  const ready = roomConfig.players.find(player => player.id === socket.id).ready

  const boardRowNum = useBoardStore.useBoardRowNum()
  const boardColNum = useBoardStore.useBoardColNum()
  const boardMap = useBoardStore.useBoardMap()
  const ships = useBoardStore.useShips()


  const onStartPlacing = () => {
    const newRoomConfig = {...roomConfig, boardSize: [boardRowNum, boardColNum]}
    setRoomConfig(newRoomConfig)

    socket.emit('board_setting', roomConfig.roomCode, boardRowNum, boardColNum)
  }

  const onReady = () => {
    if (Object.keys(ships).every(shipKey => 'startRow' in ships[shipKey])) {
      const newRoomConfig = {...roomConfig}
      newRoomConfig.players = newRoomConfig.players.map(player => {
        if (player.id === socket.id) {
          return {
            ...player,
            ready: true
          }
        } else {
          return player
        }
      })
      socket.emit('ship_placement', roomConfig.roomCode, boardMap)
    } else {
      alert('put all ships in the board')
    }
  }

  const onCancel = () => {
    // setIsReady(false)
  }

  return (
    <div className={styles.configContainer}>
      <p>room code : <b>{roomConfig.roomCode}</b></p>

      <PlayerList/>

      {socket.id === roomConfig.creator && <BoardConfig/>}

      {appState === 'room' && socket.id === roomConfig.creator && <button className={styles.startPlacingButton} onClick={onStartPlacing}>Start Placing</button>}
      {appState === 'placement' &&  (!ready
        ? <button className={styles.startPlacingButton} onClick={onReady}>Ready</button>
        : <button className={styles.backButton} onClick={onCancel}>Cancel</button>)}
    </div>
  )

}

export default Config
