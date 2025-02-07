import { useState } from 'react';
import { pickBy } from 'lodash';
import createAdmin from '../../../services/createAdmin';
import updateAdmin from '../../../services/updateAdmin';
import AlertNotice from '../../shared/AlertNotice';

const AdminForm = ({ record, onCancel, onSave }) => {
  const [email, setEmail] = useState(record.email || '');
  const [error, setError] = useState();
  const [fullname, setFullname] = useState(record.fullname || '');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = pickBy({ email, fullname, password, passwordConfirmation });

    const { admin, error } = await (record.id ? updateAdmin.bind(this, record.id) : createAdmin)(
      data
    );

    setSubmitting(false);

    if (error) {
      setError(error);
      return;
    }

    onSave(admin);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title">{record.id ? 'Edit' : 'Add'} Admin User</h5>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {error && <AlertNotice message={error} onClose={() => setError(null)} />}

          <div className="form-group">
            <label className="form-label" htmlFor="fullname">
              Full Name
            </label>
            <input
              className="form-control"
              disabled={submitting}
              id="fullname"
              onChange={(e) => setFullname(e.target.value)}
              value={fullname}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              E-mail
            </label>
            <input
              className="form-control"
              disabled={submitting}
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              value={email}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              className="form-control"
              disabled={submitting}
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              value={password}
            />
            {record.id && (
              <small className="form-text text-body-secondary">
                Leave password blank if you don&apos;t want to change it
              </small>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="passwordConfirmation">
              Password Confirmation
            </label>
            <input
              className="form-control"
              disabled={submitting}
              id="passwordConfirmation"
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              type="password"
              value={passwordConfirmation}
            />
          </div>

          <button
            className="btn btn-primary me-3"
            disabled={!email || !fullname || submitting}
            type="submit"
          >
            Save
          </button>
          <button className="btn btn-default" onClick={onCancel}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminForm;
