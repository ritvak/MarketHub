import React, { useState, useEffect } from 'react';
import { Breadcrumb, Card, Col, Row, Progress, Button, Layout } from 'antd';
import {
  EnvironmentFilled,
  GithubOutlined,
  GlobalOutlined,
  InstagramOutlined,
  FacebookOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  MobileOutlined,
  EditOutlined, 
  DeleteOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import APIUtils from '../../helpers/APIUtils';
import GlobalHeader from '../../shared/header';
import './myProfile.css';

const { Content } = Layout;
const api = msg => new APIUtils(msg);

const MyProfile = () => {

  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userCity, setUserCity] = useState();
  const [userPostalCode, setUserPostalCode] = useState();
  const [userMobile, setUserMobile] = useState();
  const [userAbout, setUserAbout] = useState();
  const [userImg, setUserImg] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      const res = await api(false).loadUser();
      setUserName(res.data.userData.name);
      setUserEmail(res.data.userData.email);
      setUserCity(res.data.userData.city);
      setUserPostalCode(res.data.userData.postalCode);
      setUserMobile(res.data.userData.mobile);
      setUserAbout(res.data.userData.about);
      setUserImg(res.data.userData.img);
    } catch (e) {
      console.log(e);
    }
  };

  const navigateBack = async () => {
    navigate('/products');
  };


  const editProfile = async () => {
    navigate('/my-profile/edit-profile');
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  },);

  return (
    <Layout style={{ flex: 1, overflow: 'hidden' }}>
      <GlobalHeader title={'My Profile'} />
      <Content style={{ padding: '24px', overflow: 'auto' }}>
        <section className="profile-section">
          <div className="parent-container">
            <div className="button">

              <Button
                type="primary"
                style={{
                  float: 'right',
                  marginBottom: '20px',
                  backgroundColor: '#008CBA',
                  marginRight: '15px',
                }}
                onClick={editProfile}
              >
                <EditOutlined /> Edit
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
                  <h1>Profile Picture</h1>
                  <div className="avatar">
                  {!userImg?<img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                      alt="avatar"
                    />:<img
                    src={userImg}
                    alt="avatar"/>}
                  </div>
                  <p className="text-muted mb-1">{userAbout}</p>
                </Card>
              </Col>
              <Col lg={16} xs={24}>
                <Card className="profile-card">
                  <h1 className="my-details">My Details</h1>
                  <div className="profile-info">
                    <div className="info-row">
                      <UserOutlined className="info-icon" />
                      <span className="info-label">
                        <b>Full Name :</b>
                      </span>
                      <span className="info-value">{userName}</span>
                    </div>
                    <div className="info-row">
                      <MailOutlined className="info-icon" />
                      <span className="info-label">
                        <b>Email :</b>
                      </span>
                      <span className="info-value">{userEmail}</span>
                    </div>
                    <div className="info-row">
                      <EnvironmentFilled className="info-icon" />
                      <span className="info-label">
                        <b>Address :</b>
                      </span>
                      <span className="info-value">{userCity}</span>
                    </div>
                    <div className="info-row">
                      <MailOutlined className="info-icon" />
                      <span className="info-label">
                        <b>Postal Code :</b>
                      </span>
                      <span className="info-value">{userPostalCode}</span>
                    </div>
                    <div className="info-row">
                      <MobileOutlined className="info-icon" />
                      <span className="info-label">
                        <b>Mobile :</b>
                      </span>
                      <span className="info-value">{userMobile}</span>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </section>
      </Content>
    </Layout>
  );
};

export default MyProfile;
