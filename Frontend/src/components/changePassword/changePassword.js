import { useState, useEffect } from 'react';
import { Button, Form, Input, Layout, theme, Checkbox } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import useSimpleReactValidator from '../../helpers/useReactSimpleValidator';
import APIUtils from '../../helpers/APIUtils';
import './changePassword.css';
import GlobalHeader from '../../shared/header';

const { Content } = Layout;

const api = msg => new APIUtils(msg);

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, token } = useParams();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    password: null,
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
    }
  );
    

  const handleChange = (e, field) => {
    setFields(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (validator.allValid()) {
      await api(true).changePasswordPost(id, token, fields);
      setLoading(false);
      navigate('/');
    } else {
      setLoading(false);
      validator.getErrorMessages();
      setValidator(true);
    }
  };

  const userValid = async () => {
    const res = await api(true).changePasswordGet(id,token);

    const data = res;

    if (data.status == 200) {
        console.log("user valid")
    } else {
        navigate("*")
    }
};

useEffect(() => {
    userValid()
}, [])

  return (
    <Layout>
  {/*<GlobalHeader title={'Products'} />*/}
  <Content>
    <div className="login-page">
      <div className="login-box">
        <Form className="login-form" name="login-form" initialValues={{ remember: true }} layout="vertical">
          <p className="form-title">Forgot Password</p>
          <br/>
          <Form.Item label={
                  <span className="label">
                    <span className="required-asterisk">*</span>
                    New Password
                  </span>
                }
                name="password"
              >
              <Input.Password
                placeholder="Enter your Password"
                value={fields.password}
                onChange={e => handleChange(e, 'password')}
                autoComplete="new-password"
                className="custom-input"

              />
              <div className={validator.errorMessages.password ? 'error-message' : ''}>
                {validator.message('Password', fields.password, 'required')}
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
                placeholder="Confirm your Password"
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
  </Content>
</Layout>
  );
};
export default ChangePassword;
