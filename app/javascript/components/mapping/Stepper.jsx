const Stepper = ({ stepperStep }) => (
  <div className="row indicator">
    <div
      className={
        'indicator-step' +
        (stepperStep == 1 ? ' active' : '') +
        (stepperStep > 1 ? ' complete' : '')
      }
    >
      <div className="indicator-stepnum">1. Upload Specification</div>
      <div className="progress">
        <div className="progress-bar"></div>
      </div>
      {stepperStep === 1 && <a href="#" className="indicator-dot"></a>}
    </div>

    <div
      className={
        'indicator-step' +
        (stepperStep == 2 ? ' active' : '') +
        (stepperStep > 2 ? ' complete' : '')
      }
    >
      <div className="indicator-stepnum">2. Map to Domains</div>
      <div className="progress">
        <div className="progress-bar"></div>
      </div>
      {stepperStep === 2 && <a href="#" className="indicator-dot"></a>}
    </div>

    <div className={'indicator-step' + (stepperStep == 3 ? ' active' : '')}>
      <div className="indicator-stepnum">3. Align and Fine Tune</div>
      <div className="progress">
        <div className="progress-bar"></div>
      </div>
      {stepperStep === 3 && <a href="#" className="indicator-dot"></a>}
    </div>
  </div>
);

export default Stepper;
