import { Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { snakeCase } from 'lodash';
import { i18n } from '../../utils/i18n';

const RouteWithTitle = ({ pageType = 'default', ...props }) => {
  const key = snakeCase(pageType);

  return (
    <>
      <Helmet>
        <title>{i18n.t(`ui.pages.${key}.title`)}</title>
        <description>{i18n.t(`ui.pages.${key}.description`)}</description>
      </Helmet>
      <Route {...props} />
    </>
  );
};

export default RouteWithTitle;
