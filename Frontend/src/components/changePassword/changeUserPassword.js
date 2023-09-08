import { useState, useEffect } from 'react';
import { Button, Form, Input, Layout, theme, Checkbox } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import useSimpleReactValidator from '../../helpers/useReactSimpleValidator';
import APIUtils from '../../helpers/APIUtils';
import { notification } from 'antd';
import './changeUserPassword.css';
import GlobalHeader from '../../shared/header';

const { Content } = Layout;

const api = msg => new APIUtils(msg);

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
    console.log(id);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    oldPassword: null,
    newPassword: null,
    confirmPassword: null,
  });

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

  const handleChange = (e, field) => {
    setFields(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try{
    setLoading(true);
    if (validator.allValid()) {
        console.log(fields);
      const res = await api(true).updatePassword(id, fields);
      console.log("response",res.data);
      if(res.data.status === 400){
        navigate('/products');
      }
      await getData();
      setLoading(false);
      //navigate('/');
    } else {
      setLoading(false);
      validator.getErrorMessages();
      setValidator(true);
    }
}
catch(e){
    setLoading(false);
    console.log(e);
}
  };

  const handleBack = async () => {
    navigate('/my-profile/edit-profile');
  };

  const getData = async () => {
    try {
      const res = await api(false).loadUser();
      console.log(res.data.userData);
    } catch (e) {
      console.log(e);
    }
  };

useEffect(() => {
    (async () => {
      await getData();
    })();
  },[]);

  return (
    <Layout style={{ flex: 1, overflow: 'hidden' }}>
    <GlobalHeader title={'Products'} />
    <Content style={{ padding: '24px', overflow: 'auto' }}>
      <section className="profile-section">
        <div className="parent-container">
          <div className="button">
          <Button
                type="primary"
                style={{ marginBottom: '20px', float:"left" }}
                className="back-button"
                onClick={handleBack}
              >
              Back
            </Button>
          </div>
          <div className="login-box">
            <Form
              className="login-form"
              name="login-form"
              initialValues={{ remember: true }}
              layout="vertical"
            >
          <p className="form-title">Change Password</p>
          <br/>
          <Form.Item label={
                  <span className="label">
                    <span className="required-asterisk">*</span>
                    Current Password
                  </span>
                }
                name="oldPassword"
              >
              <Input.Password
                placeholder="Enter your Current Password"
                value={fields.oldPassword}
                onChange={e => handleChange(e, 'oldPassword')}
                autoComplete="new-password"
                className="custom-input"

              />
              <div className={validator.errorMessages.oldPassword ? 'error-message' : ''}>
                {validator.message('Current Password', fields.oldPassword, 'required')}
              </div>
            </Form.Item>
          <Form.Item label={
                  <span className="label">
                    <span className="required-asterisk">*</span>
                    New Password
                  </span>
                }
                name="newPassword"
              >
              <Input.Password
                placeholder="Enter your New Password"
                value={fields.newPassword}
                onChange={e => handleChange(e, 'newPassword')}
                autoComplete="new-password"
                className="custom-input"

              />
              <div className={validator.errorMessages.newPassword ? 'error-message' : ''}>
                {validator.message('New Password', fields.newPassword, 'required|passwwordLength')}
              </div>
            </Form.Item>
            
            <Form.Item label={
                  <span className="label">
                    <span className="required-asterisk">*</span>
                    Confirm Password
                  </span>
                }
                name="password"
                dependencies={['password']}
                rules={[({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The password that you entered do not match!'));
                  },
                }),]}
              >
              <Input.Password
                placeholder="Confirm your New Password"
                value={fields.confirmPassword}
                onChange={e => handleChange(e, 'confirmPassword')}
                autoComplete="new-password"
                className="custom-input"

              />
              <div className={validator.errorMessages.confirmPassword ? 'error-message' : ''}>
                {validator.message(
                    'Confirm Password',
                    fields.confirmPassword,
                    'required|matchPassword'
                  )}
              </div>
            </Form.Item>
         
          <Form.Item>
            <Button className="login-form-button" type="primary" htmlType="submit" onClick={handleSubmit} loading={loading}> Submit </Button>
          </Form.Item>
        </Form>
      </div>
      </div>
      </section>
  </Content>
</Layout>
  );
};
export default ChangePassword;
