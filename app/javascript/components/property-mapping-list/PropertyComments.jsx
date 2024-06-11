/**
 * Props:
 * @param {Object} term
 */
const PropertyComments = ({ term }) => {
  const { comments } = term;

  return comments.length > 1 ? (
    <ul>
      {comments.map((c, i) => (
        <li key={i}>{c}</li>
      ))}
    </ul>
  ) : (
    comments[0] ?? null
  );
};

export default PropertyComments;
