import React, { useState, useEffect } from "react";
import TopNav from "../shared/TopNav";
import { Link } from "react-router-dom";
import fetchMappings from "../../services/fetchMappings";
import Loader from "../shared/Loader";

const SpecList = () => {
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("user");
  const filterOptions = [
    {
      key: "user",
      value: "Only My Mappings",
    },
    {
      key: "all",
      value: "All Mappings",
    },
  ];

  /**
   * Change the filter for the listed mappings
   */
  const handleFilterChange = (value) => {
    setFilter(value);
    goForTheMappings(value);
  }

  /**
   * Get the mappings from the service
   */
  const goForTheMappings = (value) => {
    let filterValue = value || filter;
    fetchMappings(filterValue).then((response) => {
      setMappings(response.mappings);
      setLoading(false);
    });
  };

  /**
   * Use effect with an emtpy array as second parameter, will trigger the 'goForTheMapping'
   * action at the 'mounted' event of this functional component (It's not actually mounted,
   * but it mimics the same action).
   */
  useEffect(() => {
    goForTheMappings();
  }, []);

  return (
    <div className="wrapper">
      <TopNav />
      <div className="container-fluid container-wrapper">
        <div className="row">
          <div className="col p-lg-5 pt-5">
            <h4>My Specifications</h4>
            {loading ? (
              <Loader />
            ) : (
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
                        <select
                          className="form-control"
                          value={filter}
                          onChange={(e) => handleFilterChange(event.target.value)}
                        >
                          {filterOptions.map(function (option) {
                            return (
                              <option key={option.key} value={option.key}>
                                {option.value}
                              </option>
                            );
                          })}
                        </select>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mappings.length > 0 ? (
                      mappings.map((mapping) => {
                        return (
                          <tr key={mapping.id}>
                            <td>{mapping.title}</td>
                            <td>{mapping.specification.version}</td>
                            <td>0/0</td>
                            <td></td>
                            <td>{mapping.specification.user.fullname}</td>
                            <td>
                              <Link
                                to={"/mappings/" + mapping.id}
                                className="btn btn-sm bg-col-primary col-background"
                              >
                                Resume
                              </Link>
                              <Link
                                to={"/mappings/" + mapping.id}
                                className="btn btn-sm btn-dark ml-2"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr></tr>
                    )}
                  </tbody>
                </table>
                {mappings.length == 0 && (
                  <div className="card text-center">
                    <div className="card-header bg-col-on-primary-highlight">
                      <p>
                        All the specifications you and your team map will be
                        visible here
                      </p>
                    </div>
                    <div className="card-body bg-col-on-primary-highlight">
                      <Link
                        to="/new-mapping"
                        className="btn bg-col-primary col-background"
                      >
                        Map a specification
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecList;
