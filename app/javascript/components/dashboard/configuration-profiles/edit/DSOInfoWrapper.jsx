import { useState } from 'react';
import { useSelector } from 'react-redux';
import DSOMetaData from './DSOMetadata';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo, faUsers } from '@fortawesome/free-solid-svg-icons';
import { activeTabClass, inactiveTabClass, line, tabStyle } from '../utils';
import Agents from './Agents';
import SchemaFilesWrapper from './SchemaFilesWrapper';
import { useEffect } from 'react';

const DSOInfoWrapper = () => {
  const currentCP = useSelector((state) => state.currentCP);
  const currentDsoIndex = useSelector((state) => state.currentDSOIndex);
  const getDsos = () => currentCP.structure.standardsOrganizations || [];
  const [currentTab, setCurrentTab] = useState(0);

  const tabIcon = (index, icon, text) => {
    return (
      <div
        className={`col-1 rounded-circle cursor-pointer ${
          index === currentTab ? activeTabClass : inactiveTabClass
        } d-inline-flex justify-content-center align-items-center`}
        style={tabStyle}
        onClick={() => setCurrentTab(index)}
      >
        <FontAwesomeIcon icon={icon} title={text} />
      </div>
    );
  };

  const dsoInfoTabs = () => (
    <div className="row justify-content-center">
      {tabIcon(0, faInfo, 'DSO Basic Info')}
      {line()}
      {tabIcon(1, faUsers, 'Agents')}
    </div>
  );

  const renderTab = () => {
    const dsoMetaData = <DSOMetaData dsoData={getDsos()[currentDsoIndex] || {}} />;

    switch (currentTab) {
      case 0:
        return dsoMetaData;
      case 1:
        return <Agents />;
      case 2:
        return <SchemaFilesWrapper />;
      default:
        dsoMetaData;
    }
  };

  useEffect(() => setCurrentTab(0), [currentDsoIndex]);

  return (
    <>
      {dsoInfoTabs()}
      {renderTab()}
    </>
  );
};

export default DSOInfoWrapper;
