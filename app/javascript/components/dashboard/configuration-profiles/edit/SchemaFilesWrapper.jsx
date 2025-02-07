import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCurrentConfigurationProfile,
  setEditCPErrors,
  setSavingCP,
} from '../../../../actions/configurationProfiles';
import updateCP from '../../../../services/updateCP';
import ConfirmDialog from '../../../shared/ConfirmDialog';
import { AddTabBtn, NoDataFound, RemovableTab, TabGroup } from '../utils';
import SingleSchemaFileWrapper from './SingleSchemaFileWrapper';

const SchemaFilesWrapper = () => {
  const currentCP = useSelector((state) => state.currentCP);
  const currentDSOIndex = useSelector((state) => state.currentDSOIndex);
  const [idxToRemove, setIdxToRemove] = useState(null);
  const [schemaFiles, setSchemaFiles] = useState([]);
  const [activeTab, setActiveTab] = useState(-1);
  const dispatch = useDispatch();
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const confirmationMsg = `Please confirm if you really want to remove file ${schemaFiles[idxToRemove]?.name}`;

  const handleAddFile = () => {
    let localCP = currentCP;
    let localFiles = [
      ...schemaFiles,
      {
        name: `Schema File N${schemaFiles.length + 1}`,
        origin: '',
        description: '',
        associatedAbstractClass: '',
        associatedConceptSchemes: [],
      },
    ];
    localCP.structure.standardsOrganizations[currentDSOIndex].associatedSchemas = localFiles;

    dispatch(setCurrentConfigurationProfile(localCP));
    save(localCP);
    setActiveTab(localFiles.length - 1);
  };

  const handleRemoveFile = () => {
    setConfirmationVisible(false);
    let localCP = currentCP;
    localCP.structure.standardsOrganizations[currentDSOIndex].associatedSchemas.splice(
      idxToRemove,
      1
    );

    let newSchemas = localCP.structure.standardsOrganizations[currentDSOIndex].associatedSchemas;

    setActiveTab(newSchemas.length - 1);
    save(localCP);
  };

  const save = async (cp) => {
    dispatch(setSavingCP(true));

    const { configurationProfile, error } = await updateCP(currentCP.id, cp);

    if (error) {
      dispatch(setEditCPErrors(error));
      dispatch(setSavingCP(false));
      return;
    }

    dispatch(setCurrentConfigurationProfile(configurationProfile));
    dispatch(setSavingCP(false));
  };

  const schemaFileTabs = () => {
    return schemaFiles.map((file, idx) => {
      return (
        <RemovableTab
          key={idx}
          active={idx === activeTab}
          removeClickHandler={() => {
            setIdxToRemove(idx);
            setConfirmationVisible(true);
          }}
          tabClickHandler={() => {
            setActiveTab(idx);
          }}
          title={file.name}
        />
      );
    });
  };

  useEffect(() => {
    const schemaFiles =
      currentCP.structure.standardsOrganizations[currentDSOIndex].associatedSchemas;

    setSchemaFiles(schemaFiles || []);

    if (activeTab === -1 && schemaFiles.length) {
      setActiveTab(0);
    }
  }, [currentCP, currentDSOIndex]);

  return (
    <>
      {confirmationVisible && (
        <ConfirmDialog
          onRequestClose={() => setConfirmationVisible(false)}
          onConfirm={() => handleRemoveFile()}
          visible={confirmationVisible}
        >
          <h2 className="text-center">Attention!</h2>
          <h5 className="mt-3 text-center">{confirmationMsg}</h5>
        </ConfirmDialog>
      )}
      <div className="mt-5 w-100">
        <TabGroup cssClass={'ms-3 me-3'}>
          {schemaFileTabs()}
          <AddTabBtn
            onClickHandler={handleAddFile}
            tooltipMsg={'Create a new schema file for this DSO'}
          />
        </TabGroup>
      </div>
      {schemaFiles.length ? (
        <SingleSchemaFileWrapper schemaFileIdx={activeTab} />
      ) : (
        <NoDataFound
          text={`This DSO did not specify any schema files information yet. You can add a schema file by clicking on the "+" button`}
        />
      )}
    </>
  );
};

export default SchemaFilesWrapper;
