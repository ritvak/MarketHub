import React from 'react';
import { Modal } from 'antd';

const ImageModal = ({ isPreview, handlePreview, previewedImage }) => {
  const handleCancel = () => {
    handlePreview(false);
  };

  return (
    <Modal title="" open={isPreview} footer={null} onCancel={handleCancel}>
      <img
        alt="Preview"
        src={previewedImage}
        style={{
          width: '100%',
          maxHeight: '80vh',
          objectFit: 'contain',
        }}
      />
    </Modal>
  );
};

export default ImageModal;
