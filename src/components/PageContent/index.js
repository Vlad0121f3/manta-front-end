import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

const PageContent = ({ children, className }) => {
  return (
    <section
      className={classNames(
        'px-2 page-content min-h-screen lg:flex flex-col justify-top',
        className
      )}
    >
      {children}
    </section>
  );
};

PageContent.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string
};

export default PageContent;
