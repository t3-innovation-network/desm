import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toastr as toast } from 'react-redux-toastr';
import { setUser } from '../../actions/sessions';
import updateUser from '../../services/updateUser';
import AlertNotice from '../shared/AlertNotice';
import TopNav from '../shared/TopNav';
import TopNavOptions from '../shared/TopNavOptions';

const EditProfile = ({ history }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [email, setEmail] = useState(user.email);
  const [error, setError] = useState();
  const [fullname, setFullname] = useState(user.fullname);
  const [githubHandle, setGithubHandle] = useState(user.github_handle || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    const response = await updateUser(user.id, { email, fullname, githubHandle, phone });
    setSubmitting(false);

    if (response.error) {
      setError(response.error);
      return;
    }

    dispatch(setUser(response.user));
    history.push('/');
    toast.info('Profile changes saved!');
  };

  return (
    <div className="container-fluid">
      <TopNav centerContent={() => <TopNavOptions viewMappings mapSpecification />} />

      <div className="row mt-5">
        <div className="col-lg-6 mx-auto">
          {error && <AlertNotice message={error} onClose={() => setError(null)} />}

          <div className="card">
            <div className="card-header">
              <FontAwesomeIcon icon={faUser} />
              <span className="pl-2 subtitle">Edit profile information</span>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="fullname">Full Name</label>
                  <input
                    className="form-control"
                    disabled={submitting}
                    id="fullname"
                    onChange={(e) => setFullname(e.target.value)}
                    value={fullname}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">E-mail</label>
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
                  <label htmlFor="github">GitHub Handle</label>
                  <input
                    className="form-control"
                    disabled={submitting}
                    id="github"
                    onChange={(e) => setGithubHandle(e.target.value)}
                    value={githubHandle}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    className="form-control"
                    disabled={submitting}
                    id="phone"
                    onChange={(e) => setPhone(e.target.value)}
                    value={phone}
                  />
                </div>

                <button className="btn btn-primary" disabled={submitting} type="submit">
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
