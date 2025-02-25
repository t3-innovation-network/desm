import classNames from 'classnames';

const CheckBoxOptions = ({
  data,
  selectedData,
  onChange,
  onSelected,
  withBorder,
  fLabel,
  prefix = '',
}) => {
  const clsBlock = classNames({ 'border-bottom border-dark-subtle mb-3': withBorder });
  if (!data.length) {
    return <div className={clsBlock}>No data available</div>;
  }
  return (
    <div className={clsBlock}>
      <button
        className="btn btn-link p-0 link-desm-primary form-label mb-2"
        onClick={() => {
          !selectedData.length ? onSelected(data) : onSelected([]);
        }}
      >
        {!selectedData.length ? 'Show All' : 'Hide All'}
      </button>

      {data.map((d) => (
        <div className="form-check" key={d.id}>
          <input
            type="checkbox"
            className="form-check-input"
            id={`chk${prefix}-${d.id}`}
            checked={selectedData.some((s) => s.id === d.id)}
            onChange={(e) => onChange(e.target.value)}
            value={d.id}
          />
          <label className="form-check-label cursor-pointer" htmlFor={`chk${prefix}-${d.id}`}>
            {fLabel(d)}
          </label>
        </div>
      ))}
    </div>
  );
};

/**
 * Props
 * @param {Array} specifications
 * @param {Function} onAlignmentSpecificationSelected
 * @param {Function} onPredicateSelected
 * @param {Array} predicates
 * @param {Array} selectedAlignmentSpecifications
 * @param {String} selectedDomain
 * @param {Array} selectedPredicates
 */
const PropertyMappingsFilter = (props) => {
  const {
    specifications,
    onAlignmentSpecificationSelected,
    onPredicateSelected,
    predicates,
    selectedAlignmentSpecifications,
    selectedDomain,
    selectedPredicates,
    withBorder = false,
  } = props;

  const newDataFor = (selectedData, data, value) => {
    const id = parseInt(value);
    const isSelected = selectedData.some((s) => s.id === id);
    return isSelected
      ? selectedData.filter((s) => s.id !== id)
      : [...selectedData, data.find((s) => s.id === id)];
  };

  const handleAlignmentOrganizationSelected = (specId) => {
    onAlignmentSpecificationSelected(
      newDataFor(selectedAlignmentSpecifications, specifications, specId)
    );
  };

  const handlePredicateSelected = (predicateId) => {
    onPredicateSelected(newDataFor(selectedPredicates, predicates, predicateId));
  };

  const AlignmentOrganizationOptions = () => (
    <CheckBoxOptions
      data={specifications}
      selectedData={selectedAlignmentSpecifications}
      onChange={handleAlignmentOrganizationSelected}
      onSelected={onAlignmentSpecificationSelected}
      withBorder={withBorder}
      fLabel={(spec) => `${spec.name} ${spec.version ? `(${spec.version})` : ''}`}
      prefix="-al"
    />
  );

  const AlignmentOptions = () => (
    <CheckBoxOptions
      data={predicates}
      selectedData={selectedPredicates}
      onChange={handlePredicateSelected}
      onSelected={onPredicateSelected}
      withBorder={withBorder}
      fLabel={(predicate) => predicate.pref_label}
      prefix="-opt"
    />
  );

  return (
    <div className="row">
      <div className="col-12">
        <span className="fs-5">Synthetic Spine</span>
        <br />
        <span className="form-label text-desm-primary">{selectedDomain.name}</span>
      </div>
      <div className="col-12 mt-3">
        <label className="form-label fs-5">Show Alignments Specifications</label>
        <AlignmentOrganizationOptions />
      </div>
      <div className="col-12 mt-3">
        <label className="form-label fs-5">Show Alignments</label>
        <AlignmentOptions />
      </div>
    </div>
  );
};

export default PropertyMappingsFilter;
