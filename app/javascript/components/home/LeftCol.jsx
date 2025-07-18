import { useContext, useEffect } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { Link } from 'react-router-dom';
import { pageRoutes } from '../../services/pageRoutes';
import fetchConfigurationProfiles from '../../services/fetchConfigurationProfiles';

const LeftSideHome = () => {
  const { sharedMappings, setSharedMappings } = useContext(AppContext);
  useEffect(() => {
    // Fetch configuration profiles with shared mappings
    (async () => {
      const { configurationProfiles } = await fetchConfigurationProfiles('indexWithSharedMappings');
      setSharedMappings(configurationProfiles);
    })();
  }, []);

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
        <p>If you have an account you may log in to map your specification.</p>
      </section>
    </div>
  );
};

export default LeftSideHome;
