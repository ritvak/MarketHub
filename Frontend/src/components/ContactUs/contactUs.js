import React, { useEffect } from 'react';
import { Input, Button, Row, Col, Form, Layout } from 'antd';
import { useState } from 'react';
import useSimpleReactValidator from '../../helpers/useReactSimpleValidator';
import Img2 from '../../assets/contact.png';
import { useDispatch } from 'react-redux';
import APIUtils from '../../helpers/APIUtils';
import './contactUs.css';
import GlobalHeader from '../../shared/header';

const { TextArea } = Input;
const { Content } = Layout;
const api = msg => new APIUtils(msg);

const initialState = {
  fname: '',
  lname: '',
  email: '',
  textArea: '',
};

const Contact = () => {
  const dispatch = useDispatch();
  const [fields, setFields] = useState(initialState);

  const resetForm = () => {
    setFields(initialState);
    setValidator(false);
  };

  const setData = async () => {
    try {
      console.log('In setData: ' + fields);
      await api(true).setContactUs(fields);

      resetForm();
    } catch (e) {
      console.log(e);
    }
  };

  const [validator, setValidator] = useSimpleReactValidator();

  const handleChange = (e, field) => {
    setFields(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async fields => {
    if (validator.allValid()) {
      console.log('In handleSubmit: ' + fields);
      await setData(fields);
    } else {
      validator.getErrorMessages();
      setValidator(true);
    }
  };

  return (
    <Layout style={{ flex: 1, overflow: 'hidden' }}>
      <GlobalHeader title={'Contact Us'} />
      <Content style={{ padding: '24px', overflow: 'auto' }}>
        <div className="bg-dark">
          <div className="contact-us">
            <h4 className="h4">Contact Us</h4>
          </div>
          <Row justify="center" align="middle" className="contact-container">
            <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
              <div className="image-container">
                <img className="c-image" src={Img2} alt="" />
              </div>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12} className="form-details">
              <Form
                labelCol={{
                  xs: { span: 24 },
                  sm: { span: 8 },
                }}
                wrapperCol={{
                  xs: { span: 24 },
                  sm: { span: 16 },
                }}
                layout="vertical"
                initialValues={{
                  disabled: false,
                }}
                // onFinish={handleSubmit}
                className="form-container"
              >
                <Form.Item className="form-item" label="First Name" required>
                  <Input
                    type="text"
                    placeholder="First Name"
                    value={fields.fname}
                    onChange={e => handleChange(e, 'fname')}
                    autoComplete="new-password"
                    className="input-border"
                  />
                  {validator.message('First Name', fields.fname, 'required')}
                </Form.Item>
                <Form.Item className="form-item" label="Last Name" required>
                  <Input
                    type="text"
                    placeholder="Last Name"
                    value={fields.lname}
                    onChange={e => handleChange(e, 'lname')}
                    autoComplete="new-password"
                    className="input-border"
                  />
                  {validator.message('Last Name', fields.fname, 'required')}
                </Form.Item>
                <Form.Item className="form-item" label="Email" required>
                  <Input
                    type="text"
                    placeholder="Email"
                    value={fields.email}
                    onChange={e => handleChange(e, 'email')}
                    autoComplete="new-password"
                    className="input-border"
                  />
                  {validator.message('Email', fields.email, 'required|email')}
                </Form.Item>
                <Form.Item className="form-item" label="Contact Reason" required>
                  <TextArea
                    rows={4}
                    placeholder="Contact Reason"
                    value={fields?.textArea}
                    onChange={e => handleChange(e, 'textArea')}
                    className="textarea-border"
                  />
                  {validator.message('Contact Reason', fields?.textArea, 'required')}
                </Form.Item>
                <Form.Item>
                  <Button
                    className="button"
                    type="primary"
                    htmlType="submit"
                    onClick={handleSubmit}
                  >
                    <b>Submit</b>
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default Contact;
