import React, { useState, useEffect } from "react";
import TopNav from "../shared/TopNav";
import Loader from "./../shared/Loader";
import fetchMapping from "../../services/fetchMapping";

const MappingToDomains = (props) => {
  const [mapping, setMapping] = useState({});
  const [loading, setLoading] = useState(true);

  /**
   * 
   * then put it in the local sate
   */
  const goForTheMapping = () => {
    fetchMapping(props.match.params.id).then((response) => {
      setMapping(response.mapping);
      setLoading(false);
    });
  };

  /**
   * Use effect with an emtpy array as second parameter, will trigger the 'goForTheMapping'
   * action at the 'mounted' event of this functional component (It's not actually mounted,
   * but it mimics the same action).
   */
  useEffect(() => {
    goForTheMapping();
  }, []);

  return (
    <div className="wrapper">
      <TopNav />
      <div className="container-fluid container-wrapper">
        <div className="row">
          { loading ? 
            <Loader /> : 
            <h1>Mapping {mapping.name}</h1>
          }
        </div>
      </div>
    </div>
  );
};

export default MappingToDomains;
