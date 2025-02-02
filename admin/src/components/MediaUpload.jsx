import React from 'react';

const MediaUpload = ({ value = [], onMediaChange }) => {
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    // Combine existing files with new files
    const updatedFiles = [...value, ...newFiles];
    onMediaChange(updatedFiles);
  };

  const handleRemove = (indexToRemove) => {
    const updatedFiles = value.filter((_, index) => index !== indexToRemove);
    onMediaChange(updatedFiles);
  };

  const renderPreview = (file, index) => {
    if (file instanceof File) {
      if (file.type.startsWith('video/')) {
        return (
          <div className="relative">
            <video
              src={URL.createObjectURL(file)}
              className="w-20 h-20 object-cover"
              controls
              preload="metadata"
            />
            <button
              onClick={() => handleRemove(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
              type="button">
              ×
            </button>
          </div>
        );
      }
      return (
        <div className="relative">
          <img
            src={URL.createObjectURL(file)}
            alt={`Preview ${index}`}
            className="w-20 h-20 object-cover"
          />
          <button
            onClick={() => handleRemove(index)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
            type="button">
            ×
          </button>
        </div>
      );
    }

    // For already uploaded files
    const isVideo = file.includes('#video');
    const url = file.split('#')[0];

    return (
      <div className="relative">
        {isVideo ? (
          <video src={url} className="w-20 h-20 object-cover" controls preload="metadata" />
        ) : (
          <img src={url} alt={`Uploaded ${index}`} className="w-20 h-20 object-cover" />
        )}
        <button
          onClick={() => handleRemove(index)}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
          type="button">
          ×
        </button>
      </div>
    );
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
      {value && value.length > 0 && (
        <div className="mt-2 flex gap-2 flex-wrap">
          {value.map((file, index) => (
            <div key={index}>{renderPreview(file, index)}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
