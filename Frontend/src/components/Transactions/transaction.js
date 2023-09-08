import React, { useState, useEffect } from 'react';
import { Layout, Tabs, Table } from 'antd';
import Moment from 'react-moment';
import ApiUtils from '../../helpers/APIUtils';
import GlobalHeader from '../../shared/header';
import Loader from '../../shared/loader';

const api = msg => new ApiUtils(msg);

const { Content } = Layout;

const items = [
  {
    key: 'paid',
    label: `Paid`,
  },
  {
    key: 'received',
    label: `Received`,
  },
];

const columns = [
  {
    title: 'Name',
    dataIndex: ['userDetails', 'name'],
    key: 'name',
  },
  {
    title: 'Product',
    dataIndex: ['chatDetails', 'productName'],
    key: 'age',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: 'Date',
    dataIndex: 'createdAt',
    key: 'date',
    render: text => <Moment format="YYYY/MM/DD">{text}</Moment>,
  },
];

const Transactions = () => {
  const [orders, setOrders] = useState([]);
  const [type, setType] = useState('paid');
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);

      const res = await api(true).getOrders({ type });

      setOrders(res?.data?.orders);

      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };
  const onChange = key => {
    setType(key);
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [type]);

  return (
    <Layout style={{ flex: 1, overflow: 'hidden' }}>
      {loading && <Loader />}
      <GlobalHeader title="Transactions" />
      <Content style={{ padding: '24px', overflow: 'auto' }}>
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        <Table columns={columns} dataSource={orders} pagination={false} />
      </Content>
    </Layout>
  );
};
export default Transactions;
