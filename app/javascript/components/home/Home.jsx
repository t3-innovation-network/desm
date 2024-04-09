import TopNav from '../shared/TopNav';
import LeftSideHome from './LeftCol';
import RightSideHome from './RightCol';
import TopNavOptions from '../shared/TopNavOptions';

const Home = () => (
  <div className="container-fluid">
    <TopNav centerContent={() => <TopNavOptions mapSpecification viewMappings />} />
    <div className="row">
      <LeftSideHome />
      <RightSideHome />
    </div>
  </div>
);

export default Home;
