import TopNav from '../shared/TopNav';
import SideBar from '../dashboard/SideBar';
import TopNavOptions from '../shared/TopNavOptions';

const DashboardContainer = (props) => (
  <div className="container-fluid d-flex flex-column h-100">
    <TopNav centerContent={() => <TopNavOptions mapSpecification viewMappings />} />

    <div className="row flex-grow-1">
      <div className="col-sm-6 col-md-3 col-lg-2 bg-dashboard-background no-sides-padding">
        <SideBar />
      </div>
      <div className="col-sm-6 col-md-9 col-lg-10 bg-dashboard-background-light pt-3">
        {props.children}
      </div>
    </div>
  </div>
);

export default DashboardContainer;
