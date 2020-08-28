import React, { useState } from 'react';
import TopNav from '../shared/TopNav';
import { Link } from 'react-router-dom';

const SpecList = () => {
  const [specs, setSpecs] = useState([]);

  return (
    <div className="wrapper">
      <TopNav />
      <div className="container-fluid container-wrapper">
        <div className="row">
          <div className="col p-lg-5 pt-5">
            <h4>My Specifications</h4>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Specification Name</th>
                    <th scope="col">Version</th>
                    <th scope="col">Mapped</th>
                    <th scope="col">Status</th>
                    <th scope="col">Author</th>
                    <th scope="col">
                      <select className="form-control">
                        <option value="user">Only My Mappings</option>
                        <option value="all">All Mappings</option>
                      </select>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  { specs.length > 0 ? 
                    (
                      specs.map((spec) => {
                        return (
                          <tr>
                            <td>{spec.title}</td>
                            <td>{spec.version}</td>
                            <td>{spec.mappedTerms + "/" + specNonMappedTerms}</td>
                            <td>{spec.status}</td>
                            <td>{spec.author.name}</td>
                            <td>
                            <button className="btn btn-sm bg-col-primary col-background">
                              Resume
                            </button>
                            <button className="btn btn-sm btn-dark ml-2">
                              View
                            </button>
                            </td>
                          </tr>
                        );
                      })
                    ):(
                      <tr></tr>
                    )
                  }
                </tbody>
              </table>
              { specs.length == 0 && 
               (
                <div className="card text-center">
                  <div className="card-header bg-col-on-primary-highlight">
                    <p>All the specifications you and your team map will be visible here</p>
                  </div>
                  <div className="card-body bg-col-on-primary-highlight">
                    <Link to="/new-mapping" className="btn bg-col-primary col-background">
                      Map a specification
                    </Link>
                  </div>
                </div>
               )
              }
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default SpecList;