import React, { useEffect, useState } from "react";
import { toastr as toast } from "react-redux-toastr";
import DashboardContainer from "../DashboardContainer";
import createAdmin from "../../../services/createAdmin";
import fetchAdmins from "../../../services/fetchAdmins";
import AlertNotice from "../../shared/AlertNotice";

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState();
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const { admin, error } = await createAdmin({
      email, fullname, password, passwordConfirmation
    });

    setSubmitting(false);

    if (error) {
      setError(error);
      return;
    }

    setAdmins([admin, ...admins]);
    setEmail("");
    setError(undefined);
    setFullname("");
    setPassword("");
    setPasswordConfirmation("");

    toast.info("New admin added!");
  };

  useEffect(() => {
    (async () => {
      const { admins } = await fetchAdmins();
      setAdmins(admins);
    })();
  }, []);

  return (
    <DashboardContainer>
      {error && <AlertNotice message={error} />}

      <div className="col mt-5">
        <div className="card mb-5">
          <div className="card-header">
            <h5 className="card-title">New admin</h5>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullname">Full Name</label>
                <input
                  className="form-control"
                  disabled={submitting}
                  id="fullname"
                  onChange={e => setFullname(e.target.value)}
                  value={fullname}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input
                  className="form-control"
                  disabled={submitting}
                  id="email"
                  onChange={e => setEmail(e.target.value)}
                  type="email"
                  value={email}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  className="form-control"
                  disabled={submitting}
                  id="password"
                  onChange={e => setPassword(e.target.value)}
                  type="password"
                  value={password}
                />
              </div>

              <div className="form-group">
                <label htmlFor="passwordConfirmation">Password Confirmation</label>
                <input
                  className="form-control"
                  disabled={submitting}
                  id="passwordConfirmation"
                  onChange={e => setPasswordConfirmation(e.target.value)}
                  type="password"
                  value={passwordConfirmation}
                />
              </div>

              <button
                className="btn btn-primary"
                disabled={!email || !fullname || submitting}
                type="submit"
              >
                Save
              </button>
            </form>
          </div>
        </div>

        <h3>Admins</h3>
        <ol>
          {admins.map(a => <li key={a.id}>{a.fullname} &lt;{a.email}&gt;</li>)}
        </ol>
      </div>
    </DashboardContainer>
  );
};

export default Admins;
