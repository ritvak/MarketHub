import { notification } from 'antd';

const notificationHandler = data => {
  if (data.status === 200 || data.status === 201 || data?.success) {
    return {
      errorMsg: true,
      errorType: 'Success',
      errorMessage: data?.message,
      success: true,
    };
  }
  if (data.status === 401 || data.status === 403) {
    return {
      errorMsg: true,
      errorType: 'error',
      errorMessage: data?.message,
      logout: true,
    };
  }
  return {
    errorMsg: true,
    errorType: 'error',
    errorMessage: data?.message,
  };
};

export const openNotificationWithIconError = notificationData => {
  notification.open({
    message: notificationData?.errorType,
    description: notificationData?.errorMessage,
  });
};

export default notificationHandler;
