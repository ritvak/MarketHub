import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { gapi } from 'gapi-script';
import Routing from './Routing';
import store from './redux/store';
import { loadUser } from './redux/actions/authActions';
import Loader from './shared/loader';

const App = () => {
  const [isLoaded, setLoaded] = useState(false);

  const start = () => {
    gapi.client.init({
      clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      scope: '',
    });
  };

  useEffect(() => {
    (async () => {
      gapi.load('client:auth2', start);

      await store.dispatch(loadUser());
      setLoaded(true);
    })();
  }, []);

  if (!isLoaded) return <Loader />;

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routing />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
