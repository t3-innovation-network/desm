import {} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setStep } from '../../../../actions/configurationProfiles';

const StepsAside = () => {
  const dispatch = useDispatch();
  const steps = [
    {
      number: 1,
      description: 'General data about the configuration profile',
    },
    {
      number: 2,
      description: 'Select the mapping predicates',
    },
    {
      number: 3,
      description: 'Select the abstract classes',
    },
    {
      number: 4,
      description: "DSO's information",
    },
  ];

  const currentStep = useSelector((state) => state.cpStep);

  return (
    <>
      {steps.map((step) => {
        return (
          <div className="row justify-content-center cp-step-row" key={step.number}>
            <div className="col-8">{step.description}</div>
            <div
              className={`col-4 rounded-circle cursor-pointer ${
                step.number === currentStep
                  ? 'bg-dashboard-background-highlight col-background'
                  : 'border-color-dashboard col-dashboard-highlight'
              } d-inline-flex justify-content-center align-items-center`}
              style={{ maxWidth: '50px', height: '50px' }}
              onClick={() => dispatch(setStep(step.number))}
            >
              {step.number}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default StepsAside;
