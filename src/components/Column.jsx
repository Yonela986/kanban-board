import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';

const Column = ({ columnId, tasks = [], title, addComment, editTask, deleteTask, startTimer, stopTimer }) => {
  return (
    <div style={{ minWidth: '320px', maxWidth: '320px' }}>
      <h3 style={{ 
        textAlign: 'center', 
        margin: '0 0 15px 0', 
        padding: '10px',
        background: '#f8f9fa',
        borderRadius: '8px 8px 0 0',
        borderBottom: '2px solid #dee2e6'
      }}>
        {title} ({tasks.length})
      </h3>
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              minHeight: 500,
              padding: 15,
              background: snapshot.isDraggingOver ? '#f0f9ff' : '#f8f9fa',
              borderRadius: '0 0 8px 8px',
              border: '2px solid #dee2e6',
              borderTop: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  columnId={columnId}
                  addComment={addComment}
                  editTask={editTask}
                  deleteTask={deleteTask}
                  startTimer={startTimer}
                  stopTimer={stopTimer}
                />
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#9ca3af', fontStyle: 'italic' }}>
                No tasks yet
              </p>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;