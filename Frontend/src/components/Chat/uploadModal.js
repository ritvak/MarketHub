import React, { useState } from 'react';
import { Modal, notification, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getBase64, dummyRequest } from '../../helpers/utils';

const UploadModal = ({
  handleModal,
  isModal,
  handleFileData,
  handleIsImage,
  fileList,
  imageUrls,
  handleImageUrls,
  handleSubmit,
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const handlePreviewCancel = () => setPreviewOpen(false);
  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  const handleChange = async ({ fileList, file }) => {
    try {
      if (file) {
        if (file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg') {
          if (!file?.originFileObj) {
            const data = await getBase64(file);
            handleImageUrls(data, false);
          } else {
            const data = await getBase64(file.originFileObj);
            const filteredData = imageUrls.filter(cur => cur !== data);
            handleImageUrls(filteredData, true);
          }
          handleFileData(fileList);
          handleIsImage(true);
        } else {
          notification.error({
            message: 'Error',
            description: 'Please upload a valid image file',
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleOk = () => {
    if (!fileList.length > 0) {
      handleIsImage(false);
      handleFileData([]);
    }
    handleSubmit();
    handleModal(false);
  };

  const handleCancel = () => {
    handleIsImage(false);
    handleFileData([]);
    handleModal(false);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  return (
    <Modal
      title="Upload Image"
      open={isModal}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <Upload
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        accept="image/png, image.jpg, image/jpeg, image/svg"
        directory={false}
        listType="picture-circle"
        fileList={fileList}
        onPreview={handlePreview}
        customRequest={dummyRequest}
        onChange={handleChange}
        beforeUpload
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handlePreviewCancel}>
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>
    </Modal>
  );
};

export default UploadModal;
