import {} from 'react';
import moment from 'moment';
import noDataImg from './../../../../assets/images/no-data-found.png';

export const stateStyle = (state) => {
  return {
    color: stateColorsList[state],
  };
};

const stateColorsList = {
  active: 'green',
  deactivated: 'grey',
  incomplete: 'red',
  complete: 'orange',
};

export const formatDateForInput = (dateString) => {
  return moment(dateString).locale(navigator.language).format(moment.HTML5_FMT.DATE);
};

export const tabStyle = { height: '30px', maxWidth: '30px' };
export const activeTabClass = 'bg-dashboard-background col-background';
export const inactiveTabClass = 'border-color-dashboard-dark col-dashboard';

export const line = () => {
  return <div className="col-4 border-bottom" style={{ bottom: '1rem' }}></div>;
};

export const TabGroup = ({ cssClass, children }) => <div className={cssClass}>{children}</div>;

export const RemovableTab = ({
  active,
  removeClickHandler,
  tabClickHandler,
  title,
  showCloseBtn = true,
}) => (
  <div
    className={`d-inline-block ${
      active
        ? 'dashboard-active-tab border-left border-right'
        : 'border bg-col-on-primary-light col-background'
    } rounded cursor-pointer p-2 pl-3 pr-4 position-relative`}
    onClick={tabClickHandler}
  >
    {title}
    {showCloseBtn && (
      <span
        className="font-weight-bold"
        onClick={(event) => {
          event.stopPropagation();
          removeClickHandler();
        }}
        style={{ position: 'absolute', top: '0px', right: '5px' }}
      >
        x
      </span>
    )}
  </div>
);

export const SmallRemovableTab = ({
  active,
  tabClickHandler,
  removeClickHandler,
  text,
  tooltipMsg,
}) => (
  <span className="cursor-pointer">
    <span
      className={`col-10 bg-dashboard-background ${
        active ? 'col-dashboard-highlight with-shadow' : 'col-background'
      } p-2 rounded text-center`}
      style={{
        maxWidth: '150px',
        opacity: '80%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxHeight: '31px',
      }}
      title={tooltipMsg}
      onClick={tabClickHandler}
    >
      {text}
    </span>
    <span
      className="col-2 bg-dashboard-background col-background p-2 rounded text-center font-weight-bold"
      style={{
        maxWidth: '30px',
        position: 'relative',
        right: '5px',
        maxHeight: '31px',
      }}
      title="Click to remove this item"
      onClick={(event) => {
        event.stopPropagation();
        removeClickHandler();
      }}
    >
      x
    </span>
  </span>
);

export const SmallAddTabBtn = ({ onClickHandler }) => (
  <span
    className="bg-dashboard-background-highlight col-background cursor-pointer font-weight-bold px-3 py-2 rounded text-center"
    onClick={onClickHandler}
  >
    +
  </span>
);

export const AddTabBtn = (props) => {
  const { onClickHandler, tooltipMsg } = props;

  return (
    <span
      className="p-2 text-center border rounded bg-dashboard-background-highlight col-background font-weight-bold cursor-pointer"
      title={tooltipMsg || 'Add new tab'}
      onClick={onClickHandler}
      style={{ maxWidth: '50px', fontSize: 'large' }}
    >
      +
    </span>
  );
};

export const NoDataFound = (props) => {
  const { text } = props;

  return (
    <>
      <div className="d-flex align-items-center justify-content-center h-100 w-100">
        <img src={noDataImg} alt="No data found" />
      </div>
      <div className="pl-5 pr-5 text-center font-italic">
        <h4>Couldn&apos;t find anything here!</h4>
        <p>{text}</p>
      </div>
    </>
  );
};

export const CenteredRoundedCard = (props) => {
  const { title, subtitle, children, styles = {} } = props;

  return (
    <div
      className="card"
      style={{
        ...styles,
        ...{
          borderRadius: '10px',
          height: 'fit-content',
        },
      }}
    >
      <div className="card-header">
        <div className="row">
          <div className="col">
            <h1 className="col-dashboard-highlight text-center">{title}</h1>
          </div>
        </div>
      </div>
      <div className="card-body">
        {subtitle}

        {children}
      </div>
    </div>
  );
};

export const ToggleBtn = (props) => {
  const { active, onClick, text } = props;

  return (
    <div
      className={`cursor-pointer col-10 ${
        active
          ? 'bg-dashboard-background-highlight col-background with-shadow'
          : 'bg-dashboard-background-highlight2 col-dashboard-highlight'
      }  p-2 rounded text-center`}
      style={{
        maxWidth: '150px',
        opacity: '80%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxHeight: '31px',
      }}
      title="Upload a File"
      onClick={onClick}
    >
      {text}
    </div>
  );
};

export const readFileContent = (file, onLoad, onError) => {
  const reader = new FileReader();

  reader.onload = () => {
    let content = reader.result;
    onLoad(content);
  };

  reader.onerror = function (e) {
    onError(`File could not be read! Code: ${e.target.error.code}`);
  };

  reader.readAsText(file);
};
