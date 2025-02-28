import {} from 'react';
import { Link } from 'react-router-dom';
import AuthButton from '../auth/AuthButton';
import DashboardBtn from './DashboardBtn';
import UserInfo from '../auth/UserInfo';
import logo from '../../../assets/images/t3-logo.png';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

const TopNav = (props) => {
  return (
    <Navbar
      expand="lg"
      className="navbar-with-border with-shadow align-items-center desm-navbar bg-white py-2 w-100"
    >
      <Container fluid>
        <Link to="/" className="navbar-brand desm-navbar__brand">
          <img src={logo} alt="Logo" className="desm-image--logo" />
        </Link>
        <Navbar.Toggle aria-controls="toggle-nav" />
        <Navbar.Collapse id="toggle-nav">
          {props.centerContent()}
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <UserInfo />
            </li>
            {!window.location.pathname.includes('dashboard') && (
              <li className="nav-item">
                <DashboardBtn />
              </li>
            )}
            <li className="nav-item">
              <AuthButton />
            </li>
          </ul>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNav;
