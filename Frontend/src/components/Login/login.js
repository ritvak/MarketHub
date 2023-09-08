import { useEffect, useState } from 'react';
import { Button, Form, Input, Layout, theme } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import useSimpleReactValidator from '../../helpers/useReactSimpleValidator';
import { login } from '../../redux/actions/authActions';
import './login.css';
import notification from '../../constants/notification';
import { handleSidebarChange } from '../../redux/actions/sidebarAction';

const { Content } = Layout;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    email: null,
    password: null,
    profileObj: {},
    isGoogle: false,
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
    setLoading(true);
    if (validator.allValid()) {
      await dispatch(login(fields));
      await dispatch(handleSidebarChange('/products'));
      setLoading(false);
      navigate('/products');
    } else {
      setLoading(false);
      validator.getErrorMessages();
      setValidator(true);
    }
  };

  const handleCallBackResponse = async res => {
    setLoading(true);
    const data = {
      email: null,
      password: null,
      profileObj: res.profileObj,
      isGoogle: true,
    };

    await dispatch(login(data));
    await dispatch(handleSidebarChange('/products'));
    navigate('/products');
  };

  return (
    <Layout>
      <Content>
        <div className="login-page">
          <div className="login-box">
            <div className="illustration-wrapper" style={{ background: '#fff' }}>
              <div
                className="links"
                style={{ background: '#fff', marginBottom: '170px', float: 'left' }}
              >
                <Link to="/contact-us" className="linkStyle" style={{ background: '#fff' }}>
                  Contact Us
                </Link>
                <Link to="/faq" className="linkStyle" style={{ background: '#fff' }}>
                  FAQ
                </Link>
              </div>

              <img
                src="https://cdn.sites.tapfiliate.com/tapfiliate.com/2023/04/5-winning-marketing-strategies-for-e-commerce-this-year-1.jpg"
                alt="Login"
              />
            </div>
            <Form
              className="login-form"
              name="login-form"
              initialValues={{ remember: true }}
              layout="vertical"
            >
              <p className="form-title">Login</p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  fontSize: '15px',
                  fontFamily: 'sans-serif',
                  fontWeight: 'bold',
                }}
              >
                <p></p>
              </div>
              <Form.Item
                className=""
                label={
                  <span className="label">
                    <span className="required-asterisk">*</span> Email{' '}
                  </span>
                }
                name="email"
              >
                {' '}
                <Input
                  type="text"
                  placeholder="Enter your Email"
                  value={fields.email}
                  onChange={e => handleChange(e, 'email')}
                  autoComplete="new-password"
                  className="custom-input"
                />{' '}
                <div className={validator.errorMessages.email ? 'error-message' : ''}>
                  {' '}
                  {validator.message('Email', fields.email, 'required|email')}{' '}
                </div>
              </Form.Item>
              <Form.Item
                label={
                  <span className="label">
                    <span className="required-asterisk">*</span> Password{' '}
                  </span>
                }
                name="password"
              >
                {' '}
                <Input.Password
                  placeholder="Enter your Password"
                  value={fields.password}
                  onChange={e => handleChange(e, 'password')}
                  autoComplete="new-password"
                  className="custom-input"
                />{' '}
                <div className={validator.errorMessages.password ? 'error-message' : ''}>
                  {' '}
                  {validator.message('Password', fields.password, 'required|passwwordLength')}{' '}
                </div>
              </Form.Item>
              <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'center' }}>
                  <div>
                    <Form.Item>
                      <a href="/forgot-password">Forgot Password?</a>
                    </Form.Item>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    fontSize: '15px',
                    fontFamily: 'sans-serif',
                    fontWeight: 'bold',
                  }}
                >
                  <p>
                    Don't have an account yet? <a href="/register">Sign Up</a>
                  </p>
                </div>
              </Form.Item>
              <Form.Item>
                <Button
                  className="login-form-button"
                  type="primary"
                  htmlType="submit"
                  onClick={handleSubmit}
                  loading={loading}
                >
                  {' '}
                  Log In{' '}
                </Button>
              </Form.Item>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontFamily: 'sans-serif',
                  fontWeight: 'bold',
                  marginTop: '10px',
                }}
              >
                <p>Or Sign Up using</p>
              </div>

              <GoogleLogin
                className="facebook-form-button"
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                buttonText="Continue with Google"
                onSuccess={handleCallBackResponse}
                onFailure={res => {
                  notification.error({
                    message: 'Error',
                    description: 'Unable to login please try using email & password',
                  });
                }}
                cookiePolicy={'single_host_origin'}
                isSignedIn={false}
                theme="dark"
                longtitle="true"
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontFamily: 'sans-serif',
                  marginTop: '10px',
                }}
              >
                <p>
                  Admin User?{' '}
                  <Link to="https://admin-control-panel.netlify.app/" style={{ marginTop: '10px' }}>
                    Click Here
                  </Link>
                </p>
              </div>
            </Form>
          </div>
        </div>
      </Content>
    </Layout>
  );
};
export default Login;
