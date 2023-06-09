/**
 * <PropsRoute/> is used in place of <Route/>
 * This allows additional props to be passed in
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';

const renderMergedProps = (component, ...rest) => {
    const finalProps = Object.assign({}, ...rest);
    return React.createElement(component, finalProps);
};

export const PropsRoute = ({ component, ...rest }) => (
    <Route
        {...rest}
        render={(routeProps) => renderMergedProps(component, routeProps, rest)}
    />
);

PropsRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
};
