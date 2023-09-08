import { useState} from 'react';
import { Button, Form, Input, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import useSimpleReactValidator from '../../helpers/useReactSimpleValidator';
import APIUtils from '../../helpers/APIUtils';
import './forgotPassword.css';


const { Content } = Layout;

const api = msg => new APIUtils(msg);

const ForgotPassword = () => {

  const navigate = useNavigate();

  // const {
  //   token: { colorBgContainer },
  // } = theme.useToken();

  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    email: null,
    password: null,
  });

  const [validator, setValidator] = useSimpleReactValidator();

  const handleChange = (e, field) => {
    setFields(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (validator.allValid()) {
      await api(true).forgotPassword(fields);
      setLoading(false);
      navigate('/login');
    } else {
      setLoading(false);
      validator.getErrorMessages();
      setValidator(true);
    }
  };

  return (
    <Layout>
  {/*<GlobalHeader title={'Products'} />*/}
  <Content>
    <div className="login-page">
      <div className="login-box">
        <Form className="login-form" name="login-form" initialValues={{ remember: true }} layout="vertical">
          <p className="form-title">Forgot Password</p>
          <br/>
          <Form.Item className="" label={ <span className="label">
            <span className="required-asterisk">*</span> Email </span> } name="email" > <Input type="text" placeholder="Enter your Email" value={fields.email} onChange={e=> handleChange(e, 'email')} autoComplete="new-password" className="custom-input" /> <div className={validator.errorMessages.email ? 'error-message' : '' }> {validator.message('Email', fields.email, 'required|email')} </div>
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
export default ForgotPassword;
