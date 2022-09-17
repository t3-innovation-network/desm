import React from "react";
import mappingProcess from "../../../assets/images/mapping-process.png";

class RightSideHome extends React.Component {
  render() {
    return (
      <div className="col-lg-6 p-lg-5 pt-5 bg-col-secondary">
        <section>
          <h6 className="subtitle">About the DESM tool</h6>
          <p>
            The DESM is a specialized tool for creating, editing and viewing
            semantic crosswalks of data standards from two or more Data Standard
            Organizations (DSOs) to support data interoperability
            and potentially data harmonization. An instance of the DESM can be
            pre-configured, or re-configured, to use one or more Mapping
            Profiles (Profile). A Profile is instantiated in an instance of DESM
            by ingesting and associating two pre existing JSON-LD files modeled
            using the W3C’s Simple Knowledge Organization System (SKOS):
          </p>

          <ol>
            <li>
              an Abstract Classes file defining one or more abstract classes
              describing the types of entities to be crosswalked (e.g.,
              “Person”, “Organization”, “Earnings”, “Course”); and
            </li>
            <li>
              a Mapping Predicates file defining the degrees or levels of
              equivalence when mapping a property in one DSO’s specification to
              a property in another DSO’s specification.
            </li>
          </ol>

          <img
            src={mappingProcess}
            alt="mapping process"
            style={{ width: "100%", padding: "2rem" }}
          />

          <p>
            Once an administrator has configured the DESM to use the desired
            Mapping Profile, crosswalking begins with an DSO ingesting one or
            more of its data specifications describing one of the profile’s
            Abstract Classes that validate against XML Schema, JSON Schema, RDF
            Schema or CSV. The DSO also ingests any similarly encoded
            specifications for the value spaces associated with the DSO’s
            uploaded schema(s)–e.g., embedded or separately expressed
            enumerations, vocabularies, tag lists, concept schemes. This first
            set of schemas and value space specifications from a single DSO form
            what the DESM calls the Base to which other DSOs will semantically
            map or crosswalk their specifications and value spaces.
          </p>

          <p>
            Once the DESM has been seeded with a Base, other DSOs similarly
            upload their specifications and value spaces describing the same
            Abstract Class. These DSOs then semantically map or crosswalk each
            of their schema properties and concepts in their value spaces to
            properties and concepts in the Base. The DSO fine-tunes the
            semantics of each property mapping by selecting from the array of
            preloaded Mapping Predicates defined in the Profile–e.g.,
            “identical”, “identical but reworded”, “similar” etc.. Should an DSO
            have a property for which there is no equivalent property in the
            Base, it adds that property to what DESM calls the Synthetic Spine
            for that particular Abstract Class composed of all properties in the
            Base plus properties of all the other DSOs not found in the Base.
            Each subsequent DSO follows this same mapping process. The result is
            a Synthetic Spine that reflects both explicit and inferred
            crosswalks of all properties for the Abstract Class in all of the
            mapped DSO specifications.
          </p>

          <p>
            The resulting crosswalks can be viewed in the DESM tool. DESM also
            outputs a JSON-LD file of both individual mappings and Mapping Sets
            that can be loaded into 3rd party viewers and applications.
          </p>

          <h6 className="subtitle">About the DESM community</h6>
          <p>Data Standard Organizations (DSO)</p>
        </section>
      </div>
    );
  }
}

export default RightSideHome;
