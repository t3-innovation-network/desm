import { camelCase } from 'lodash';
import classNames from 'classnames';
import { i18n } from 'utils/i18n';
import { pageRoutes } from '../../services/pageRoutes';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const MAPPING_AVAILABLE_STEPS = {
  uploaded: 2,
  in_progress: 3,
  mapped: 3,
};

const Stepper = ({ stepperStep, mapping = null }) => {
  const maxStep = mapping?.id
    ? MAPPING_AVAILABLE_STEPS[mapping['status']] || stepperStep
    : stepperStep;

  const renderStep = (step, label) => {
    const withLink = step <= maxStep && stepperStep !== step;
    const cls = classNames('indicator-step', {
      active: stepperStep === step,
      complete: withLink,
    });
    let pathLabel = camelCase(label);
    const path =
      mapping?.id && withLink
        ? pageRoutes[`mapping${pathLabel.charAt(0).toUpperCase() + pathLabel.slice(1)}`](mapping.id)
        : null;
    return (
      <div className={cls}>
        {path ? (
          <Link
            to={path}
            className="indicator-stepnum indicator-stepnum__link d-block cursor-pointer"
          >
            <span className="indicator-stepnum__num indicator-stepnum__num--link rounded-circle text-center mr-1">
              {step}
            </span>
            {i18n.t(`ui.mapping.step.${label}`)}
          </Link>
        ) : (
          <div className="indicator-stepnum">
            <span className="indicator-stepnum__num indicator-stepnum__num--text mr-1">
              {step}.
            </span>
            {i18n.t(`ui.mapping.step.${label}`)}
          </div>
        )}
        <div className="progress">
          <div className="progress-bar"></div>
        </div>
        {maxStep === step && <a href="#" className="indicator-dot"></a>}
      </div>
    );
  };
  return (
    <div className="row indicator">
      {renderStep(1, mapping?.id ? 'ready_to_upload' : 'new')}
      {renderStep(2, 'uploaded')}
      {renderStep(3, 'in_progress')}
    </div>
  );
};

export default Stepper;
