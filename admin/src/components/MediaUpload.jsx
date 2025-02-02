import React, { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Компонент для отдельного медиа-файла
const SortableItem = ({ file, id, index, onRemove }) => {
  const [previewUrl, setPreviewUrl] = useState('');
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: id,
  });

  useEffect(() => {
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(file.split('#')[0]);
    }
  }, [file]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const preview =
    file instanceof File ? (
      file.type.startsWith('video/') ? (
        <video src={previewUrl} className="w-20 h-20 object-cover" controls preload="metadata" />
      ) : (
        <img src={previewUrl} alt={`Preview ${index}`} className="w-20 h-20 object-cover" />
      )
    ) : file.includes('#video') ? (
      <video src={previewUrl} className="w-20 h-20 object-cover" controls preload="metadata" />
    ) : (
      <img
        src={previewUrl}
        alt={`Uploaded ${index}`}
        className="w-20 h-20 object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'placeholder.png'; // Add a placeholder image for failed loads
        }}
      />
    );

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group bg-white rounded shadow-sm border border-gray-200 cursor-move">
      {preview}
      <button
        onClick={() => onRemove(index)}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        type="button">
        ×
      </button>
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all" />
    </div>
  );
};

const MediaUpload = ({ value = [], onMediaChange }) => {
  const [items, setItems] = useState(() =>
    value.map((file, index) => ({
      id: `item-${index}`,
      file,
    })),
  );

  useEffect(() => {
    setItems(
      value.map((file, index) => ({
        id: `item-${index}`,
        file,
      })),
    );
  }, [value]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const updatedFiles = [...value, ...newFiles];
    onMediaChange(updatedFiles);
  };

  const handleRemove = (indexToRemove) => {
    const updatedFiles = value.filter((_, index) => index !== indexToRemove);
    onMediaChange(updatedFiles);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    const reorderedFiles = arrayMove([...value], oldIndex, newIndex);
    onMediaChange(reorderedFiles);
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="border p-2 w-full"
      />
      <div className="text-sm text-gray-500 mt-1">
        Поддерживаемые форматы: изображения и видео до 50MB
      </div>
      {items.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={horizontalListSortingStrategy}>
            <div className="mt-2 flex gap-2 flex-wrap">
              {items.map((item, index) => (
                <SortableItem
                  key={item.id}
                  id={item.id}
                  index={index}
                  file={item.file}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default MediaUpload;
