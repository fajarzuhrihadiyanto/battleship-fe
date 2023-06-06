import React from "react"
import styles from './menu.module.css'
import useApplicationStore from "../../store/useApplicationStore"
import {socket} from "../../App";

const dummyRoomConfig = {
  roomCode: 'A1234',
  players: [
    {
      id: 1,
      username: 'your_username',
      isYou: true,
    },
    {
      id: 2,
      username: 'others_username'
    }
  ]
}

const Menu = () => {

  const [roomCodeInput, setRoomCodeInput] = React.useState('')
  const onRoomCodeChange = e => {
    setRoomCodeInput(e.target.value)
  }

  const [username, setUsername] = React.useState('')
  const onUsernameChange = e => {
    setUsername(e.target.value)
  }

  const onCreateRoom = () => {
    socket.emit('create_room', username)
  }

  const onJoinRoom = () => {
    socket.emit('enter_room', roomCodeInput, username)
  }

  return (
    <div className={styles.menuContainer}>
      <h1>Welcome to Battleship</h1>
      <div className={styles.optionContainer}>
        <input className={styles.input} type="text" placeholder='your username' value={username} onChange={onUsernameChange}/>
        <p align='center'>You want to ...</p>
        <button className={styles.button} onClick={onCreateRoom}>Create room</button>
        <p align='center'>or</p>
        <input className={styles.input} type='text' value={roomCodeInput} onChange={onRoomCodeChange} placeholder='room code'/>
        <button className={styles.button} onClick={onJoinRoom}>Join Room</button>
      </div>
    </div>
  )
}

export default Menu
