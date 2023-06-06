import React from 'react'
import Menu from "./features/menu/Menu";
import useApplicationStore from "./store/useApplicationStore";
import Room from "./features/room/Room";
import * as socketIO from "socket.io-client";
import useBoardStore from "./store/useBoardStore";

export const socket = socketIO.connect('http://localhost:3000');

const App = () => {
  const appState = useApplicationStore.useAppState()
  const setAppState = useApplicationStore.useSetAppState()
  const roomConfig = useApplicationStore.useRoomConfig()
  const setRoomConfig = useApplicationStore.useSetRoomConfig()
  const setBoardRowNum = useBoardStore.useSetBoardRowNum()
  const setBoardColNum = useBoardStore.useSetBoardColNum()
  const resetBoard = useBoardStore.useResetBoard()

  React.useEffect(() => {
    socket.once('connect', () => {
      console.log(socket)
    })

    socket.removeAllListeners()

    socket.on('create_room_status', response => {
      console.log(response)
      if (response.status === 'success') {
        setRoomConfig(response.data)
        setAppState('room')
      } else if (response.status === 'failed') {
        alert(response.reason)
      }
    })

    socket.on('enter_room_status', response => {
      console.log(response)
      if (response.status === 'success') {
        setRoomConfig(response.data)
        if (socket.id !== response.data.creator) {
          if ('boardSize' in response.data) {
            setAppState('placement')
            const [row, col] = response.data['boardSize']
            setBoardRowNum(row)
            setBoardColNum(col)
          } else {
            setAppState('room')
          }
        }
      } else if (response.status === 'failed') {
        alert(response.reason)
      }
    })

    socket.on('leave_room_status', response => {
      if (response.status === 'success') {
        const leaved_id = response.data.id
        console.log(leaved_id, socket.id)
        if (leaved_id === socket.id
        || leaved_id === roomConfig.creator) {
          setRoomConfig(null)
          setAppState('menu')
          resetBoard()
        } else {
          const newRoomConfig = {...roomConfig}
          newRoomConfig.players = newRoomConfig.players.filter(player => player.id !== leaved_id)
          setRoomConfig(newRoomConfig)
        }
      } else if (response.status === 'failed') {
        alert(response.reason)
      }
    })

    socket.on('board_setting_status', response => {
      console.log(response)
      if (response.status === 'success') {
        setBoardRowNum(response.data.row)
        setBoardColNum(response.data.col)
        setAppState('placement')
      } else if (response.status === 'failed') {
        alert(response.reason)
      }
    })

    socket.on('ship_placement_status', response => {
      console.log(response)
      if (response.status === 'success') {
        const newRoomConfig = {...roomConfig}
        newRoomConfig.players = newRoomConfig.players.map(player => {
          if (player.id === response.data.id) {
            return {
              ...player,
              ready: true
            }
          } else {
            return player
          }
        })
        setRoomConfig(newRoomConfig)

        if (response.data.first !== null) {
          setAppState('game')
          alert('game started')
        }
      } else if (response.status === 'failed') {
        alert(response.reason)
      }
    })
  }, [appState, roomConfig])


  return (
    <div>
      {appState === 'menu' && <Menu/>}
      {['room', 'placement', 'game'].includes(appState) && <Room/>}
    </div>
  );
}

export default App;
