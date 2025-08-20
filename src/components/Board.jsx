import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';
import TaskModal from './TaskModal';
import { v4 as uuidv4 } from 'uuid';

const COLUMN_IDS = {
  TODO: 'todo',
  IN_PROGRESS: 'inprogress',
  DONE: 'done',
};

const COLUMN_TITLES = {
  [COLUMN_IDS.TODO]: 'To Do',
  [COLUMN_IDS.IN_PROGRESS]: 'In Progress',
  [COLUMN_IDS.DONE]: 'Done',
};

const Board = ({ boardData, boardName, setBoardData }) => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingColumn, setEditingColumn] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);


  const columns = boardData || {};

  // Initialize board structure if empty
  useEffect(() => {
    const needsInitialization = !columns.todo || !columns.inprogress || !columns.done;
    
    if (needsInitialization) {
      const initializedData = {
        ...boardData,
        todo: Array.isArray(columns.todo) ? columns.todo : [],
        inprogress: Array.isArray(columns.inprogress) ? columns.inprogress : [],
        done: Array.isArray(columns.done) ? columns.done : [],
      };
      setBoardData(initializedData);
      setIsInitialized(true);
    } else {
      setIsInitialized(true);
    }
  }, [columns, setBoardData, boardData]);

// Handle task timer notifications
  useEffect(() => {
    const checkTimers = () => {
      Object.entries(columns).forEach(([columnId, tasks]) => {
        if (Array.isArray(tasks)) {
          tasks.forEach(task => {
            if (task.timerEnd && task.timerActive) {
              const now = new Date();
              const endTime = new Date(task.timerEnd);
              const timeDiff = endTime - now;
              
              // Notify 5 minutes before
              if (timeDiff <= 5 * 60 * 1000 && timeDiff > 4 * 60 * 1000) {
                if ('Notification' in window && Notification.permission === 'granted') {
                  new Notification(`Task Timer Warning`, {
                    body: `"${task.title}" will end in 5 minutes!`,
                    icon: '⏰'
                  });
                }
              }
              
              // Notify when time is up
              if (timeDiff <= 0) {
                if ('Notification' in window && Notification.permission === 'granted') {
                  new Notification(`Task Timer Complete`, {
                    body: `Time is up for "${task.title}"!`,
                    icon: '⏰'
                  });
                }
                
                // Deactivate timer
                updateTask(task.id, columnId, { ...task, timerActive: false });
              }
            }
          });
        }
      });
    };

    const interval = setInterval(checkTimers, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [columns]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    // Ensure columns exist and are arrays
    const sourceColumn = Array.isArray(columns[source.droppableId]) ? columns[source.droppableId] : [];
    const destColumn = Array.isArray(columns[destination.droppableId]) ? columns[destination.droppableId] : [];

    // Handle same column reordering
    if (source.droppableId === destination.droppableId) {
      const reorderedTasks = Array.from(sourceColumn);
      const [movedTask] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, movedTask);

    setBoardData({
        ...columns,
        [source.droppableId]: reorderedTasks,
      });
    } else {
      // Handle moving between different columns
      const sourceTasks = Array.from(sourceColumn);
      const destTasks = Array.from(destColumn);
      const [movedTask] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, movedTask);

      setBoardData({
        ...columns,
        [source.droppableId]: sourceTasks,
        [destination.droppableId]: destTasks,
      });
    }
  };

  const addTask = () => {
    setEditingTask(null);
    setEditingColumn(COLUMN_IDS.TODO);
    setShowTaskModal(true);
  };

  const editTask = (task, columnId) => {
    setEditingTask(task);
    setEditingColumn(columnId);
    setShowTaskModal(true);
  };

  const saveTask = (taskData) => {
    if (editingTask) {
      // Update existing task
      updateTask(editingTask.id, editingColumn, taskData);
    } else {
      // Add new task
      const newTask = {
        id: uuidv4(),
        ...taskData,
        createdAt: new Date().toISOString(),
      };

      const todoTasks = Array.isArray(columns[COLUMN_IDS.TODO]) ? columns[COLUMN_IDS.TODO] : [];
      setBoardData({
        ...columns,
        [COLUMN_IDS.TODO]: [...todoTasks, newTask],
      });
    }
    setShowTaskModal(false);
  };

  const updateTask = (taskId, columnId, updatedTask) => {
    if (!Array.isArray(columns[columnId])) return;
    
    const updatedTasks = columns[columnId].map((task) => 
      task.id === taskId ? updatedTask : task
    );

    setBoardData({
      ...columns,
      [columnId]: updatedTasks,
    });
  };

  const deleteTask = (taskId, columnId) => {
    if (!Array.isArray(columns[columnId])) return;
    
    const updatedTasks = columns[columnId].filter(task => task.id !== taskId);
    setBoardData({
      ...columns,
      [columnId]: updatedTasks,
    });
  };

  const addComment = (taskId, columnId, comment) => {
    if (!Array.isArray(columns[columnId])) return;
    
    const updatedTasks = columns[columnId].map((task) => {
      if (task.id === taskId) {
        return { 
          ...task, 
          comments: [...(task.comments || []), {
            id: uuidv4(),
            text: comment,
            createdAt: new Date().toISOString()
          }]
        };
      }
      return task;
    });

    setBoardData({
      ...columns,
      [columnId]: updatedTasks,
    });
  };

  const startTimer = (taskId, columnId, minutes) => {
    const endTime = new Date();
    endTime.setMinutes(endTime.getMinutes() + minutes);
    
    updateTask(taskId, columnId, {
      ...columns[columnId].find(t => t.id === taskId),
      timerStart: new Date().toISOString(),
      timerEnd: endTime.toISOString(),
      timerDuration: minutes,
      timerActive: true
    });
  };

  const stopTimer = (taskId, columnId) => {
    updateTask(taskId, columnId, {
      ...columns[columnId].find(t => t.id === taskId),
      timerActive: false
    });
  };

 if (!isInitialized || !columns || (!columns.todo && !columns.inprogress && !columns.done)) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Initializing board...</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 30, padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>{boardName}</h2>
        <button 
          onClick={addTask}
          style={{ 
            padding: '10px 20px', 
            fontSize: '16px', 
            background: '#22c55e', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          ➕ Add Task
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', overflowX: 'auto' }}>
          {Object.values(COLUMN_IDS).map((columnId) => (
            <Column
              key={columnId}
              columnId={columnId}
              tasks={columns[columnId] || []}
              title={COLUMN_TITLES[columnId]}
              addComment={addComment}
              editTask={editTask}
              deleteTask={deleteTask}
              startTimer={startTimer}
              stopTimer={stopTimer}
            />
          ))}
        </div>
      </DragDropContext>

      {showTaskModal && (
        <TaskModal
          task={editingTask}
          onSave={saveTask}
          onClose={() => setShowTaskModal(false)}
        />
      )}
    </div>
  );
};

export default Board;