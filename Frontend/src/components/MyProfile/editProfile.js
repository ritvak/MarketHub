import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Card, Col, Row, Form, Button, Layout, Upload, Modal } from 'antd';
import useSimpleReactValidator from '../../helpers/useReactSimpleValidator';
import {
  UploadOutlined,
  UserOutlined,
  MailOutlined,
  MobileOutlined,
  DeleteOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import APIUtils from '../../helpers/APIUtils';
import GlobalHeader from '../../shared/header';
import './myProfile.css';
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

const EditProfile = () => {

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
    img: null,
    name: null,
    email: null,
    city: null,
    postalCode: null,
    mobile: null,
  });
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e, field) => {
    setFields(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const getData = async () => {
    try {
      const res = await api(false).loadUser();
      console.log(res.data.userData);
      setFields(res.data.userData);
    } catch (e) {
      console.log(e);
    }
  };
  
  const navigateBack = async () => {
    navigate('/my-profile');
  };

  const handleDelete = () => {
    setDialogMessage(`${fields.name}, are you sure you want to delete your account?`);
    setDialogVisible(true);
  };

  const areUSureDelete = async (choose) => {
    try{
    if (choose) {
      await api(true).deleteUser(fields._id);
      console.log("User deleted!");
      dispatch(logout());
      navigate('/login');
    }
    setDialogVisible(false); 
  }
  catch(e){
    setDialogVisible(false);
    console.log(e);
  }
  };
  

  const handleUpload = async (e) => {
    console.log("In upload");
    try {
      let imageUrl = "";
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "ml_default");
        formData.append("cloud_name", "dsxncrb68");
        console.log(formData);
        const dataRes = await axios.post(
          process.env.CLOUDNIARY_URL,
          formData
        );
        imageUrl = dataRes.data.url;
      }

      const submitPost = {
        image: imageUrl,
        email:fields.email,
      };
      console.log(submitPost);
      const res = await api(false).uploadImage(submitPost);
      console.log(res.data.img);
      setImage(res.data.img);
      await getData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = async () => {
    setLoading(true);
    if (validator.allValid()) {
      await api(true).updateDetails(fields);
      await getData();
      setLoading(false);
    } else {
      setLoading(false);
      validator.getErrorMessages();
      setValidator(true);
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
        <section className="profile-section">
          <div className="parent-container">
            <div className="button">
              <Button
                type="primary"
                style={{ float: 'right', marginBottom: '20px', backgroundColor: 'red' }}
                onClick={handleDelete}
              >
                <DeleteOutlined /> Delete
              </Button>
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
                <Card className="profile-card">
                  <h1 style={{alignContent:"center"}}>Profile Picture</h1>
                  <div className="avatar">
                    {!fields.img?<img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                      alt="avatar"
                    />:<img
                    src={fields.img}
                    alt="avatar"/>}
                  </div>
                  <p className="text-muted mb-1"></p>
                  <Form onFinish={handleUpload}>
                    <div style={{ display: 'flex', justifyContent: 'center'}}>
                      <Upload name="logo" accept="image/*" beforeUpload={(file) => {
                        setImage(file);
                        return false;
                      }}>
                        <Button icon={<UploadOutlined />}>Add Image</Button>
                      </Upload>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <Button style={{ marginTop: "20px" }} className="login-form-button" type="primary" htmlType="submit" onClick={handleUpload}>Submit</Button>
                    </div>
                  </Form>
                </Card>
              </Col>
              <Col lg={16} xs={24}>
                <Card className="profile-card">
                  <h1 className="my-details" style={{marginLeft:"8px"}}>My Details</h1>
                  <Form>
              <Form.Item className=""
                name="name"
              >
              <Input 
                prefix={<UserOutlined className="site-form-item-icon" />}
                type="text"
                value={fields.name}
                placeholder=" Enter your Name"
                onChange={(e) => handleChange(e, 'name')}
                autoComplete="new-password"
                className="custom-input"
              />
              <div className={validator.errorMessages.name ? 'error-message' : ''}>
                {validator.message('Name', fields.name, 'required')}
              </div>
              </Form.Item>
			          <Form.Item className=""
                name="email"
              >
              <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
                type="text"
                value={fields.email}
                placeholder=" Enter your Email"
                disabled={true}
                onChange={e => handleChange(e, 'email')}
                autoComplete="new-password"
                className="custom-input"
              />
               <div className={validator.errorMessages.email ? 'error-message' : ''}>
                {validator.message('Email', fields.email, 'required|email')}
              </div>
            </Form.Item>
            <Form.Item className=""
                name="city"
              >
              <Input
                prefix={<EnvironmentOutlined className="site-form-item-icon" />}
                type="text"
                value={fields.city}
                placeholder=" Enter your City"
                onChange={e => handleChange(e, 'city')}
                autoComplete="new-password"
                className="custom-input"
              />
               <div className={validator.errorMessages.city ? 'error-message' : ''}>
                {validator.message('Email', fields.city, 'required|city')}
              </div>
              </Form.Item>
              <Form.Item className=""
                name="postalCode"
              >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                type="text"
                value={fields.postalCode}
                placeholder=" Enter your Postal Code"
                onChange={e => handleChange(e, 'postalCode')}
                autoComplete="new-password"
                className="custom-input"
              />
              <div className={validator.errorMessages.postalCode ? 'error-message' : ''}>
                {validator.message('Postal Code', fields.postalCode, 'required|postalCode')}
              </div>
              </Form.Item>
              <Form.Item className=""
                name="mobile"
              >
              <Input 
                prefix={<MobileOutlined className="site-form-item-icon" />}
                type="text"
                value={fields.mobile}
                placeholder=" Enter your Mobile"
                onChange={e => handleChange(e, 'mobile')}
                autoComplete="new-password"
                className="custom-input"
              />
              <div className={validator.errorMessages.mobile ? 'error-message' : ''}>
                {validator.message('Mobile', fields.mobile, 'required|phone')}
              </div>
              </Form.Item>
              <div className="change-password" style={{ marginBottom: "20px", display: "flex", justifyContent: "flex-end", fontSize:"14px" }}>
                <Link to={`/my-profile/edit-profile/change-password/${fields._id}`}>Change Password?</Link>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                <Button className="login-form-button" type="primary" htmlType="submit" onClick={handleEdit}>
                  Update Profile
                </Button>
              </div>
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

export default EditProfile;
