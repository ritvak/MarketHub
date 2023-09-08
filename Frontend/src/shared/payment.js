import { useState } from 'react';
import { DollarOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import PaymentModal from './paymentModal';
import '../components/Chat/chat.css';

const Payment = () => {
  const [paymentModal, setPaymentModal] = useState(false);
  const [payableAmount, setPayableAmount] = useState(null);

  const handleModal = bool => {
    setPaymentModal(bool);
  };

  const handlePayableAmount = data => {
    setPayableAmount(data);
  };

  return (
    <span className="attach-icon">
      <Tooltip placement="top" title={<span>pay</span>}>
        <DollarOutlined onClick={() => handleModal(true)} />{' '}
      </Tooltip>

      {paymentModal && (
        <PaymentModal
          paymentModal={paymentModal}
          handleModal={handleModal}
          payableAmount={payableAmount}
          handlePayableAmount={handlePayableAmount}
        />
      )}
    </span>
  );
};

export default Payment;
