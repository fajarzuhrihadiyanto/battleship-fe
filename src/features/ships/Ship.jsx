import React from "react";
import styles from './ship.module.css'
import useApplicationStore from "../../store/useApplicationStore";

const Ship = ({id, size, color}) => {
  const flexDirectionOptions = ['row', 'column']
  const [currentFlexDirectionIdx, setCurrentFlexDirectionIdx] = React.useState(0)

  const setDraggedElement = useApplicationStore.useSetDraggedElement()

  const onContextMenu = e => {
    e.preventDefault()
    setCurrentFlexDirectionIdx((prev) => (prev + 1) % 2)
  }

  const dragStartHandler = e => {
    setDraggedElement(e.target)

    e.dataTransfer.dropEffect = 'move'
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      className={styles.shipContainer} id={id}
      data-size={size} data-direction={flexDirectionOptions[currentFlexDirectionIdx]} data-color={color}
      draggable={true} onDragStart={dragStartHandler}
      onContextMenu={onContextMenu}
      style={{
        flexDirection: flexDirectionOptions[currentFlexDirectionIdx]
      }}
    >
      {Array.from(Array(size)).map((_, i) => (
        <div className={styles.shipSegment} key={i} style={{backgroundColor: color}}></div>
      ))}
    </div>
  )

}

export default Ship
