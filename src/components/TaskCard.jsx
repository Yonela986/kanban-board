import React, { useState, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import CommentSection from './CommentSection';

const TaskCard = ({ task, index, columnId, addComment, editTask, deleteTask, startTimer, stopTimer }) => {
  const [showComments, setShowComments] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(30);
  const [timeRemaining, setTimeRemaining] = useState(null);

  // Update time remaining every second for active timers
  useEffect(() => {
    if (task.timerActive && task.timerEnd) {
      const interval = setInterval(() => {
        const now = new Date();
        const end = new Date(task.timerEnd);
        const diff = end - now;
        
        if (diff <= 0) {
          setTimeRemaining('Time\'s up!');
          clearInterval(interval);
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setTimeRemaining(null);
    }
  }, [task.timerActive, task.timerEnd]);

  const handleTimerStart = () => {
    if (timerMinutes > 0) {
      startTimer(task.id, columnId, timerMinutes);
      setShowTimer(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#fef2f2';
      case 'medium': return '#fffbeb';
      case 'low': return '#f0fdf4';
      default: return 'white';
    }
  };

  const getPriorityBorder = (priority) => {
    switch (priority) {
      case 'high': return '2px solid #ef4444';
      case 'medium': return '2px solid #f59e0b';
      case 'low': return '2px solid #22c55e';
      default: return '1px solid #e5e7eb';
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            padding: 12,
            background: snapshot.isDragging ? '#f9fafb' : getPriorityColor(task.priority),
            border: getPriorityBorder(task.priority),
            borderRadius: 8,
            boxShadow: snapshot.isDragging ? '0 8px 25px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.1)',
            cursor: 'grab',
            transition: 'all 0.2s',
            ...provided.draggableProps.style,
          }}
        >
          {/* Task Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <strong style={{ fontSize: '16px', lineHeight: '1.4' }}>{task.title}</strong>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  editTask(task, columnId);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '2px',
                }}
                title="Edit task"
              >
                ✏️
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Delete this task?')) {
                    deleteTask(task.id, columnId);
                  }
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '2px',
                }}
                title="Delete task"
              >
                🗑️
              </button>
            </div>
          </div>

          {/* Task Description */}
          {task.description && (
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: 8, lineHeight: '1.4' }}>
              {task.description}
            </p>
          )}

          {/* Task Meta Info */}
          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: 8 }}>
            {task.priority && (
              <span style={{ 
                background: task.priority === 'high' ? '#fecaca' : 
                           task.priority === 'medium' ? '#fed7aa' : '#bbf7d0',
                color: task.priority === 'high' ? '#dc2626' : 
                       task.priority === 'medium' ? '#ea580c' : '#16a34a',
                padding: '2px 6px',
                borderRadius: '4px',
                marginRight: '6px',
                fontSize: '11px',
                fontWeight: 'bold'
              }}>
                {task.priority.toUpperCase()}
              </span>
            )}
            {task.category && (
              <span style={{ marginRight: '6px' }}>📂 {task.category}</span>
            )}
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <div style={{ fontSize: '12px', color: '#dc2626', marginBottom: 8 }}>
              📅 Due: {formatDate(task.dueDate)}
            </div>
          )}

          {/* Timer Section */}
          <div style={{ marginBottom: 8 }}>
            {task.timerActive && timeRemaining && (
              <div style={{ 
                background: '#fee2e2', 
                padding: '6px', 
                borderRadius: '4px', 
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#dc2626',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>⏰ {timeRemaining}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    stopTimer(task.id, columnId);
                  }}
                  style={{
                    background: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    cursor: 'pointer'
                  }}
                >
                  Stop
                </button>
              </div>
            )}
            
            {!task.timerActive && (
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                {!showTimer ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTimer(true);
                    }}
                    style={{
                      background: '#f3f4f6',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                  >
                    ⏰ Start Timer
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <input
                      type="number"
                      min="1"
                      max="480"
                      value={timerMinutes}
                      onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 30)}
                      style={{
                        width: '50px',
                        padding: '2px',
                        fontSize: '11px',
                        border: '1px solid #d1d5db',
                        borderRadius: '3px'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span style={{ fontSize: '11px' }}>min</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTimerStart();
                      }}
                      style={{
                        background: '#22c55e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '2px 6px',
                        fontSize: '10px',
                        cursor: 'pointer'
                      }}
                    >
                      Start
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowTimer(false);
                      }}
                      style={{
                        background: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '2px 6px',
                        fontSize: '10px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Comments Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowComments(!showComments);
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              💬 {task.comments?.length || 0} comments
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div style={{ marginTop: 10 }}>
              <CommentSection
                taskId={task.id}
                columnId={columnId}
                comments={task.comments || []}
                addComment={addComment}
              />
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
