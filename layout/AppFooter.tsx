/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            <img src={`/images/logo/logo.png`} alt="Logo" height="20" className="mr-2" />
            by
            <span className="font-medium ml-2">Kobe</span>
        </div>
    );
};

export default AppFooter;
