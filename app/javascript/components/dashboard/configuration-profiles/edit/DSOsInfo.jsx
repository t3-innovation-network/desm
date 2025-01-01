import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cloneDeep } from 'lodash';
import {
  setCurrentConfigurationProfile,
  setCurrentDSOIndex,
  setEditCPErrors,
  setSavingCP,
} from '../../../../actions/configurationProfiles';
import DSOInfoWrapper from './DSOInfoWrapper';
import updateCP from '../../../../services/updateCP';
import { AddTabBtn, NoDataFound, RemovableTab, TabGroup } from '../utils';
import ConfirmDialog from '../../../shared/ConfirmDialog';

const DSOTab = (props) => {
  const { active, dso, onClickHandler, onRemoveHandler } = props;

  return (
    <RemovableTab
      active={active}
      removeClickHandler={onRemoveHandler}
      tabClickHandler={onClickHandler}
      title={dso.name}
    />
  );
};

const DSOsInfo = () => {
  const currentCP = useSelector((state) => state.currentCP);
  const currentDsoIndex = useSelector((state) => state.currentDSOIndex);
  const dispatch = useDispatch();
  const dsos = currentCP.structure.standardsOrganizations || [];
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [idxToRemove, setIdxToRemove] = useState(null);
  const confirmationMsg = `Please confirm if you really want to remove the DSO ${dsos[idxToRemove]?.name}`;

  const addDso = () => {
    let localCP = cloneDeep(currentCP);
    let newIdx = localCP.structure.standardsOrganizations?.length || 0;
    localCP.structure.standardsOrganizations = [
      ...dsos,
      {
        name: `DSO ${dsos.length + 1}`,
        dsoAgents: [],
        associatedSchemas: [],
      },
    ];
    dispatch(setCurrentConfigurationProfile(localCP));
    dispatch(setCurrentDSOIndex(newIdx));
  };

  const dsoTabs = () => {
    return dsos.map((dso, index) => {
      return (
        <DSOTab
          active={index === currentDsoIndex}
          dso={dso}
          key={index}
          onClickHandler={() => dispatch(setCurrentDSOIndex(index))}
          onRemoveHandler={() => {
            setIdxToRemove(index);
            setConfirmationVisible(true);
          }}
        />
      );
    });
  };

  const handleRemoveDSO = () => {
    setConfirmationVisible(false);
    // clone currentCP and remove the DSO
    let localCP = cloneDeep(currentCP);
    localCP.structure.standardsOrganizations.splice(idxToRemove, 1);
    // update idx as 0 in case of success, otherwise keep the same idx
    save(localCP)
      .then(() => dispatch(setCurrentDSOIndex(0)))
      .catch(() => {});
  };

  const save = (data) => {
    dispatch(setSavingCP(true));

    return updateCP(currentCP.id, data).then((response) => {
      if (response.error) {
        dispatch(setEditCPErrors(response.error));
        setSavingCP(null);
        return Promise.reject(false);
      }

      dispatch(setCurrentConfigurationProfile(response.configurationProfile));
      setSavingCP(false);
      return Promise.resolve(true);
    });
  };

  return (
    <>
      {confirmationVisible && (
        <ConfirmDialog
          onRequestClose={() => setConfirmationVisible(false)}
          onConfirm={handleRemoveDSO}
          visible={confirmationVisible}
        >
          <h2 className="text-center">Attention!</h2>
          <h5 className="mt-3 text-center"> {confirmationMsg}</h5>
        </ConfirmDialog>
      )}
      <div className="mt-5 w-100">
        <TabGroup cssClass={'ms-3 me-3'}>
          {dsos.length ? dsoTabs() : ''}
          <AddTabBtn
            onClickHandler={() => addDso()}
            tooltipMsg={'Create a new DSO for this Configuration Profile'}
          />
        </TabGroup>
      </div>
      {dsos.length ? (
        <div className="mt-5 w-100">
          <DSOInfoWrapper />
        </div>
      ) : (
        <div className="mt-5">
          {
            <NoDataFound
              text={`This Configuration Profile didn't provide any DSO information yet. You can add one clicking on the "+" button`}
            />
          }
        </div>
      )}
    </>
  );
};

export default DSOsInfo;
