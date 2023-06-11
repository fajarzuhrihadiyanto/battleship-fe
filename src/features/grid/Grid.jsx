import styles from './grid.module.css'
import useBoardStore from "../../store/useBoardStore";
import useApplicationStore from "../../store/useApplicationStore";

const Grid = ({row, col}) => {
  const draggedElement = useApplicationStore.useDraggedElement()
  const boardMap = useBoardStore.useBoardMap()
  const isAvailable = useBoardStore.useIsAvailable()
  const fill = useBoardStore.useFill()
  const ships = useBoardStore.useShips()

  const onContentDragEnter = e => {
    const color = draggedElement.getAttribute('data-color')
    const direction = draggedElement.getAttribute('data-direction')
    const size = parseInt(draggedElement.getAttribute('data-size'))

    const rowNum = parseInt(e.target.getAttribute('data-row-num'))
    const colNum = parseInt(e.target.getAttribute('data-col-num'))

    if (isAvailable(rowNum, colNum, direction, size)) {
      e.target.style.background = color
    }

    e.preventDefault()
  }
  const onContentDragLeave = e => {
    const rowNum = parseInt(e.target.getAttribute('data-row-num'))
    const colNum = parseInt(e.target.getAttribute('data-col-num'))

    if (!boardMap[rowNum][colNum]) {
      e.target.style.background = 'white'
    }
  }

  const onContentDrop = e => {
    const direction = draggedElement.getAttribute('data-direction')
    const size = parseInt(draggedElement.getAttribute('data-size'))
    const id = draggedElement.id

    const rowNum = parseInt(e.target.getAttribute('data-row-num'))
    const colNum = parseInt(e.target.getAttribute('data-col-num'))

    if (isAvailable(rowNum, colNum, direction, size)) {
      fill(rowNum, colNum, direction, size, id)
    }
    e.preventDefault()
  }

  return (
    <div
      className={styles.gridContainer}
      style={{
        gridTemplateColumns: `repeat(${col}, 1fr)`
      }}
    >
      {Array.from(Array(row * col)).map((_, i) => {

        const rowNum = Math.floor(i/col)
        const colNum = i-(rowNum * col)

        let additionalProps = {}

        if (boardMap[rowNum][colNum]) {
          additionalProps['data-id'] = boardMap[rowNum][colNum]
          additionalProps['data-size'] = ships[boardMap[rowNum][colNum]].size
          additionalProps['style'] = {backgroundColor: ships[boardMap[rowNum][colNum]].color}
          additionalProps['onDoubleClick'] = e => {
            const startRow = ships[boardMap[rowNum][colNum]].startRow
            const startCol = ships[boardMap[rowNum][colNum]].startCol
            const direction = ships[boardMap[rowNum][colNum]].direction
            const size = ships[boardMap[rowNum][colNum]].size

            fill(startRow, startCol, direction, size)
          }
        }

        return (
          <div
            key={i}
            onDragOver={onContentDragEnter} onDragLeave={onContentDragLeave} onDrop={onContentDrop}
            className={styles.gridContent}
            data-row-num={rowNum}
            data-col-num={colNum}

            {...additionalProps}
          ></div>
        )
      })}

    </div>
  )
}

export default Grid
