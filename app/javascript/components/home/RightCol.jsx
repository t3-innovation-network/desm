import mappingProcess from '../../../assets/images/mapping-process.png';

const RightSideHome = () => (
  <div className="col-lg-8 p-lg-5 pt-5 bg-col-secondary">
    <h1 className="subtitle">About the DESM tool</h1>
    <p>
      The Data Ecosystem Schema Mapping (DESM) Tool helps users create, edit, maintain, and view
      crosswalks between two or more schemas or standards. These crosswalks are based on semantic
      alignment between terms across standards and can support:
    </p>

    <ul>
      <li>Translating data from one schema or standard to another</li>
      <li>Developing data models that align with multiple standards</li>
      <li>Identifying which schemas and standards cover which terms</li>
    </ul>

    <p>
      These capabilities reflect the reality that any data ecosystem will include actors using
      different standards, schemas, and data models to meet their unique goals and system
      requirements.
    </p>
    <p>
      DESM organizes these alignments through pairwise mappings to a synthetic spine—a
      schema-neutral synthesis of terms created during the mapping process.
    </p>
    <p>
      The diagram below illustrates how DESM enables alignment of schema properties from multiple
      sources to this synthetic spine, which serves as a unified semantic reference to support
      schema crosswalks.
    </p>

    <img src={mappingProcess} alt="mapping process" style={{ width: '100%', padding: '2rem' }} />

    <p>
      The crosswalks are based on pairwise mapping of terms from the different standards to a
      &quot;synthetic spine&quot;, a schema-neutral synthesis of terms that is created during the
      mapping. Mappings from terms in one standard to terms in another can then be inferred where
      their respective mappings to the spine are transitive.
    </p>

    <p>
      The{' '}
      <a href="https://github.com/t3-innovation-network/desm" target="_blank" rel="noreferrer">
        DESM tool
      </a>{' '}
      is available as Open Source Software under an Apache 2.0 license.
    </p>

    <p>
      <a
        href="https://github.com/t3-innovation-network/desm/blob/main/README.md"
        target="_blank"
        rel="noreferrer"
      >
        Instructions for setting up an instance
      </a>{' '}
      of the DESM tool are available from the repository.
    </p>

    <p>
      <a href="https://github.com/t3-innovation-network/desm/wiki" target="_blank" rel="noreferrer">
        Instructions for carrying out a mapping
      </a>{' '}
      are available on the DESM repository wiki.
    </p>

    <p>
      DESM is sponsored by the U.S. Chamber of Commerce Foundations&apos; T3 Innovation Network
      program. The T3 Open Competency Network, in partnership with the T3 Data and Technology
      Standards Network is responsible for the requirements and project plans that are used for
      development and enhancement of the DESM too.
    </p>

    <p>
      If you are interested in participating with a T3 mapping project, please contact Taylor Hanson{' '}
      <a href="mailto:thansen@uschamber.com">thansen@uschamber.com</a>.
    </p>
  </div>
);

export default RightSideHome;
