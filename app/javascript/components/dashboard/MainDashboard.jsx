import React, { Component } from 'react';
import Registration from '../auth/Registration';

export default class MainDashboard extends Component {
  render() {
    return (
      <div>
        <h1>Dashboard</h1>
        <Registration />
      </div>
    );
  }
}