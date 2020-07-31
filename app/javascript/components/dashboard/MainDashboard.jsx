import React, { Component } from 'react';
import Registration from '../auth/Registration';
import TopNav from "../shared/TopNav";
import SideBar from './SideBar';

export default class MainDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: "main"
    }

    this.handlePageChange = this.handlePageChange.bind(this);
  }

  handlePageChange(newPage){
    this.setState({
      page: newPage
    })
  }

  renderContent() {
    switch (this.state.page) {
      case "main":
        return (
          <h1>Main Dashboard</h1>
        )
        break;
      case "users":
        return <Registration />
        break;
      default:
        return <Registration />
        break;
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="wrapper">
          <TopNav
            loggedIn={this.props.loggedIn}
            handleLogout={this.props.handleLogout}
          />
          <div className="container-fluid container-wrapper">
            <div className="row">
              <SideBar
                handlePageChange={this.handlePageChange}
              />
              { this.renderContent() }
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}