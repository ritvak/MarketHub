import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Button, Form, Input } from 'antd';
import useSimpleReactValidator from '../helpers/useReactSimpleValidator';
import APIUtils from '../helpers/APIUtils';
import '../components/Chat/chat.css';

const api = msg => new APIUtils(msg);

const PaymentModal = ({ paymentModal, handleModal, payableAmount, handlePayableAmount }) => {
  const handleCancel = () => {
    handlePayableAmount(null);
    handleModal(false);
  };
  const { selectedChat, chatList } = useSelector(state => state.chat);
  const [validator, setValidator] = useSimpleReactValidator();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (validator.allValid()) {
        const [recipient] = chatList.filter(cur => cur.key === selectedChat.key);
        const tempData = {
          location: window.location.pathname,
          amount: payableAmount,
          name: selectedChat?.label,
          chatId: selectedChat?.key,
          recipientId: recipient?.id,
        };
        console.log(tempData);
        const res = await api(true).paymentCheckout(tempData);
        window.location.href = res?.data?.url;
        setLoading(false);
      } else {
        setLoading(false);
        validator.getErrorMessages();
        setValidator(true);
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add Amount"
      open={paymentModal}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="pay" type="primary" loading={loading} onClick={handleSubmit}>
          Pay
        </Button>,
      ]}
      onCancel={handleCancel}
      maskClosable={false}
    >
      <Form
        name="basic"
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        autoComplete="off"
      >
        <Form.Item label="Amount">
          <Input
            placeholder="Enter Amount"
            value={payableAmount}
            onChange={e => handlePayableAmount(e.target.value)}
          />
          {validator.message('amount', payableAmount, 'required|numeric|min:1,num')}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PaymentModal;
