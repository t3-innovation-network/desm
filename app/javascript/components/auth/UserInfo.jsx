import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { AppContext } from '../../contexts/AppContext';

const UserInfo = () => {
  const { organization } = useContext(AppContext);

  const isLoggedIn = useSelector((state) => state.loggedIn);
  const user = useSelector((state) => state.user);

  return (
    <>
      {isLoggedIn ? (
        <Link className="nav-link col-on-primary" to="/edit-profile">
          <FontAwesomeIcon icon={faUser} className="mr-2" />
          {user && <span>{user.fullname + (organization ? ' @ ' + organization.name : '')}</span>}
        </Link>
      ) : (
        ''
      )}
    </>
  );
};

export default UserInfo;
