const initialState = {
  selectedChat: {},
  chatList: [],
  onlineUsers: [],
};

const ChatReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'CHANGE_SELECTED_CHAT':
      return {
        ...state,
        selectedChat: payload,
      };
    case 'STORE_DATA':
      return {
        ...state,
        chatList: payload,
      };
    case 'STORE_ONLINE_USERS':
      return {
        ...state,
        onlineUsers: payload,
      };
    default:
      return state;
  }
};

export default ChatReducer;
