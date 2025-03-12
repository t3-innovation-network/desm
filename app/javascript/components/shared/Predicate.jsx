import DesmTooltip from './Tooltip';

const Predicate = ({ predicate }) => {
  if (!predicate) return null;
  return (
    <>
      {predicate.name}
      {predicate.definition && (
        <DesmTooltip id={predicate.id} title={predicate.definition}>
          <span className="desm-icon small ms-1 cursor-pointer">help</span>
        </DesmTooltip>
      )}
    </>
  );
};

export default Predicate;
