import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Card, Col, Row, Form, Button, Layout, Upload, Modal } from 'antd';
import useSimpleReactValidator from '../../helpers/useReactSimpleValidator';
import {
  UploadOutlined,
  DollarOutlined,
  MailOutlined,
  MobileOutlined,
  DeleteOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import APIUtils from '../../helpers/APIUtils';
import GlobalHeader from '../../shared/header';
import './addProduct.css';
import { logout } from '../../redux/actions/authActions';

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

const AddProduct = () => {

  const [validator, setValidator] = useSimpleReactValidator(
    {},
    {
      matchPassword: {
        message: 'Password doesn`t match',
        rule: (val, params, validator) => {
          return val === fields?.password;
        },
      },
      postalCode: {
        message: 'Please enter postal code in B3J2K9 format',
        rule: (val, params) => {
          return (
            validator.helpers.testRegex(val, /^[A-Z]\d[A-Z]\d[A-Z]\d$/) &&
            params.indexOf(val) === -1
          );
        },
      },
      passwwordLength: {
        message: 'Password should be atleast of 6 digits',
        rule: (val, params) => {
            return val && val.length >= 6;
        },
      },
    }
  );
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState("");
  const [fields, setFields] = useState({
    _id: null,
    image: '',
    productName: '',
    productDescription: '',
    price: '',
  });
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [productId, setProductId] = useState();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const handleChange = (e, field) => {
    setFields(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const getData = async () => {
    try {
      console.log(id);
      const res = await api(false).getOneProduct({ productId: id });
      console.log(res.data[0]);
      setFields(res.data[0]);
      console.log("API Response:", res.data);
    } catch (e) {
      console.log(e);
    }
  };
  
  const navigateBack = async () => {
    navigate('/my-products');
  };

  const handleDelete = () => {
    setDialogMessage(`Are you sure you want to delete the product?`);
    setDialogVisible(true);
  };
  

  const areUSureDelete = async (choose) => {
    try{
    if (choose) {
      console.log(choose);
        console.log(id);
        await api(true).deleteProduct(id);
        console.log("Product deleted!");
        navigate('/my-products');
        await getData();
    }
    setDialogVisible(false); 
  }
  catch(e){
    setDialogVisible(false);
    console.log(e);
  }
  };
  

  const handleSubmit = async (e) => {
    setLoading(true);
    try {
      let imageUrl = "";
      console.log(image);
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "ml_default");
        formData.append("cloud_name", "dsxncrb68");

        console.log(process.env.REACT_APP_CLOUDINARY_URL);
        const dataRes = await axios.post(
          process.env.REACT_APP_CLOUDINARY_URL,
          formData
        );
        console.log(dataRes);
        imageUrl = dataRes.data.url;
      }

      const submitData = {
        productId: id,
        image: imageUrl || fields.image,
        productName: fields.name,
        productDescription: fields.productDescription,
        price: fields.price,
      };

      console.log(submitData);

      const res = await api(true).updateProductDetails(submitData);
      console.log(res.data.updatedProduct);
      setFields(res.data.updatedProduct);
      await getData();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  },[]);

  return (
    <Layout style={{ flex: 1, overflow: 'hidden' }}>
      <GlobalHeader title={'Edit Product'} />
      <Content style={{ padding: '24px', overflow: 'auto' }}>
        <section className="product-section">
          <div className="main-container">
            <div className="button">
              <Button
                type="primary"
                style={{
                  float: 'left',
                  marginBottom: '20px',
                }}
                onClick={navigateBack}
              >
               Back
              </Button>
              <Button
                type="primary"
                style={{
                  float: 'right',
                  marginBottom: '20px',
                  background: '#FF0000',
                }}
                onClick={handleDelete}
              >
               Delete
              </Button>
            </div>

            <Row gutter={[16, 16]}>
              <Col lg={8} xs={24}>
                <Card className="product-card">
                  <h1 style={{alignContent:"center"}}>Product Picture</h1>
                  <div className="avatar">
                    {!fields.image?<img
                      src="https://craftypixels.com/placeholder-image/800x500/ffffff/000000&text=Add+Image"
                      alt="avatar"
                    />:<img
                    src={fields.image}
                    alt="avatar"/>}
                  </div>
                  <p className="text-muted mb-1"></p>
                  <Form onFinish={handleSubmit}> 
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Upload
                      name="logo"
                      accept="image/*"
                      beforeUpload={(file) => {
                        setImage(file);
                        return false;
                      }}
                    >
                    <Button className="login-form-button" style={{}} icon={<UploadOutlined />}>Upload Product Image</Button>
                  </Upload>
                  </div>
                  </Form>
                </Card>
              </Col>
              <Col lg={16} xs={24}>
                <Card className="product-card">
                  <h1 className="my-details" style={{marginLeft:"8px"}}>Product Details</h1>
                  <Form
                  layout="vertical">
              <Form.Item className="label"
                name="name"
                label={
                  <span className="label">
                    <span className="required-asterisk">*</span> Product Name{' '}
                  </span>
                }
              >
              <Input 
                type="text"
                value={fields.productName}
                placeholder=" Enter Product Name"
                onChange={(e) => handleChange(e, 'productName')}
                autoComplete="new-password"
                className="custom-input"
              />
              <div className={validator.errorMessages.name ? 'error-message' : ''}>
                {validator.message('Name', fields.name, 'required')}
              </div>
              </Form.Item>
              <Form.Item
                name="productDescription"
                label={
                  <span className="label">
                    <span className="required-asterisk">*</span> Product Description{' '}
                  </span>
                }
              >
              <Input.TextArea showCount maxLength={100} 
                type="text"
                value={fields.productDescription}
                placeholder=" Enter Product Description"
                onChange={(e) => handleChange(e, 'productDescription')}
                autoComplete="new-password"
                className="custom-input"/>
            </Form.Item>
            <Form.Item className=""
                name="price"
                label={
                  <span className="label">
                    <span className="required-asterisk">*</span> Price{' '}
                  </span>
                }
              >
              <Input
                type="text"
                value={fields.price}
                placeholder=" Enter Product Price"
                onChange={e => handleChange(e, 'price')}
                autoComplete="new-password"
                className="custom-input"
              />
               <div className={validator.errorMessages.price ? 'error-message' : ''}>
                {validator.message('Price', fields.price, 'required|price')}
              </div>
              </Form.Item>
                  <Button className="login-form-button" type="primary" htmlType="submit" onClick={handleSubmit}>
                    Update Product Details
                  </Button>
                  </Form>
                </Card>
              </Col>
            </Row>
          </div>
          <ConfirmationDialog
            visible={dialogVisible}
            message={dialogMessage}
            onConfirm={() => areUSureDelete(true)}
            onCancel={() => areUSureDelete(false)}
          />
        </section>
      </Content>
    </Layout>
  );
};

export default AddProduct;
