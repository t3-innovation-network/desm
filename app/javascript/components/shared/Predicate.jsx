import DesmTooltip from './Tooltip';

const Predicate = ({ predicate }) => {
  if (!predicate) return null;
  return (
    <>
      {predicate.name}
      {predicate.definition && (
        <DesmTooltip id={predicate.id} title={predicate.definition}>
          <a href="#" className="desm-icon small ms-1">
            help
          </a>
        </DesmTooltip>
      )}
    </>
  );
};

export default Predicate;
