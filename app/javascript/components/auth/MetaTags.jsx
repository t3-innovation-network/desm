import { Helmet } from 'react-helmet';
import { snakeCase } from 'lodash';
import { i18n } from '../../utils/i18n';

const MetaTags = ({ pageType = 'default' }) => {
  const key = snakeCase(pageType);
  const title = i18n.t(`ui.pages.${key}.title`);
  const description = i18n.t(`ui.pages.${key}.description`);

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {/* End standard metadata tags */}
      {/* OpenGraph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {/* End OpenGraph tags */}
      {/* Twitter tags */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {/* End Twitter tags */}
    </Helmet>
  );
};

export default MetaTags;
