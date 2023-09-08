import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Card, Col, Row, Form, Button, Layout, Upload } from 'antd';
import useSimpleReactValidator from '../../helpers/useReactSimpleValidator';
import {
  UploadOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import APIUtils from '../../helpers/APIUtils';
import GlobalHeader from '../../shared/header';
import './addProduct.css';

const { Content } = Layout;
const api = msg => new APIUtils(msg);

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
    _id:null,
    image: '',
    productName: '',
    productDescription: '',
    price: '',
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e, field) => {
    console.log("Updating field:", field);
    console.log("New value:", e.target.value);
    setFields(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const getData = async () => {
    try {
      const pid = localStorage.getItem("productId");
      console.log(pid);
      console.log(res.data[0]);
      setFields(res.data[0]);
      console.log("API Response:", res.data);
      localStorage.removeItem('productId');
    } catch (e) {
      console.log(e);
    }
  };
  
  const navigateBack = async () => {
    navigate('/my-products');
  };
  

  const handleSubmit = async (e) => {
    setLoading(true);
    try {
      let imageUrl = "";
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
        imageUrl = dataRes.data.url;
      }

      const submitData = {
        image: imageUrl,
        productName: fields.name,
        productDescription: fields.productDescription,
        price: fields.price,
      };

      const res = await api(true).addProduct(submitData);
      localStorage.setItem("productId", res.data.productData._id);
      navigate('/my-products');
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
      <GlobalHeader title={'Edit Profile'} />
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
                    <Button icon={<UploadOutlined />}>Upload Product Image</Button>
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
                value={fields.name}
                placeholder=" Enter Product Name"
                onChange={(e) => handleChange(e, 'name')}
                autoComplete="new-password"
                className="custom-input"
              />
              <div className={validator.errorMessages.name ? 'error-message' : ''}>
                {validator.message('Name', fields.name, 'required')}
              </div>
              </Form.Item>
              <Form.Item
                name="description"
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
                    Add Product
                  </Button>
                  </Form>
                </Card>
              </Col>
            </Row>
          </div>
        </section>
      </Content>
    </Layout>
  );
};

export default AddProduct;
