import { useContext, useEffect, useState } from 'react';
import AlertNotice from '../components/shared/AlertNotice';
import checkLoginStatus from './../services/checkLoginStatus';
import { useSelector } from 'react-redux';
import { doLogin, setUser } from '../actions/sessions';
import { useDispatch } from 'react-redux';
import Routes from './Routes';
import Loader from './shared/Loader';
import ReduxToastr from 'react-redux-toastr';
import { AppContext } from '../contexts/AppContext';
import { showInfo } from '../helpers/Messages';
import { TOASTR_OPTIONS } from '../helpers/Constants';

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
    showInfo('Signed In');
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
    <>
      {loading ? (
        <Loader />
      ) : errors ? (
        <AlertNotice message={errors} onClose={() => setErrors(null)} />
      ) : (
        <>
          <ReduxToastr
            position="top-center"
            className="desm-toast"
            removeOnHover={false}
            removeOnHoverTimeOut={0}
            timeOut={TOASTR_OPTIONS.default.timeOut}
            preventDuplicates
          />
          <Routes handleLogin={handleLogin} />
        </>
      )}
    </>
  );
};

export default App;
