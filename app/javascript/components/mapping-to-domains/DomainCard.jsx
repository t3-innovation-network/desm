import { DraggableItemTypes } from '../shared/DraggableItemTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import DropZone from '../shared/DropZone';
import TermCard from './TermCard';

const DomainCard = ({ domain, mappedTerms, onRevertMapping }) => (
  <div className="card mb-2" key={domain.id}>
    <div className="card-body">
      <div className="row">
        <div className="col-4">
          <h5>
            <strong>{domain.pref_label}</strong>
          </h5>
          {mappedTerms.length + ' Added'}
        </div>
        <div className="col-8">
          {/* Only accept alignments if the domain has a spine */}
          <DropZone
            droppedItem={{ name: domain.name, uri: domain.id }}
            acceptedItemType={DraggableItemTypes.PROPERTIES_SET}
            placeholder="Drag a matching property here"
            style={{ minHeight: '200px' }}
          >
            {mappedTerms.length > 0 &&
              mappedTerms.map((term) => (
                <TermCard
                  disableClick
                  headerContent={
                    <div className="row">
                      <div
                        className="col-1 cursor-pointer"
                        title="Revert selecting this term"
                        onClick={() => onRevertMapping(term.id)}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </div>
                      <div className="col-10">
                        <strong>{term.name}</strong>
                      </div>
                    </div>
                  }
                  expanded={false}
                  isMapped={() => false}
                  key={term.id}
                  term={term}
                />
              ))}
          </DropZone>
        </div>
      </div>
    </div>
  </div>
);

export default DomainCard;
