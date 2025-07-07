import { useEffect } from 'react';
import { useLocalStore } from 'easy-peasy';
import Modal from 'react-modal';
import { isUndefined } from 'lodash';
import AlertNotice from '../../shared/AlertNotice';
import Loader from '../../shared/Loader';
import ModalStyles from '../../shared/ModalStyles';
import HeaderContent from './HeaderContent';
import MappingConceptsList from './MappingConceptsList';
import SpineConceptRow from './SpineConceptRow';
import Pluralize from 'pluralize';
import { showSuccess } from '../../../helpers/Messages';
import useDidMountEffect from '../../../helpers/useDidMountEffect';
import { matchVocabularyStore } from './stores/matchVocabularyStore';

/**
 * Props
 * @prop {Function} onRequestClose
 * @prop {Boolean} modalIsOpen
 * @prop {String} spineOrigin
 * @prop {String} mappingOrigin
 * @prop {Object} mappedTerm
 * @prop {Object} alignment
 * @prop {Object} spineTerm
 * @prop {Array} predicates
 */
const MatchVocabulary = ({
  onRequestClose,
  modalIsOpen,
  spineOrigin,
  mappingOrigin,
  mappedTerms,
  alignment,
  spineTerm,
}) => {
  const [state, actions] = useLocalStore(() => matchVocabularyStore());
  const {
    filteredMappingConcepts,
    loading,
    predicates,
    spineConcepts,
    alignmentConcepts,
    changesPerformed,
  } = state;
  const mappedTermsIds = mappedTerms.map((mappedTerm) => mappedTerm.id);

  const handleAfterDropConcept = (spineData) => {
    const alignmentIdx = alignmentConcepts.findIndex(
      (concept) => concept.spineConceptId === spineData.spineConceptId
    );
    let updatedAlignment = {};
    if (alignmentIdx >= 0) {
      updatedAlignment = {
        ...alignmentConcepts[alignmentIdx],
        mappedConceptsList: filteredMappingConcepts({ pickSelected: true }),
        updated: true,
      };
      if (updatedAlignment.synthetic) {
        actions.handleDropOnSynthetic(updatedAlignment);
      }
    }
    actions.handleAfterDropConcept({ alignmentIdx, updatedAlignment });
  };

  const addSyntheticConceptRow = () => actions.addSyntheticConceptRow(predicates);

  const handleSave = async () => {
    let response = await actions.saveChangedAlignments();
    if (response.error) return;
    response = await actions.saveSyntheticAlignments();
    if (response.error) return;
    showSuccess('The vocabulary changes were successfully saved!');
    onRequestClose();
  };

  useEffect(() => {
    Modal.setAppElement('body');
    // actions.fetchDataFromAPI({
    //   mappedTerms,
    //   alignment,
    //   spineTerm,
    // });
    // eslint-disable-next-line
  }, []);

  useDidMountEffect(() => {
    if (modalIsOpen) {
      actions.fetchDataFromAPI({
        mappedTerms,
        alignment,
        spineTerm,
      });
    }
  }, [modalIsOpen]);

  /**
   * Structure for the title
   */
  const Title = () => (
    <div className="row mb-3">
      <div className="col-8">
        <div className="row">
          <div className="col-4">
            <h4 className="text-center">Spine</h4>
          </div>
          <div className="col-4 offset-4">
            <h4 className="text-center">{alignment.schemaName}</h4>
          </div>
        </div>
      </div>
      <div className="col-4">
        <div className="float-start">
          <button
            className="btn btn-dark"
            onClick={addSyntheticConceptRow}
            title="Use this button to add new elements to the spine"
          >
            + Add to Spine
          </button>
        </div>
        <div className="float-end">
          {filteredMappingConcepts({ pickSelected: true }).length +
            ' ' +
            Pluralize('concept', filteredMappingConcepts({ pickSelected: true }).length) +
            ' selected'}
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={onRequestClose}
      contentLabel="Map Controlled Vocabulary"
      className="desm-vocabulary-mapping"
      style={ModalStyles}
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={false}
    >
      {loading ? (
        <Loader />
      ) : (
        <div className="card p-5">
          <div className="card-header no-color-header border-bottom pb-3">
            <HeaderContent
              onRequestClose={onRequestClose}
              onRequestSave={handleSave}
              disableSave={!changesPerformed}
            />
          </div>
          <div className="card-body">
            {/* Manage to show the errors, if any */}
            {state.hasErrors ? (
              <AlertNotice message={state.errors} onClose={actions.clearErrors} />
            ) : null}
            {loading ? (
              <Loader />
            ) : (
              <>
                <Title />
                <div className="row">
                  <div className="col-8 pt-3 has-scrollbar scrollbar">
                    {spineConcepts.map((concept) => {
                      let _alignment = alignmentConcepts.find(
                        (alignment) => alignment.spineConceptId === concept.id
                      );
                      return !isUndefined(_alignment) ? (
                        <SpineConceptRow
                          key={`conceptId-${concept.id}`}
                          alignment={_alignment}
                          concept={concept}
                          schemaName={alignment.schemaName}
                          mappingOrigin={mappingOrigin}
                          spineOrigin={spineOrigin}
                          predicates={predicates}
                          onPredicateSelected={(predicate) =>
                            actions.onPredicateSelected({ concept, predicate })
                          }
                          selectedCount={
                            filteredMappingConcepts({
                              pickSelected: true,
                            }).length
                          }
                        />
                      ) : (
                        ''
                      );
                    })}
                  </div>
                  <div className="col-4 bg-col-secondary pt-3">
                    <MappingConceptsList
                      schemaName={alignment.schemaName}
                      filteredMappingConcepts={filteredMappingConcepts}
                      onMappingConceptClick={actions.toggleMappingConcept}
                      afterDropConcept={handleAfterDropConcept}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default MatchVocabulary;
