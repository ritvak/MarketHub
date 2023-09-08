import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Avatar, Divider, Card, Space, Button, Layout, Rate, Modal } from 'antd';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import APIUtils from '../../helpers/APIUtils';
import GlobalHeader from '../../shared/header';
import handleCreateChat from '../../helpers/handleCreateChat';

const { Content } = Layout;

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

function MyProductDetails() {
  const dispatch = useDispatch();

  const { Meta } = Card;
  const [product, SetProduct] = useState([]);
  const [rateData, SetRateData] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [productId, setProductId] = useState();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  

  const getData = async () => {
    try {
      const res = await api(false).getOneProduct({ productId: id });
      SetProduct(res.data[0]);

      const rData = await api(false).getRatings({ productId: id });
      const ratings = {
        averageRatings: rData.data.rate.averageRatings,
        userRatings: rData.data.rate.userRatings,
      };
      SetRateData(ratings);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, []);

  const handleDelete = (id) => {
    setDialogMessage(`Are you sure you want to delete the product?`);
    setDialogVisible(true);
    setProductId(id);
  };
  

  const areUSureDelete = async (choose) => {
    try{
    if (choose) {
      if (productId) {
        console.log(productId);
        await api(true).deleteProduct(productId);
        console.log("Product deleted!");
        navigate('/my-products');
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

  const handleRatingChange = async rating => {
    const data = {
      productId: id,
      rateNumber: rating,
    };
    const res = await api(true).setRating(data);
    await getData();
  };

  const handleEdit = async (productId) => {
    try {

      navigate(`/edit-product/${productId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const navigateToComment = () => {
    navigate(`/comment/${id}?name=${product?.productName}`);
  };
  const navigateToproducts = () => {
    navigate(`/my-products`);
  };

  return (
    <Layout style={{ flex: 1, overflow: 'hidden' }}>
      <GlobalHeader title={'Product Detail'} />
      <Content style={{ padding: '24px', overflow: 'auto' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Card style={{ backgroundColor: '#f5f5f5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button type="primary" onClick={navigateToproducts}>
                Back
              </Button>
              <div>
                <Button type="primary" onClick={() => handleEdit(product?._id)}>
                  Edit
                </Button>
                <Button
                  type="primary"
                  style={{ background: '#FF0000', marginLeft: '8px' }}
                  onClick={() => handleDelete(product?._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <Avatar
                size={128}
                src={product?.image}
                style={{ cursor: 'pointer' }}
                onClick={() => setLightboxVisible(true)}
              />
              <h2 style={{ fontSize: '32px', marginTop: '10px' }}>{product?.productName}</h2>
            </div>
            {lightboxVisible && (
              <Lightbox
                mainSrc={product?.image}
                onCloseRequest={() => setLightboxVisible(false)}
                imageTitle={product?.productName}
                imageCaption={`Product Price: ${product?.price}`}
              />
            )}
            <Rate allowHalf value={rateData?.userRatings} onChange={handleRatingChange} />
            <br />
            Total Ratings: {parseFloat(rateData?.averageRatings).toFixed(2)}
            <Divider />
            <div>
              <Space size="middle" wrap>
                <Button type="primary" onClick={navigateToComment}>
                  Comment
                </Button>
                <Button
                  type="primary"
                  onClick={() => handleCreateChat(product, navigate, dispatch)}
                >
                  Chat
                </Button>
              </Space>
            </div>
            <Divider />
            <h2>Address</h2>
            {/* <p>{product.productDescription}</p> */}
            <p>133-137 Scudamore Rd, Leicester LE3 1UQ, United Kingdom</p>
            <Divider />
            <h2>Product description</h2>
            <p>{product?.productDescription}</p>
            <Divider />
            <h2>Market Place Verified User</h2>
          </Card>
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
  
}

export default MyProductDetails;
