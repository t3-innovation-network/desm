const HTMLOutput = ({ data, cls = '' }) => (
  <div className={cls} dangerouslySetInnerHTML={{ __html: data }}></div>
);

export default HTMLOutput;
