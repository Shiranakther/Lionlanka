import React from 'react';

const FollowUpChips = ({ questions, onSelect }) => {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {questions.map((q, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(q)}
          className="text-xs bg-primary/20 text-primary-light hover:bg-primary/30 border border-primary/30 rounded-full px-3 py-1.5 transition-colors text-left"
        >
          {q}
        </button>
      ))}
    </div>
  );
};

export default FollowUpChips;
