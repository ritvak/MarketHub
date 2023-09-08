import axios from 'axios';
import { notification } from 'antd';
import store from '../redux/store';
import { logout } from '../redux/actions/authActions';

const TOKEN_NAME = process.env.REACT_APP_TOKEN_NAME;

class ApiUtils {
  constructor(message = false, request = true, appendAuth = true, response = true) {
    this.axios = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/api`,
    });

    if (request) {
      this.axios.interceptors.request.use(
        config => {
          const myConfig = { ...config };
          if (appendAuth) {
            const { auth } = store.getState();
            if (auth.isAuthenticated) myConfig.headers.authorization = auth.token;
          }
          return myConfig;
        },
        error => Promise.reject(error)
      );
    }

    if (response) {
      this.axios.interceptors.response.use(
        config => {
          const myConfig = { ...config };
          if (message) {
            notification.success({
              message: 'Success',
              description: myConfig.data.message,
            });
          }
          return myConfig;
        },
        error => {
          console.debug(error.response.data.status);
          if (error.response.data.status === 401 || error.response.data.status === 403) {
            const { auth } = store.getState();
            notification.error({
              message: 'Error',
              description: error.response.data.message,
            });
            localStorage.removeItem('token');
            if (auth.token) {
              store.dispatch(logout());
              setTimeout(() => window.location.assign('/login'), 1000);
            }
          } else {
            console.debug(error.response.data.status);
            notification.error({
              message: 'Error',
              description: error.response.data.message,
            });
          }
          return Promise.reject(error);
        }
      );
    }
  }

  login = data =>
    this.axios({
      method: 'POST',
      url: '/users/login',
      data,
    });
  
  facebookLogin = data =>
    this.axios({
      method: 'GET',
      url: '/users/facebook',
      data,
    });
  
  register = data =>
    this.axios({
      method: 'POST',
      url: '/users/register',
      data,
    });
  
  forgotPassword = data =>
    this.axios({
      method: 'POST',
      url: '/users/forgot-password',
      data,
    });
  
  changePasswordGet = (id, token, headers) =>
    this.axios({
      method: 'GET',
      url: `/users/reset-password/${id}/${token}`,
      headers,
    });
  
  changePasswordPost = (id, token, data) =>
    this.axios({
      method: 'POST',
      url: `/users/reset-password/${id}/${token}`,
      data,
    });
  
  loadUser = headers =>
    this.axios({
      method: 'GET',
      url: '/users/me',
      headers,
    });

  getAllUsers = () =>
    this.axios({
      method: 'GET',
      url: '/users',
    }, {withCredentials:true});

  createChat = data =>
    this.axios({
      method: 'POST',
      url: '/chats/',
      data,
    });

  getAllChats = headers =>
    this.axios({
      method: 'GET',
      url: '/chats/getAllChats',
      headers,
    });

  getAllMessages = data =>
    this.axios({
      method: 'POST',
      url: '/message/getMessages',
      data,
    });

  sendMessage = data =>
    this.axios({
      method: 'POST',
      url: '/message/sendMessage',
      data,
    });

  getALlProducts = data =>
    this.axios({
      method: 'POST',
      url: '/product/',
      data,
    });
  
  getUserProducts = data =>
    this.axios({
      method: 'POST',
      url: '/product/my-products',
      data,
    });  


  getOneProduct = data =>
    this.axios({
      method: 'POST',
      url: '/product/getone',
      data,
    });
  suggestion = data =>
    this.axios({
      method: 'POST',
      url: '/product/suggestion',
      data,
    });

  sorting = data =>
    this.axios({
      method: 'POST',
      url: '/product/sorting',
      data,
    });

  setLike = data =>
    this.axios({
      method: 'POST',
      url: '/likes/like',
      data,
    });
  setRating = data =>
    this.axios({
      method: 'POST',
      url: '/ratings/rating',
      data,
    });
  getRatings = data =>
    this.axios({
      method: 'POST',
      url: '/ratings/',
      data,
    });
  // getRatings
  getALlComments = data =>
    this.axios({
      method: 'POST',
      url: '/comment/',
      data,
    });
  createComment = data =>
    this.axios({
      method: 'POST',
      url: '/comment/create',
      data,
    });
  setContactUs = data =>
    this.axios({
      method: 'POST',
      url: '/contact-us',
      data,
    });

  paymentCheckout = data =>
    this.axios({
      method: 'POST',
      url: '/stripe/create-checkout-session',
      data,
    });

  getOrders = data =>
    this.axios({
      method: 'POST',
      url: '/orders/',
      data,
    });
  
  uploadImage = data =>
    this.axios({
      method: 'PATCH',
      url: '/users/my-profile/edit-profile/upload-Image',
      data,
    });

  updateDetails = data =>
    this.axios({
      method: 'PATCH',
      url: '/users/my-profile/edit-profile/update-Details',
      data,
    });
  
  deleteUser = (id) =>
    this.axios({
      method: 'DELETE',
      url: `/users/my-profile/edit-profile/${id}`,
    });

  updatePassword = (id, data) =>
    this.axios({
      method: 'PATCH',
      url: `/users/my-profile/edit-profile/change-password/${id}`,
      data,
    });

  addProduct = data =>
    this.axios({
      method: 'POST',
      url: '/product/addProduct',
      data,
    });

  deleteProduct = (id, headers) =>
    this.axios({
      method: 'DELETE',
      url: `/product/deleteProduct/${id}`,
      headers,
    });
  
  updateProductDetails = data =>
    this.axios({
      method: 'PATCH',
      url: '/product/update-product',
      data,
    });
}

export default ApiUtils;
