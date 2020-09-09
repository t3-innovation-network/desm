import React, { useState, useEffect } from "react";
import TopNav from "../shared/TopNav";
import Loader from "./../shared/Loader";
import fetchMapping from "../../services/fetchMapping";
import fetchDomains from "../../services/fetchDomains";
import { useSelector } from "react-redux";
import AlertNotice from "../shared/AlertNotice";

const MappingToDomains = (props) => {
  const [mapping, setMapping] = useState({});
  const [loading, setLoading] = useState(true);
  const [domains, setDomains] = useState([]);
  const user = useSelector((state) => state.user);
  /// The value of the input that the user is typing in the search box
  /// when there are many domains in the uploaded file
  const [inputValue, setInputValue] = useState("");

  /**
   * Manage to change values from inputs in the state
   */
  const filterOnChange = (event) => {
    setInputValue(event.target.value);
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
      <TopNav />
      <div className="container-fluid container-wrapper">
        <div className="row">
          { loading ? 
            <Loader /> : 
            <React.Fragment>
              <div className="col-lg-6 p-lg-5 pt-5">
                <section>
                  <h6 className="subtitle">2. Add your elements to the proper domain</h6>
                  <h1>Mapping {mapping.name}</h1>
                </section>
                <section className="border-bottom">
                  <p>{"0 of " + mapping.specification.terms.length + " elements added to domains"}</p>
                </section>
                <section>
                  {
                    domains.map((domain) => {
                      return (
                        <div className="card mb-2" key={domain.id}>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-4">
                                <h5><strong>{ domain.name }</strong></h5>
                                0 Added
                              </div>
                              <div className="col-8">
                                <div className="card border-dotted pl-5 pr-5 pt-2 pb-2">
                                  Drag elements or groups of elements to this domain
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  }
                </section>
                <section>
                  <button className="btn bg-col-primary col-background">Done Domain Mapping</button>
                </section>
              </div>
              <div className="col-lg-6 p-lg-5 pt-5 bg-col-secondary">
                <section>
                  <div className="row">
                    <div className="col-6">
                      <h6 className="subtitle">{user.organization.name}</h6>
                    </div>
                    <div className="col-6">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="" id="hideElems" />
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
                        value={inputValue}
                        onChange={filterOnChange}
                      />
                    </div>
                  </div>
                </section>
                <section className="border-bottom">
                  <p>0 elements selected</p>
                </section>
                <section className="scrollbar">
                  <AlertNotice 
                    cssClass="bg-col-primary col-background"
                    title={mapping.specification.terms.length + " elements have been uploaded"}
                    message="Drag your individual elements below to the matching domains on the left to begin mapping your specification"
                  />
                  { 
                    mapping.specification.terms.map((term) => {
                      return (
                        <div className="card mt-2 mb-2 pt-2 pl-4" key={term.id}>
                          <div className="card-body">
                            <pre>
                              <code>{term.name}</code>
                            </pre>
                          </div>
                        </div>
                      );
                    })
                  }
                </section>
              </div>
            </React.Fragment>
          }
        </div>
      </div>
    </div>
  );
};

export default MappingToDomains;
