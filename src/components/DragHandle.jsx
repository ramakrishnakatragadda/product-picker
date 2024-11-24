import React from 'react';

const DragHandle = ({ listeners }) => {
  return (
    <button {...listeners} className="dragHandle">
      <div className="dotGrid">
        {Array.from({ length: 6 }, (_, index) => (
          <span key={index} className="dot"></span>
        ))}
      </div>
    </button>
  );
};

export default DragHandle;
