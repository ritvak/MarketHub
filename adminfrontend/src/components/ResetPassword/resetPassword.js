import { useState } from 'react';
import { Button, Form, Input, Layout } from 'antd';
import APIUtils from '../../helpers/APIUtils';
import './resetPassword.css';
import { useNavigate } from 'react-router-dom';
const { Content } = Layout;

const api = msg => new APIUtils(msg);

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleChange = e => {
    setPassword(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Extract the token from the URL (modify this code based on how your URL is structured)
      const urlParts = window.location.pathname.split('/');
      const token = urlParts[urlParts.length - 1]; // Get the last part of the URL
      console.log('Extracted token:', token);
      console.log('Extracted token:', typeof token);

      // Send both token and newPassword in the request body
      await api(true).resetPassword(password,token);
  
      setLoading(false);
      navigate('/login');
    } catch (error) {
      setLoading(false);
      console.error('Error resetting password:', error);
    }
  };
  
  
  

  return (
    <Layout>
      <Content>
        <div className="reset-password-page">
          <div className="reset-password-box">
            <Form className="reset-password-form">
              <p className="form-title">Reset Password</p>
              <br />
              <Form.Item label="New Password" name="newPassword">
                <Input
                  type="password"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className="custom-input"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  className="reset-password-form-button"
                  type="primary"
                  htmlType="submit"
                  onClick={handleSubmit}
                  loading={loading}
                >
                  Reset Password
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default ResetPassword;
