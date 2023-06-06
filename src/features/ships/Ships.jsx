import useBoardStore from "../../store/useBoardStore";
import Ship from "./Ship";

const Ships = () => {

  const ships = useBoardStore.useShips()

  return (
    <div>
      <h1>Ships</h1>
      <div>
        {Object.keys(ships).filter(val => !('startRow' in ships[val])).map(shipKey => (
          <Ship key={shipKey} id={shipKey} size={ships[shipKey].size} color={ships[shipKey].color}/>
        ))}
      </div>
    </div>
  )
}

export default Ships
