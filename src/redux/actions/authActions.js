import ApiUtils from '../../helpers/APIUtils';

const api = msg => new ApiUtils(msg);

export const loadUser = () => async dispatch => {
  try {
    const token = localStorage.getItem('token');

    if (!token) return dispatch({ type: 'NEW_USER' });

    const res = await api().loadUser({
      authorization: token,
    });

    console.log(res.data.userData);
    dispatch({ type: 'EXISTING_USER', payload: res.data.userData });
    return true;
  } catch (err) {
    dispatch({ type: 'AUTH_FAILED' });
    return false;
  }
};

export const register = data => async dispatch => {
  try {
    const res = await api(true).register(data);
    dispatch({ type: 'EXISTING_USER', payload: res.data.userData });
    localStorage.setItem('token', res.data.userData.token);
    await loadUser();

    return true;
  } catch (e) {
    return false;
  }
};

export const login = data => async dispatch => {
  try {
    const res = await api(true).login(data);
    dispatch({ type: 'EXISTING_USER', payload: res.data.userData });
    localStorage.setItem('token', res.data.userData.token);

    return true;
  } catch (err) {
    dispatch({ type: 'AUTH_FAILED' });
    return false;
  }
};

export const logout = () => async dispatch => {
  try {
    dispatch({ type: 'User LoggedOut' });
    localStorage.removeItem('token');
    return true;
  } catch (err) {
    return false;
  }
};
