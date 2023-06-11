import styles from './config.module.css'
import {socket} from "../../App";
import React from "react";
import useApplicationStore from "../../store/useApplicationStore";

const PlayerList = () => {
  const roomConfig = useApplicationStore.useRoomConfig()
  const setRoomConfig = useApplicationStore.useSetRoomConfig()

  const onKick = id => {
    return () => {
      const newConfig = {...roomConfig}
      newConfig.players = newConfig.players.filter(player => player.id !== id)
      setRoomConfig(newConfig)
    }
  }

  const onLeave = () =>{
    socket.emit('leave_room', roomConfig.roomCode)
  }
  return (
    <>
      <h1>Players</h1>
      <ul>
        {roomConfig.players.map(user => (
          <li key={user.id}>{user.username} {socket.id === user.id && <b>(You)</b>} {user.ready && <>- ready</>}</li>
        ))}
      </ul>
      <button className={styles.leaveButton} onClick={onLeave}>Leave</button>
    </>
  )
}

export default PlayerList
