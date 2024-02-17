const ModalStyles = {
  content: {
    border: 'none',
    bottom: 'auto',
    left: '50%',
    marginRight: '-50%',
    maxWidth: '95%',
    minWidth: '60%',
    padding: '0',
    right: 'auto',
    top: '40px',
    transform: 'translate(-50%)',
    width: 'auto',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, .8)',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    left: '0',
    overflowY: 'auto',
    position: 'fixed',
    top: '0',
    width: '100%',
    zIndex: '1000',
  },
};

export default ModalStyles;
