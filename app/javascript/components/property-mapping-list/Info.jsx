import React from 'react';
import classNames from 'classnames';
import { kebabCase } from 'lodash';
import { i18n } from '../../utils/i18n';
import { dateLongFormat } from '../../utils/dateFormatting';
import Predicate from '../shared/Predicate';

const Info = ({ sharedMappings, predicates }) => {
  return (
    <>
      <h5 className="mb-2">
        {i18n.t('ui.view_mapping.mapping', { count: sharedMappings.length })}
      </h5>
      <ul className="list-unstyled pb-4 border-bottom border-dark-subtle">
        {sharedMappings.map((mapping) => (
          <li key={mapping.id}>
            <span className="fw-bold">
              {mapping.specification.name} {mapping.version ? `(${mapping.version})` : ''}
            </span>
            <br />
            <span className="small">Updated on {dateLongFormat(mapping.updatedAt)}.</span>
          </li>
        ))}
      </ul>
      <h5 className="mb-2 mt-4">{i18n.t('ui.view_mapping.legend')}</h5>
      <dl className="row gy-2 gx-3">
        {predicates.map((predicate) => {
          const cls = classNames(
            'w-100 rounded-3 p-1 u-txt--predicate d-inline-flex justify-content-center align-items-center',
            `desm-predicate--${kebabCase(predicate.color || 'unset')}`
          );
          return (
            <React.Fragment key={predicate.id}>
              <dt className="col-5">
                <div className={cls}>
                  <Predicate predicate={predicate} />
                </div>
              </dt>
              <dd className="col-7 small">{predicate.definition}</dd>
            </React.Fragment>
          );
        })}
      </dl>
    </>
  );
};

export default Info;
