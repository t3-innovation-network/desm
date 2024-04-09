import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCurrentConfigurationProfile,
  setEditCPErrors,
  setSavingCP,
} from '../../../../actions/configurationProfiles';
import updateCP from '../../../../services/updateCP';
import ConfirmDialog from '../../../shared/ConfirmDialog';
import { NoDataFound, SmallAddTabBtn, SmallRemovableTab, TabGroup } from '../utils';
import ConceptSchemeMetadata from './ConceptSchemeMetadata';

const ConceptSchemesWrapper = ({ schemaFileIdx }) => {
  const currentCP = useSelector((state) => state.currentCP);
  const currentDSOIndex = useSelector((state) => state.currentDSOIndex);
  const [schemaFile, setSchemaFile] = useState({});
  const [conceptSchemes, setConceptSchemes] = useState([]);
  const [activeTab, setActiveTab] = useState(-1);
  const [idxToRemove, setIdxToRemove] = useState(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const confirmationMsg = `Please confirm if you really want to remove the concept scheme file ${conceptSchemes[idxToRemove]?.name}`;
  const dispatch = useDispatch();

  const conceptSchemeBtns = () => {
    return conceptSchemes.map((file, idx) => {
      return (
        <SmallRemovableTab
          active={activeTab === idx}
          key={idx}
          removeClickHandler={() => {
            setIdxToRemove(idx);
            setConfirmationVisible(true);
          }}
          tabClickHandler={() => setActiveTab(idx)}
          text={file.name || ''}
          tooltipMsg={`View/Edit ${file.name || ''}`}
        />
      );
    });
  };

  const handleAddConceptScheme = () => {
    let localCP = currentCP;
    let localFiles = [
      ...conceptSchemes,
      {
        name: `Concept Scheme ${conceptSchemes.length + 1}`,
      },
    ];

    localCP.structure.standardsOrganizations[currentDSOIndex].associatedSchemas[
      schemaFileIdx
    ].associatedConceptSchemes = localFiles;

    dispatch(setCurrentConfigurationProfile(localCP));
    save(localCP);
    setConceptSchemes(localFiles);
    setActiveTab(localFiles.length - 1);
  };

  const handleRemoveConceptScheme = () => {
    setConfirmationVisible(false);
    let localCP = currentCP;

    localCP.structure.standardsOrganizations[currentDSOIndex].associatedSchemas[
      schemaFileIdx
    ].associatedConceptSchemes.splice(idxToRemove, 1);

    const conceptSchemes =
      localCP.structure.standardsOrganizations[currentDSOIndex].associatedSchemas[schemaFileIdx]
        .associatedConceptSchemes;

    setActiveTab(conceptSchemes.length ? 0 : -1);
    dispatch(setCurrentConfigurationProfile(localCP));
    save(localCP);
  };

  const save = (cp) => {
    dispatch(setSavingCP(true));

    updateCP(currentCP.id, cp).then((response) => {
      if (response.error) {
        dispatch(setEditCPErrors(response.error));
        dispatch(setSavingCP(false));
        return;
      }
      dispatch(setSavingCP(false));
    });
  };

  useEffect(() => {
    const schemaFiles =
      currentCP.structure.standardsOrganizations[currentDSOIndex].associatedSchemas || [];

    const schemaFile = schemaFiles[schemaFileIdx] || {};
    setSchemaFile(schemaFile);

    const conceptSchemes = schemaFile.associatedConceptSchemes || [];
    setConceptSchemes(conceptSchemes);
    setActiveTab(conceptSchemes.length ? 0 : -1);
  }, [currentCP, currentDSOIndex, schemaFileIdx]);

  return (
    <>
      {confirmationVisible && (
        <ConfirmDialog
          onRequestClose={() => setConfirmationVisible(false)}
          onConfirm={() => handleRemoveConceptScheme()}
          visible={confirmationVisible}
        >
          <h2 className="text-center">Attention!</h2>
          <h5 className="mt-3 text-center">{confirmationMsg}</h5>
        </ConfirmDialog>
      )}
      <div className="mt-5 ml-3">
        <TabGroup>
          {conceptSchemeBtns()} {<SmallAddTabBtn onClickHandler={handleAddConceptScheme} />}{' '}
        </TabGroup>
      </div>
      {conceptSchemes.length ? (
        <div className="mt-5">
          <ConceptSchemeMetadata schemaFileIdx={schemaFileIdx} conceptSchemeIdx={activeTab} />
        </div>
      ) : (
        <NoDataFound
          text={`The Schema File ${schemaFile.name} does not have any concept scheme files declared yet. You can add one by clicking on the "+" button`}
        />
      )}
    </>
  );
};

export default ConceptSchemesWrapper;
