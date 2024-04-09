import coffeeWait from '../../../assets/images/coffee-wait.gif';

/**
 * Props:
 * @prop {String} cssClass
 * @prop {String} message
 * @prop {Boolean} noPadding
 * @prop {Boolean} smallSpinner
 * @prop {Boolean} showImage
 */
const Loader = (props) => {
  /**
   * Elements from props
   */
  const { message, noPadding, smallSpinner, showImage, cssClass } = props;

  return (
    <div className={'container text-center' + (noPadding ? '' : ' p-5') + (` ${cssClass}` || '')}>
      {showImage ? (
        ''
      ) : (
        <div className={'spinner-grow' + (smallSpinner ? ' spinner-grow-sm' : '')} role="status" />
      )}
      {message ? (
        <div className="card borderless bg-transparent mt-5">
          <div className="card-body">
            <h3>{message}</h3>
            {showImage ? (
              <img
                src={coffeeWait}
                alt="Go get a coffee while waiting"
                style={{ width: '25%', padding: '2rem' }}
              />
            ) : (
              ''
            )}
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Loader;
