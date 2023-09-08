export const handleCollapse = () => async dispatch => {
  try {
    dispatch({ type: 'COLLAPSE' });
    return true;
  } catch (err) {
    return false;
  }
};

export const handleSidebarChange = key => async dispatch => {
  try {
    dispatch({ type: 'CHANGE_SIDEBAR', payload: key });
  } catch (err) {
    return false;
  }
};
