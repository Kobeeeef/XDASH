/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { useRouter } from 'next/navigation';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const router = useRouter();
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const menuLeftRef = useRef(null);
    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img src={`/images/logo/logo.png`} height={'35px'} alt="logo" />
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <Menu
                    model={[
                        {
                            label: 'Options',
                            items: [
                                {
                                    label: 'Refresh',
                                    icon: 'pi pi-refresh',
                                    command: () => {
                                        const currentPath = window.location.pathname;
                                        const queryString = window.location.search;
                                        const newPath = currentPath === '/' || currentPath === "/index.html" ? "/index.html" : `${currentPath}.html`;
                                        window.location.href = `${newPath}${queryString}`;
                                    }
                                },
                                {
                                    label: 'Logout',
                                    icon: 'pi pi-sign-out',
                                    url: '/perform_logout'
                                }
                            ]
                        }
                    ]}
                    popup
                    ref={menuLeftRef}
                    id="popup_menu_left"
                />
                <Button
                    className="p-link layout-topbar-button"
                    onClick={(event) => {
                        // @ts-ignore
                        return menuLeftRef.current.toggle(event);
                    }}
                    aria-controls="popup_menu_left"
                    aria-haspopup
                >
                    <i className="pi pi-user"></i>
                    <span>Profile</span>
                </Button>

                <Link href="/settings">
                    <button type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-cog"></i>
                        <span>Settings</span>
                    </button>
                </Link>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
