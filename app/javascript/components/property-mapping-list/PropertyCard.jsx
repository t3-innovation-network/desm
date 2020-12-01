import React, { Component, Fragment } from "react";
import AlertNotice from "../shared/AlertNotice";

/**
 * Props:
 * @param {Array} errors
 * @param {Array} organizations
 * @param {Object} term
 * @param {Object} selectedDomain
 */
export default class PropertyCard extends Component {
  /**
   * Correctly fetch the organization name
   *
   * @param {Integer} orgId
   */
  getOrganizationName = (orgId) => {
    const {organizations} = this.props;
    let org = organizations.find((org) => org.id == orgId);

    return org ? org.name : "Not found";
  };

  render() {
    /**
     * Elements from props
     */
    const { term, errors, selectedDomain, organizations } = this.props;

    return (
      <Fragment>
        {/* ERRORS */}
        {errors.length ? <AlertNotice message={errors} /> : ""}

        <div className="card borderless bg-col-background">
          <div className="card-header desm-rounded bottom-borderless bg-col-background">
            <small className="mt-3 col-on-primary-light">
              Element/Property
            </small>
            <h3>{term.name}</h3>

            <small className="mt-3 col-on-primary-light">Class/Type</small>
            <p>{selectedDomain.name}</p>

            <small className="mt-3 col-on-primary-light">Definition</small>
            <p>{term.property.comment}</p>

            <small className="mt-3 col-on-primary-light">Origin</small>
            <p>{this.getOrganizationName(term.organizationId)}</p>

            {/* ↓↓↓ TODO: Is this correct? ↓↓↓ */}
            <small className="mt-3 col-on-primary-light">Schema</small>
            <p>{this.getOrganizationName(term.organizationId)}</p>
          </div>
        </div>
      </Fragment>
    );
  }
}
