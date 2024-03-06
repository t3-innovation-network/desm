import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import DashboardContainer from '../DashboardContainer';
import deleteAdmin from '../../../services/deleteAdmin';
import fetchAdmins from '../../../services/fetchAdmins';
import ModalStyles from '../../shared/ModalStyles';
import AdminForm from './AdminForm';
import { showError, showInfo } from '../../../helpers/Messages';

const Admins = () => {
  Modal.setAppElement('body');

  const [admins, setAdmins] = useState([]);
  const [toBeEdited, setToBeEdited] = useState();

  const handleDelete = async (admin) => {
    if (window.confirm('Are you sure?')) {
      const { error } = await deleteAdmin(admin.id);

      if (error) {
        showError(error);
        return;
      }

      setAdmins((admins) => admins.filter((a) => a.id != admin.id));
      showInfo('Admin user removed!');
    }
  };

  const handleSave = (admin) => {
    if (toBeEdited.id) {
      const index = admins.findIndex((a) => a.id === toBeEdited.id);
      admins[index] = admin;
      setAdmins(admins);
      showInfo('Changes saved!');
    } else {
      setAdmins([admin, ...admins]);
      showInfo('New admin user added!');
    }

    setToBeEdited(undefined);
  };

  useEffect(() => {
    (async () => {
      const { admins } = await fetchAdmins();
      setAdmins(admins);
    })();
  }, []);

  return (
    <DashboardContainer>
      <div className="col mt-5">
        <h1>Admin Users</h1>

        <p>
          <button className="btn btn-primary" onClick={() => setToBeEdited({})}>
            Add Admin User
          </button>
        </p>

        <table className="table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Full Name</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id}>
                <td>{a.email}</td>
                <td>{a.fullname}</td>
                <td>
                  <button className="btn btn-sm btn-primary mr-3" onClick={() => setToBeEdited(a)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(a)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {Boolean(toBeEdited) && (
        <Modal isOpen onRequestClose={() => setToBeEdited(undefined)} style={ModalStyles}>
          <AdminForm
            record={toBeEdited}
            onCancel={() => setToBeEdited(undefined)}
            onSave={handleSave}
          />
        </Modal>
      )}
    </DashboardContainer>
  );
};

export default Admins;
