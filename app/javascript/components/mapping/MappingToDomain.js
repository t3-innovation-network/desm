import React, { useState, useEffect } from "react";
import TopNav from "../shared/TopNav";
import Loader from "./../shared/Loader";
import fetchMapping from "../../services/fetchMapping";
import fetchDomains from "../../services/fetchDomains";
import { useSelector } from "react-redux";
import AlertNotice from "../shared/AlertNotice";
import TopNavOptions from "../shared/TopNavOptions";
import { Link } from "react-router-dom";

const MappingToDomains = (props) => {
  /**
   * Declare and have an initial state for the mapping
   */
  const [mapping, setMapping] = useState({
    specification: {
      terms: [],
    },
  });

  /**
   * Whether the page is loading results or not
   */
  const [loading, setLoading] = useState(true);

  /**
   * The domains list
   */
  const [domains, setDomains] = useState([]);

  /**
   * The logged in user
   */
  const user = useSelector((state) => state.user);

  /**
   * The value of the input that the user is typing in the search box
   * when there are many domains in the uploaded file
   */
  const [termsInputValue, setTermsInputValue] = useState("");

  /**
   * The domains that includes the string typed by the user in the
   * search box when there are many domains in the uploaded file
   */
  const filteredTerms = mapping.specification.terms.filter((term) => {
    return term.name.toLowerCase().includes(termsInputValue.toLowerCase());
  });

  /**
   * Configure the options to see at the center of the top navigation bar
   */
  const navCenterOptions = () => {
    return (
      <TopNavOptions
        viewMappings={true}
        mapSpecification={true}
        stepper={true}
        stepperStep={2}
      />
    );
  };

  /**
   * Manage to change values from inputs in the state
   */
  const filterTermsOnChange = (event) => {
    setTermsInputValue(event.target.value);
  };

  /**
   * Get the mapping from the service
   */
  const goForTheMapping = () => {
    fetchMapping(props.match.params.id).then((response) => {
      setMapping(response.mapping);
      setLoading(false);
    });
  };

  /**
   * Fecth the domains to be listed in the new mapping form
   * then put it in the local sate
   */
  const fillWithDomains = () => {
    fetchDomains().then((response) => {
      setDomains(response);
    });
  };

  /**
   * Use effect with an emtpy array as second parameter, will trigger the 'goForTheMappings'
   * and also 'fillWithDomains' actions at the 'mounted' event of this functional component
   * (It's not actually mounted, but it mimics the same action).
   */
  useEffect(() => {
    goForTheMapping();
    fillWithDomains();
  }, []);

  return (
    <div className="wrapper">
      <TopNav centerContent={navCenterOptions} />
      <div className="container-fluid container-wrapper">
        <div className="row">
          {loading ? (
            <Loader />
          ) : (
            <React.Fragment>
              {/* LEFT SIDE */}

              <div className="col-lg-6 p-lg-5 pt-5">
                <div className="border-bottom">
                  <h6 className="subtitle">
                    2. Add your elements to the proper domain
                  </h6>
                  <h1>Mapping {mapping.name}</h1>
                  <p>
                    <strong>0</strong>
                    {" of " +
                      mapping.specification.terms.length +
                      " elements added to domains"}
                  </p>
                </div>
                <div className="mt-5">
                  {domains.map((domain) => {
                    return (
                      <div className="card mb-2" key={domain.id}>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-4">
                              <h5>
                                <strong>{domain.name}</strong>
                              </h5>
                              0 Added
                            </div>
                            <div className="col-8">
                              <div className="card border-dotted pl-5 pr-5 pt-2 pb-2">
                                Drag elements or groups of elements to this
                                domain
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2">
                  <button className="btn bg-col-primary col-background">
                    Done Domain Mapping
                  </button>
                </div>
              </div>

              {/* RIGHT SIDE */}

              <div className="col-lg-6 p-lg-5 pt-5 bg-col-secondary">
                <div className="border-bottom">
                  <div className="row">
                    <div className="col-6">
                      <h6 className="subtitle">{user.organization.name}</h6>
                    </div>
                    <div className="col-6">
                      <div className="form-check float-right">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="hideElems"
                        />
                        <label className="form-check-label" htmlFor="hideElems">
                          Hidde mapped elements
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 form-group has-search">
                      <span className="fa fa-search form-control-feedback"></span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Find Element / Property"
                        value={termsInputValue}
                        onChange={filterTermsOnChange}
                      />
                    </div>
                  </div>
                  <p>
                    <strong>0</strong> elements selected
                  </p>
                </div>
                <div className="has-scrollbar scrollbar pr-5 mt-5">
                  <AlertNotice
                    cssClass="bg-col-primary col-background"
                    title={
                      mapping.specification.terms.length +
                      " elements have been uploaded"
                    }
                    message="Drag your individual elements below to the matching domains on the left to begin mapping your specification"
                  />
                  {filteredTerms.map((term) => {
                    return (
                      <React.Fragment>
                        <div className="card with-shadow mb-2" key={term.id}>
                          <div className="card-header no-color-header">
                            <div className="row">
                              <div className="col-6">{term.name}</div>
                              <div className="col-6">
                                <div className="float-right">
                                  <Link className="btn">
                                    <i className="fa fa-pencil-alt"></i>
                                  </Link>
                                  <Link
                                    data-target={"#collapse-term-" + term.id}
                                    data-toggle="collapse"
                                    className="btn"
                                  >
                                    <i class="fas fa-angle-down"></i>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            id={"collapse-term-" + term.id}
                            className="collapse card-body"
                          >
                            {term.uri}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default MappingToDomains;
