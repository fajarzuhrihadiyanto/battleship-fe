import useGameStore from "../../store/useGameStore";
import useApplicationStore from "../../store/useApplicationStore";

const Log = () => {
  const log = useGameStore.useLog()
  const roomConfig = useApplicationStore.useRoomConfig()
  const players = roomConfig.players
  return (
    <div>
      <h1>Game Log</h1>
      <div>
        {log.map((val, i) => (
          <div key={i}>
            <p>{players.find(player => player.id === val.guesser).username} guess on row {val.guess_coordinate[0]} col {val.guess_coordinate[1]} - {val.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Log
