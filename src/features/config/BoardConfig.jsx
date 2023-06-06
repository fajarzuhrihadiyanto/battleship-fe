import styles from './config.module.css'
import React from "react";
import useBoardStore from "../../store/useBoardStore";
import useApplicationStore from "../../store/useApplicationStore";

const BoardConfig = () => {

  const appState = useApplicationStore.useAppState()

  const boardRowNum = useBoardStore.useBoardRowNum()
  const setBoardRowNum = useBoardStore.useSetBoardRowNum()
  const boardColNum = useBoardStore.useBoardColNum()
  const setBoardColNum = useBoardStore.useSetBoardColNum()

  const onRowNumChange = e => {
    setBoardRowNum(parseInt(e.target.value))
  }

  const onColNumChange = e => {
    setBoardColNum(parseInt(e.target.value))
  }
  return (
    <>
      <h1>Board</h1>
      <p>input board size</p>
      <div className={styles.boardForm}>
        <div className={styles.inputGroup}>
          <label htmlFor="rowInput">Row</label>
          <input type="number" id='rowInput' value={boardRowNum} onChange={onRowNumChange} min={5} max={10} disabled={appState !== 'room'}/>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="colInput">Column</label>
          <input type="number" id='colInput' value={boardColNum} onChange={onColNumChange} min={5} max={10} disabled={appState !== 'room'}/>
        </div>
      </div>
    </>
  )
}

export default BoardConfig
