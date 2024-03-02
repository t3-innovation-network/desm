import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
    let localCP = currentCP;
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
    save();
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
    let localCP = currentCP;
    localCP.structure.standardsOrganizations.splice(idxToRemove, 1);

    dispatch(setCurrentConfigurationProfile(localCP));
    save();
  };

  const save = () => {
    dispatch(setSavingCP(true));
    dispatch(setCurrentDSOIndex(0));

    updateCP(currentCP.id, currentCP).then((response) => {
      if (response.error) {
        dispatch(setEditCPErrors(response.error));
        dispatch(setSavingCP(false));
        return;
      }

      dispatch(setCurrentConfigurationProfile(response.configurationProfile));
      dispatch(setSavingCP(false));
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
        <TabGroup cssClass={'ml-3 mr-3'}>
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
