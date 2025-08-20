import React, { useState } from 'react';

const BoardManager = ({ boards, activeBoard, setActiveBoard, addBoard, deleteBoard }) => {
  const [newBoardName, setNewBoardName] = useState('');
  const [duration, setDuration] = useState(1);
  const [unit, setUnit] = useState('week');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreate = () => {
    const name = newBoardName.trim();
    if (name && duration > 0) {
      addBoard(name, duration, unit);
      setNewBoardName('');
      setDuration(1);
      setUnit('week');
      setShowCreateForm(false);
    }
  };

  const formatEndDate = (endDate) => {
    return new Date(endDate).toLocaleDateString();
  };

  const getDaysRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div style={{ textAlign: 'center', marginTop: 20, padding: '0 20px' }}>
      {!showCreateForm ? (
        <button 
          onClick={() => setShowCreateForm(true)}
          style={{ 
            padding: '10px 20px', 
            fontSize: '16px', 
            background: '#4ade80', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          ➕ Create New Board
        </button>
      ) : (
        <div style={{ 
          background: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px', 
          display: 'inline-block',
          margin: '10px'
        }}>
          <h3>Create New Sprint Board</h3>
          <input
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            placeholder="Board Name"
            style={{ padding: '8px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
            style={{ padding: '8px', marginRight: '10px', width: '60px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <select 
            value={unit} 
            onChange={(e) => setUnit(e.target.value)}
            style={{ padding: '8px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="week">Week(s)</option>
            <option value="month">Month(s)</option>
          </select>
          <br />
          <button 
            onClick={handleCreate}
            style={{ 
              padding: '8px 16px', 
              margin: '10px 5px', 
              background: '#22c55e', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Create
          </button>
          <button 
            onClick={() => setShowCreateForm(false)}
            style={{ 
              padding: '8px 16px', 
              margin: '10px 5px', 
              background: '#6b7280', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {Object.keys(boards).length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>Your Boards ({Object.keys(boards).length}/5)</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '15px', 
            marginTop: 15,
            maxWidth: '1200px',
            margin: '15px auto'
          }}>
            {Object.entries(boards).map(([name, board]) => {
              const daysRemaining = getDaysRemaining(board.endDate);
              const isActive = name === activeBoard;
              
              return (
                <div
                  key={name}
                  style={{
                    padding: '15px',
                    background: isActive ? '#e0f2fe' : 'white',
                    border: isActive ? '2px solid #0284c7' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onClick={() => setActiveBoard(name)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{name}</h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete board "${name}"?`)) {
                          deleteBoard(name);
                        }
                      }}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#6b7280' }}>
                    Duration: {board.duration} {board.unit}(s)
                  </p>
                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#6b7280' }}>
                    Ends: {formatEndDate(board.endDate)}
                  </p>
                  <p style={{ 
                    margin: '5px 0', 
                    fontSize: '14px', 
                    color: daysRemaining < 0 ? '#ef4444' : daysRemaining <= 3 ? '#f59e0b' : '#22c55e',
                    fontWeight: 'bold'
                  }}>
                    {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : 
                     daysRemaining === 0 ? 'Due today!' : 
                     `${daysRemaining} days remaining`}
                  </p>
                  <div style={{ marginTop: '10px', fontSize: '12px', color: '#6b7280' }}>
                    Tasks: {(board.todo?.length || 0)} todo, {(board.inprogress?.length || 0)} in progress, {(board.done?.length || 0)} done
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardManager;