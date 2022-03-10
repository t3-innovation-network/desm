import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import updateAlignment from "../../services/updateAlignment";
import AlertNotice from "../shared/AlertNotice";
import ModalStyles from "../shared/ModalStyles";
import PredicateOptions from "../shared/PredicateOptions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faTimes } from "@fortawesome/free-solid-svg-icons";

const EditAlignment = (props) => {
  Modal.setAppElement("body");

  const {
    alignment,
    modalIsOpen,
    mode,
    onCommentUpdated,
    onPredicateUpdated,
    onRequestClose,
    predicate,
    predicates,
    spineTerm,
  } = props;

  const [currentMode, setCurrentMode] = useState(mode);
  const [commentChanged, setCommentChanged] = useState(false);
  const [predicateChanged, setPredicateChanged] = useState(false);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState(alignment?.comment);
  const [selectedPredicate, setSelectedPredicate] = useState(predicate);

  const handleCommentChange = (e) => {
    setCommentChanged(true);
    setComment(e.target.value);
  };

  const handleSaveComment = async () => {
    let response = await updateAlignment({
      id: alignment.id,
      comment: comment,
    });

    if (response.error) {
      setError(response.error);
      return;
    }

    onCommentUpdated({ saved: true, comment: comment });
  };

  const handlePredicateSelected = (predicate) => {
    setPredicateChanged(true);
    setSelectedPredicate(predicate);
  };

  const handleSaveAlignment = async () => {
    let response = await updateAlignment({
      id: alignment.id,
      predicateId: selectedPredicate.id,
    });

    if (response.error) {
      setError(response.error);
      return;
    }

    onPredicateUpdated({
      saved: true,
      term: alignment,
      predicate: selectedPredicate,
    });
  };

  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={onRequestClose}
      contentLabel="Comment"
      style={ModalStyles}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
    >
      <div className="card">
        <div className="card-header">
          <FontAwesomeIcon icon={faComment} className="col-primary" />
          <a className="float-right cursor-pointer" onClick={onRequestClose}>
            <FontAwesomeIcon icon={faTimes} />
          </a>
        </div>
        <div className="card-body">
          {error && <AlertNotice message={error} />}

          <div className="row">
            <div className="col-4">
              <div className="card">
                <div className="card-header">{spineTerm.name}</div>
              </div>
            </div>
            <div className="col-4">
              {currentMode === "comment" ? (
                <div className="card">
                  <div className="card-header">{predicate.pref_label}</div>
                </div>
              ) : (
                <PredicateOptions
                  predicates={predicates}
                  onPredicateSelected={(predicate) =>
                    handlePredicateSelected(predicate)
                  }
                  predicate={predicate.pref_label}
                />
              )}
            </div>
            <div className="col-4">
              {alignment.mappedTerms.map((mTerm) => {
                return (
                  <div key={mTerm.id} className="card mb-3">
                    <div className="card-header">{mTerm.name}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="row mt-3">
            <div className="col form-group">
              {currentMode === "comment" ? (
                <textarea
                  className="form-control"
                  placeholder="add a comment about this alignment"
                  value={comment || ""}
                  onChange={handleCommentChange}
                />
              ) : (
                comment
              )}
            </div>
          </div>
          <div className="row">
            <div className="col">
              {currentMode === "comment" ? (
                <button
                  className="btn btn-dark mt-3 mr-3"
                  onClick={handleSaveComment}
                  disabled={!commentChanged}
                >
                  Save Comment
                </button>
              ) : (
                <button
                  className="btn btn-dark mt-3 mr-3"
                  onClick={handleSaveAlignment}
                  disabled={!predicateChanged}
                >
                  Save
                </button>
              )}
              {currentMode === "comment" ? (
                <a
                  className="btn col-primary cursor-pointer mt-3"
                  onClick={() => setCurrentMode("edit")}
                >
                  Edit
                </a>
              ) : (
                <a
                  className="btn col-primary cursor-pointer mt-3"
                  onClick={() => setCurrentMode("comment")}
                >
                  Comment
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditAlignment;
