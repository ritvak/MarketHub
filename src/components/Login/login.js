import { useState } from "react";
import { Button, Form, Input, Layout } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useSimpleReactValidator from "../../helpers/useReactSimpleValidator";
import { login } from "../../redux/actions/authActions";
import "./login.css";

const { Content } = Layout;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    email: null,
    password: null,
  });

  const [validator, setValidator] = useSimpleReactValidator();

  const handleChange = (e, field) => {
    setFields((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (validator.allValid()) {
      const success = await dispatch(login(fields));
      setLoading(false);

      if (success) {
        navigate("/dashboard");
      }
    } else {
      setLoading(false);
      validator.getErrorMessages();
      setValidator(true);
    }
  };

  return (
    <Layout>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="container">
          <h1>Admin Login</h1>
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
            }}
            autoComplete="off"
          >
            <Form.Item label="email" name="email">
              <Input
                type="text"
                placeholder="email"
                value={fields.email}
                onChange={(e) => handleChange(e, "email")}
                autoComplete="new-password"
              />
              <div
                className={validator.errorMessages.email ? "error-message" : ""}
              >
                {validator.message("Email", fields.email, "required|email")}
              </div>
            </Form.Item>

            <Form.Item label="Password" name="password">
              <Input.Password
                placeholder="password"
                value={fields.password}
                onChange={(e) => handleChange(e, "password")}
                autoComplete="new-password"
              />
              <div
                className={
                  validator.errorMessages.password ? "error-message" : ""
                }
              >
                {validator.message("Password", fields.password, "required")}
              </div>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                onClick={handleSubmit}
                loading={loading}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};
export default Login;
