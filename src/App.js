import React from 'react'
import Menu from "./features/menu/Menu";
import useApplicationStore from "./store/useApplicationStore";
import Room from "./features/room/Room";
import * as socketIO from "socket.io-client";
import useBoardStore from "./store/useBoardStore";
import useGameStore from "./store/useGameStore";

export const socket = socketIO.connect(process.env.REACT_APP_SERVER_HOST);

const App = () => {
  const appState = useApplicationStore.useAppState()
  const setAppState = useApplicationStore.useSetAppState()
  const roomConfig = useApplicationStore.useRoomConfig()
  const setRoomConfig = useApplicationStore.useSetRoomConfig()
  const boardRowNum = useBoardStore.useBoardRowNum()
  const setBoardRowNum = useBoardStore.useSetBoardRowNum()
  const boardColNum = useBoardStore.useBoardColNum()
  const setBoardColNum = useBoardStore.useSetBoardColNum()
  const resetBoard = useBoardStore.useResetBoard()
  const initGame = useGameStore.useInitGame()
  const initTurn = useGameStore.useInitTurn()
  const switchTurn = useGameStore.useSwitchTurn()
  const addLog = useGameStore.useAddLog()
  const hitMyBoard = useGameStore.useHitMyBoard()
  const hitOpponentsBoard = useGameStore.useHitOpponentsBoard()
  const resetGame = useGameStore.useResetGame()

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
        || leaved_id === roomConfig.creator || appState === 'game') {
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
          initGame(boardRowNum, boardColNum)
          initTurn(response.data.first === socket.id)
          if (response.data.first === socket.id) {
            alert('game started! its your turn')
          } else {
            const username = roomConfig.players.find(player => player.id === response.data.first).username
            alert(`game started! its ${username}'s turn`)
          }
        }
      } else if (response.status === 'failed') {
        alert(response.reason)
      }
    })

    socket.on('guess_status', response => {
      console.log(response)
      if (response.status === 'success') {
        const log = response.data
        addLog(log)

        if (log.status === 'win the game') {
          if (log.guesser === socket.id) {
            alert(`you win the game`)
          } else {
            alert('opponent win the game')
          }
          setAppState('room')
          resetBoard()
          resetGame()
        } else {
          const status = log.status !== 'fail' ? 'hit' : 'miss'
          if (log.guesser === socket.id) {
            hitOpponentsBoard(log.guess_coordinate[0], log.guess_coordinate[1], status)
            alert(`you ${status} opponent's ship`)
          } else {
            hitMyBoard(log.guess_coordinate[0], log.guess_coordinate[1], status)
            alert(`opponent ${status} your ship`)
          }
          switchTurn()
        }
      } else if (response.status === 'failed') {
        alert(response.reason)
      }
    })
  }, [appState, roomConfig])

  console.log(process.env)
  return (
    <div>
      {appState === 'menu' && <Menu/>}
      {['room', 'placement', 'game'].includes(appState) && <Room/>}
    </div>
  );
}

export default App;
