import React, { useState, useEffect } from 'react';
import BoardManager from './components/BoardManager';
import Board from './components/Board';

function App() {
  const [boards, setBoards] = useState({});
  const [activeBoard, setActiveBoard] = useState(null);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const addBoard = (name, duration, unit) => {
    if (Object.keys(boards).length >= 5) {
      alert('🚫 Max 5 boards allowed');
      return;
    }

    if (boards[name]) {
      alert('Board name already exists');
      return;
    }

    const endDate = new Date();
    if (unit === 'week') {
      endDate.setDate(endDate.getDate() + (duration * 7));
    } else if (unit === 'month') {
      endDate.setMonth(endDate.getMonth() + duration);
    }

    const newBoard = {
      todo: [],
      inprogress: [],
      done: [],
      createdAt: new Date().toISOString(),
      duration,
      unit,
      endDate: endDate.toISOString(),
    };

    setBoards({ ...boards, [name]: newBoard });
    setActiveBoard(name);
  };

  const updateBoard = (name, newData) => {
    setBoards({ ...boards, [name]: newData });
  };

  const deleteBoard = (name) => {
    const { [name]: deleted, ...rest } = boards;
    setBoards(rest);
    if (activeBoard === name) {
      setActiveBoard(Object.keys(rest)[0] || null);
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>📌 Sprint Kanban Boards</h1>
      <BoardManager
        boards={boards}
        activeBoard={activeBoard}
        setActiveBoard={setActiveBoard}
        addBoard={addBoard}
        deleteBoard={deleteBoard}
      />

      {activeBoard ? (
        <Board
          boardData={boards[activeBoard]}
          boardName={activeBoard}
          setBoardData={(data) => updateBoard(activeBoard, data)}
        />
      ) : (
        <p style={{ textAlign: 'center', marginTop: 20 }}>Select or create a board to begin</p>
      )}
    </div>
  );
}

export default App;