const initialState = {
  isAuthenticated: false,
  token: null,
  user: {},
};

const AuthReducer = (state = initialState, action) => {
  const { type, payload, token } = action;

  switch (type) {
    case 'EXISTING_USER':
      return {
        ...state,
        isAuthenticated: true,
        token: payload.token,
        user: payload._id,
      };
    case 'LOGOUT':
      return {
        isAuthenticated: false,
        token: null,
        user: {},
      };
    case 'NEW_USER':
    case 'AUTH_FAILED':
      return initialState;
    default:
      return state;
  }
};

export default AuthReducer;
