import classNames from 'classnames';
import { i18n } from '../../utils/i18n';

const NotificationDot = ({ show, type = 'filter' }) => {
  const cls = classNames(
    'position-absolute top-20 desm-notification-dot translate-middle bg-danger rounded-circle',
    { 'd-none': !show }
  );
  return (
    <span className={cls}>
      <span className="visually-hidden">{i18n.t(`ui.notifications.${type}`)}</span>
    </span>
  );
};

export default NotificationDot;
