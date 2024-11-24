import React from 'react';
import '../App.css';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DragHandle from './DragHandle';

const Variant = ({ variantId, title, handleVariantDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: variantId
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} className="listItem">
      <DragHandle listeners={listeners} />
      <input type="text" value={title} readOnly className="variant" />
      <button
        name="deleteProduct"
        className="deleteProduct"
        onClick={() => handleVariantDelete(variantId)}
      >
        X
      </button>
    </li>
  );
};

export default Variant;
