import React, { useState } from 'react';

const CommentSection = ({ taskId, columnId, comments, addComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    addComment(taskId, columnId, newComment.trim());
    setNewComment('');
  };

  const formatCommentDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div style={{
      background: '#f8f9fa',
      border: '1px solid #e9ecef',
      borderRadius: '6px',
      padding: '12px',
      marginTop: '8px'
    }}>
      {/* Existing Comments */}
      {comments.length > 0 && (
        <div style={{ marginBottom: '12px', maxHeight: '200px', overflowY: 'auto' }}>
          {comments.map((comment) => (
            <div
              key={comment.id}
              style={{
                background: 'white',
                padding: '8px',
                borderRadius: '4px',
                marginBottom: '6px',
                fontSize: '13px',
                border: '1px solid #e9ecef'
              }}
            >
              <div style={{ color: '#495057', marginBottom: '4px' }}>
                {typeof comment === 'string' ? comment : comment.text}
              </div>
              {comment.createdAt && (
                <div style={{ color: '#6c757d', fontSize: '11px' }}>
                  {formatCommentDate(comment.createdAt)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add New Comment Form */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            style={{
              flex: 1,
              padding: '6px 8px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '12px',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#80bdff'}
            onBlur={(e) => e.target.style.borderColor = '#ced4da'}
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            style={{
              padding: '6px 12px',
              border: 'none',
              borderRadius: '4px',
              background: newComment.trim() ? '#28a745' : '#6c757d',
              color: 'white',
              fontSize: '12px',
              cursor: newComment.trim() ? 'pointer' : 'not-allowed',
              transition: 'background 0.2s'
            }}
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;