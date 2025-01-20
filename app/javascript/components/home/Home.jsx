import TopNav from '../shared/TopNav';
import LeftSideHome from './LeftCol';
import RightSideHome from './RightCol';
import TopNavOptions from '../shared/TopNavOptions';

const Home = () => (
  <>
    <TopNav centerContent={() => <TopNavOptions mapSpecification viewMappings />} />
    <div className="container-fluid desm-content">
      <div className="row">
        <LeftSideHome />
        <RightSideHome />
      </div>
    </div>
  </>
);

export default Home;
