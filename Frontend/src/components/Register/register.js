import { useState, useEffect } from 'react';
import { Button, Form, Input, Layout, theme } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import useSimpleReactValidator from '../../helpers/useReactSimpleValidator';
import { login, register } from '../../redux/actions/authActions';
import './register.css';
import GlobalHeader from '../../shared/header';
import notification from '../../constants/notification';

const { Content } = Layout;

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    name: null,
    email: null,
    postalCode: null,
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
      await dispatch(register(fields));
      setLoading(false);
      navigate('/login');
    } else {
      setLoading(false);
      validator.getErrorMessages();
      setValidator(true);
    }
  };

  const getData = async () => {
    try {
      const res = await api(false).loadUser();
      //setUserName(res.data.userData.name);
      console.log(res);
    } catch (e) {
      console.log(e);
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
    navigate('/products');
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, []);

  return (
    <Layout>
      {/*<GlobalHeader title={'Products'} />*/}
      <Content>
        <div className="login-page">
          <div className="login-box">
            <div className="illustration-wrapper" style={{ background: '#fff' }}>
              <div
                className="links"
                style={{ background: '#fff', marginBottom: '470px', float: 'left' }}
              >
                <Link to="/contact-us" className="linkStyle" style={{ background: '#fff' }}>
                  Contact Us
                </Link>
                <Link to="/faq" className="linkStyle" style={{ background: '#fff' }}>
                  FAQ
                </Link>
              </div>
              <img
                src="https://i0.wp.com/getborderless.com/wp-content/uploads/2021/12/blog-main-pic1.png?fit=560%2C315&ssl=1"
                alt="Login"
              />
            </div>
            <Form
              className="login-form"
              name="login-form"
              initialValues={{ remember: true }}
              layout="vertical"
            >
              <p className="form-title">Sign Up</p>
              <Form.Item
                className=""
                label={
                  <span className="label">
                    <span className="required-asterisk">*</span>
                    Name
                  </span>
                }
              >
                <Input
                  type="text"
                  placeholder="Enter your Name"
                  value={fields.name}
                  onChange={e => handleChange(e, 'name')}
                  autoComplete="new-password"
                  className="custom-input"
                />
                <div className={validator.errorMessages.name ? 'error-message' : ''}>
                  {validator.message('Name', fields.name, 'required|alpha')}
                </div>
              </Form.Item>
              <Form.Item
                className=""
                label={
                  <span className="label">
                    <span className="required-asterisk">*</span>
                    Email
                  </span>
                }
              >
                <Input
                  type="text"
                  placeholder="Enter your Email"
                  value={fields.email}
                  onChange={e => handleChange(e, 'email')}
                  autoComplete="new-password"
                  className="custom-input"
                />
                <div className={validator.errorMessages.email ? 'error-message' : ''}>
                  {validator.message('Email', fields.email, 'required|email')}
                </div>
              </Form.Item>
              <Form.Item
                className=""
                label={
                  <span className="label">
                    <span className="required-asterisk">*</span>
                    Postal Code
                  </span>
                }
              >
                <Input
                  type="text"
                  placeholder="Enter your Postal Code"
                  value={fields.postalCode}
                  onChange={e => handleChange(e, 'postalCode')}
                  autoComplete="new-password"
                  className="custom-input"
                />
                <div className={validator.errorMessages.postalCode ? 'error-message' : ''}>
                  {validator.message('Postal Code', fields.postalCode, 'required|postalCode')}
                </div>
              </Form.Item>

              <Form.Item
                label={
                  <span className="label">
                    <span className="required-asterisk">*</span>
                    Password
                  </span>
                }
              >
                <Input.Password
                  placeholder="Enter your Password"
                  value={fields.password}
                  onChange={e => handleChange(e, 'password')}
                  autoComplete="new-password"
                  className="custom-input"
                />
                <div className={validator.errorMessages.password ? 'error-message' : ''}>
                  {validator.message('Password', fields.password, 'required|passwwordLength')}
                </div>
              </Form.Item>

              <Form.Item
                label={
                  <span className="label">
                    <span className="required-asterisk">*</span>
                    Confirm Password
                  </span>
                }
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
                    'required|matchPassword|passwwordLength'
                  )}
                </div>
              </Form.Item>
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
                  Already have an account? <a href="/login">Log In</a>
                </p>
              </div>
              <Form.Item>
                <Button
                  className="login-form-button"
                  type="primary"
                  htmlType="submit"
                  onClick={handleSubmit}
                  loading={loading}
                >
                  Sign Up
                </Button>
              </Form.Item>
              <p
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontfamily: 'Josefin Sans, sans-serif',
                  fontWeight: 'bold',
                }}
              >
                Or Sign Up with
              </p>
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
            </Form>
          </div>
        </div>
      </Content>
    </Layout>
  );
};
export default Register;
