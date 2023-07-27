import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Routing from './Routing';
import store from './redux/store';
import { loadUser } from './redux/actions/authActions';
import { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    (async () => {
      await store.dispatch(loadUser());
    })();
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routing />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
