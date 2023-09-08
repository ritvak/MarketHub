import React, { useState, useEffect } from 'react';
import { EditFilled, DeleteFilled, CommentOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Row, Col, Tooltip, Layout, Tabs, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import APIUtils from '../../helpers/APIUtils';
import './myProducts.css';
import GlobalHeader from '../../shared/header';
import handleCreateChat from '../../helpers/handleCreateChat';

const { Meta } = Card;
const { Content } = Layout;
const { TabPane } = Tabs;
const api = msg => new APIUtils(msg);

const ConfirmationDialog = ({ visible, message, onConfirm, onCancel }) => {
  return (
    <Modal
      visible={visible}
      title="Confirm Deletion"
      onCancel={onCancel}
      onOk={onConfirm}
      okText="Yes"
      cancelText="No"
    >
      <p>{message}</p>
    </Modal>
  );
};

const MyProducts = () => {
  const [approvedCardData, setApprovedCardData] = useState([]);
  const [rejectedCardData, setRejectedCardData] = useState([]);
  const [userName, setUserName] = useState();
  const [type, setType] = useState('approved');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [productId, setProductId] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      const res = await api(false).loadUser();
      setUserName(res.data.userData.name);
    } catch (e) {
      console.log(e);
    }
    try {
      const approvedRes = await api(false).getUserProducts({ type: 'approved' });
      console.log('Approved products:', approvedRes.data.products);
      setApprovedCardData(approvedRes.data.products);
    } catch (e) {
      console.log(e);
    }
    try {
      const rejectedRes = await api(false).getUserProducts({ type: 'rejected' });
      console.log('Approved products:', rejectedRes.data.products);
      setRejectedCardData(rejectedRes.data.products);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = (productId) => {
    setDialogMessage(`Are you sure you want to delete the product?`);
    setDialogVisible(true);
    setProductId(productId);
  };
  

  const areUSureDelete = async (choose) => {
    try{
    if (choose) {
      console.log(choose);
      if (productId) {
        console.log(productId);
        await api(true).deleteProduct(productId);
        console.log("Product deleted!");
        await getData();
      }
    }
    setDialogVisible(false); 
    setProductId(null); 
  }
  catch(e){
    setDialogVisible(false);
    console.log(e);
  }
  };

  const handleEdit = async (productId) => {
    try {

      navigate(`/edit-product/${productId}`);
    } catch (error) {
      console.log(error);
    }
  };
  

  const productDetails = product_Id => {
    navigate(`/my-products/${product_Id}`);
  };

  const addProduct = async () => {
    navigate(`/my-products/add-product`);
  };

  const handleBack = async () => {
    navigate('/products');
  };

  const onChange = key => {
    setType(key);
  };

  useEffect(() => {
    (async () => {
      await getData();
      console.log('approvedCardData:', approvedCardData);
      console.log('rejectedCardData:', rejectedCardData);
    })();
  }, [type]);

  return (
    <Layout style={{ flex: 1, overflow: 'hidden' }}>
      <GlobalHeader userName={userName} title={'My Products'} />
      <Content style={{ padding: '24px', overflow: 'auto' }}>
        <div className="parent-container">
          <div className="button" style={{marginBottom:'10px'}}>
          <Button
                type="primary"
                style={{
                  float: 'right',
                  marginBottom: '20px',
                  backgroundColor: '#4CAF50',
                  marginRight: '15px',
                }}
                onClick={addProduct}
              >
                <PlusOutlined /> Add Product
              </Button>
              <Button
                type="primary"
                style={{
                  float: 'right',
                  marginBottom: '20px',
                  marginRight: '15px',
                }}
                onClick={handleBack}
              >Back
          </Button>
          </div>
          <Tabs defaultActiveKey="approved" onChange={onChange}>
            <TabPane tab="Approved" key="approved">
              <div className="user-dummy-container">
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  {approvedCardData.map((e, index) => (
                    <Col
                      className="gutter-row user-dummy-card"
                      style={{ marginBottom: '20px' }}
                      key={index}
                      xs={24}
                      sm={12}
                      md={8}
                      lg={6}
                      xl={4}
                    >
                      <Card
                        hoverable
                        style={{ width: '100%' }}
                        cover={
                          <div style={{ maxHeight: '300px', overflow: 'hidden' }}>
                            <a onClick={() => productDetails(e._id)}>
                              <img
                                className="user-card-image"
                                alt="example"
                                src={e.image}
                                style={{ width: '100%', objectFit: 'cover', maxHeight: '100%' }}
                              />
                            </a>
                          </div>
                        }
                        actions={[
                          <span className="edit-icon">
                            <Tooltip placement="bottom" title={<span>Edit</span>}>
                              <EditFilled
                                key="edit"
                                style={{ fontSize: '16px' }}
                                onClick={() => handleEdit(e._id)}
                              />
                            </Tooltip>
                          </span>,
                          <span className="delete-icon">
                            <Tooltip placement="bottom" title={<span>Delete</span>}>
                              <DeleteFilled
                                key="delete"
                                style={{ fontSize: '16px' }}
                                onClick={() => handleDelete(e._id)}
                              />
                            </Tooltip>
                          </span>,
                        ]}
                      >
                        <a onClick={() => productDetails(e._id)}>
                          <Meta
                            title={<a onClick={() => productDetails(e._id)}>{e.productName}</a>}
                            description={
                              e.productDescription.length > 10
                                ? `${e.productDescription.substring(0, 10)}...`
                                : `${e.productDescription.substring(0, 10)}${Array.from({
                                    length: Math.max(0, 13 - e.productDescription.length),
                                  })
                                    .fill(' ')
                                    .join('')}`
                            }
                            style={{ whiteSpace: 'pre' }}
                          />
                        </a>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </TabPane>
            <TabPane tab="Rejected" key="rejected">
              <div className="user-dummy-container">
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  {rejectedCardData.map((e, index) => (
                    <Col
                      className="gutter-row user-dummy-card"
                      style={{ marginBottom: '20px' }}
                      key={index}
                      xs={24}
                      sm={12}
                      md={8}
                      lg={6}
                      xl={4}
                    >
                    <Card
                        hoverable
                        style={{ width: '100%' }}
                        cover={
                          <div style={{ maxHeight: '300px', overflow: 'hidden' }}>
                            <a onClick={() => productDetails(e._id)}>
                              <img
                                className="user-card-image"
                                alt="example"
                                src={e.image}
                                style={{ width: '100%', objectFit: 'cover', maxHeight: '100%' }}
                              />
                            </a>
                          </div>
                        }
                        actions={[
                          <span className="edit-icon">
                            <Tooltip placement="bottom" title={<span>Edit</span>}>
                              <EditFilled
                                key="edit"
                                style={{ fontSize: '16px' }}
                                onClick={() => handleEdit(e._id)}
                              />
                            </Tooltip>
                          </span>,
                          <span className="delete-icon">
                            <Tooltip placement="bottom" title={<span>Delete</span>}>
                              <DeleteFilled
                                key="delete"
                                style={{ fontSize: '16px' }}
                                onClick={() => handleDelete(e._id)}
                              />
                            </Tooltip>
                          </span>,
                        ]}
                      >
                        <a onClick={() => productDetails(e._id)}>
                          <Meta
                            title={<a onClick={() => productDetails(e._id)}>{e.productName}</a>}
                            description={
                              e.productDescription.length > 10
                                ? `${e.productDescription.substring(0, 10)}...`
                                : `${e.productDescription.substring(0, 10)}${Array.from({
                                    length: Math.max(0, 13 - e.productDescription.length),
                                  })
                                    .fill(' ')
                                    .join('')}`
                            }
                            style={{ whiteSpace: 'pre' }}
                          />
                        </a>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </TabPane>
          </Tabs>
        </div>
        <ConfirmationDialog
            visible={dialogVisible}
            message={dialogMessage}
            onConfirm={() => areUSureDelete(true)}
            onCancel={() => areUSureDelete(false)}
          />
      </Content>
    </Layout>
  );
};

export default MyProducts;
