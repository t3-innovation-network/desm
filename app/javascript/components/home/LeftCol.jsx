import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppContext } from '../../contexts/AppContext';
import { Link } from 'react-router-dom';
import { pageRoutes } from '../../services/pageRoutes';
import fetchConfigurationProfiles from '../../services/fetchConfigurationProfiles';
import { isAdmin, isMapper } from '../../helpers/Auth';

const LeftSideHome = () => {
  const { sharedMappings, setSharedMappings } = useContext(AppContext);
  const user = useSelector((state) => state.user);
  useEffect(() => {
    // Fetch configuration profiles with shared mappings
    (async () => {
      const { configurationProfiles } = await fetchConfigurationProfiles('indexWithSharedMappings');
      setSharedMappings(configurationProfiles);
    })();
  }, []);

  const mapSpecificationContent = () => {
    if (isAdmin(user)) {
      return <p>You are currently logged in as an admin user and so cannot map specifications.</p>;
    }
    if (isMapper(user)) {
      return (
        <ul>
          <li key="my-mappings">
            <Link to="/mappings">My Mappings</Link>
          </li>
          <li key="new-mapping">
            <Link to="/new-mapping">New Mapping</Link>
          </li>
        </ul>
      );
    }
    return <p>If you have an account you may log in to map your specification.</p>;
  };

  return (
    <div className="col-lg-4 p-lg-5 pt-5">
      <section>
        <h6 className="subtitle">View Published Mappings:</h6>
        {sharedMappings.length > 0 ? (
          <ul>
            {sharedMappings.map((mapping) => (
              <li key={mapping.id}>
                <Link to={pageRoutes.mappingsList(mapping.id)}>{mapping.name}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No published mappings available.</p>
        )}
      </section>
      <section>
        <h6 className="subtitle">Map your specification:</h6>
        {mapSpecificationContent()}
      </section>
    </div>
  );
};

export default LeftSideHome;
