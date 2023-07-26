import axios from "axios";
import { notification } from "antd";
import store from "../redux/store";
import { logout } from "../redux/actions/authActions";

class ApiUtils {
  constructor(
    message = false,
    request = true,
    appendAuth = true,
    response = true
  ) {
    this.axios = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/api`,
    });

    if (request) {
      this.axios.interceptors.request.use(
        (config) => {
          const myConfig = { ...config };
          if (appendAuth) {
            const { auth } = store.getState();
            if (auth.isAuthenticated)
              myConfig.headers.authorization = auth.token;
          }
          return myConfig;
        },
        (error) => Promise.reject(error)
      );
    }

    if (response) {
      this.axios.interceptors.response.use(
        (config) => {
          const myConfig = { ...config };
          if (message) {
            notification.success({
              message: "Success",
              description: myConfig.data.message,
            });
          }
          return myConfig;
        },
        (error) => {
          if (
            error.response.data.status === 401 ||
            error.response.data.status === 403
          ) {
            const { auth } = store.getState();
            notification.error({
              message: "Error",
              description: error.response.data.message,
            });
            localStorage.removeItem("token");
            if (auth.token) {
              store.dispatch(logout());
              setTimeout(() => window.location.assign("/login"), 1000);
            }
          } else {
            notification.error({
              message: "Error",
              description: error.response.data.message,
            });
          }
          return Promise.reject(error);
        }
      );
    }
  }

  login = (data) =>
    this.axios({
      method: "POST",
      url: "/admin/adminLogin",
      data,
    });

  getAllUsers = () =>
    this.axios({
      method: "GET",
      url: "/user/getUser",
    });

  getAllProducts = () =>
    this.axios({
      method: "GET",
      url: "/products/getProducts",
    });

  blockUser = (id) =>
    this.axios({
      method: "PUT",
      url: `/user/blockUser/${id}`,
    });

  unblockUser = (id) =>
    this.axios({
      method: "PUT",
      url: `/user/unblockUser/${id}`,
    });

  rejectPost = (productID) =>
    this.axios({
      method: "PUT",
      url: `/products/rejectProduct/${productID}`,
    });

  approvePost = (productID) =>
    this.axios({
      method: "PUT",
      url: `/products/approveProduct/${productID}`,
    });

  changePasswordAPI = (oldPassword, newPassword) =>
    this.axios({
      method: "POST",
      url: "/admin/changePassword",
      data: {
        oldPassword,
        newPassword,
      },
    });
}

export default ApiUtils;
