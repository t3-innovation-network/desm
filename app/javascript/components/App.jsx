import React, { useContext, useEffect, useState } from 'react';
import AlertNotice from '../components/shared/AlertNotice';
import checkLoginStatus from './../services/checkLoginStatus';
import { useSelector } from 'react-redux';
import { doLogin, setUser } from '../actions/sessions';
import { useDispatch } from 'react-redux';
import Routes from './Routes';
import Loader from './shared/Loader';
import ReduxToastr from 'react-redux-toastr';
import { toastr as toast } from 'react-redux-toastr';
import { AppContext } from '../contexts/AppContext';

const App = () => {
  const { setLoggedIn } = useContext(AppContext);
  const isLoggedIn = useSelector((state) => state.loggedIn);
  const dispatch = useDispatch();

  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(true);

  const handleLogin = (data) => {
    dispatch(doLogin());
    dispatch(setUser(data));
    setLoggedIn(true);
    toast.info('Signed In');
  };

  const checkLoginStatusAPI = async () => {
    await checkLoginStatus({ loggedIn: isLoggedIn })
      .then((response) => {
        /// Process any server errors
        if (response.error) {
          setErrors(response.error);
          return;
        }
        /// If we have something to change
        if (response.loggedIn) {
          dispatch(doLogin());
          dispatch(setUser(response.user));
        }
      })
      .finally(() => setLoading(false));
  };

  /**
   * Use effect with an emtpy array as second parameter, will trigger the 'checkLoginStatus'
   * action at the 'mounted' event of this functional component (It's not actually mounted,
   * but it mimics the same action).
   */
  useEffect(() => {
    checkLoginStatusAPI();
  }, []);

  return (
    <React.Fragment>
      {loading ? (
        <Loader />
      ) : errors ? (
        <AlertNotice message={errors} onClose={() => setErrors(null)} />
      ) : (
        <React.Fragment>
          <ReduxToastr position="top-center" className="desm-toast" />
          <Routes handleLogin={handleLogin} />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default App;
