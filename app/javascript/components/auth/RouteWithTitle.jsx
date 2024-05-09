import { Route } from 'react-router-dom';
import MetaTags from './MetaTags';

const RouteWithTitle = ({ pageType = 'default', ...props }) => {
  return (
    <>
      <MetaTags pageType={pageType} />
      <Route {...props} />
    </>
  );
};

export default RouteWithTitle;
