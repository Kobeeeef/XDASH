/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-home', to: '/' },
                { label: 'Console', icon: "pi console-icon",  to: '/console.html' },
                {
                label: 'Network',
                icon: 'pi pi-sitemap',
                items: [{ label: 'Statistics', icon: 'pi pi-wifi', to: '/network/stats.html' }, {
                    label: 'mDNS',
                    icon: 'pi pi-globe',
                    to: '/network/mDNS'
                },
                    { label: 'Scan', icon: 'pi pi-search', to: '/network/scan.html' },
                    { label: 'XCASTER', icon: 'pi pi-megaphone', to: '/network/XCASTER.html' }]
            },

            ]
        },
        {
            label: 'Vision',
            items: [
                { label: 'Probability Mapping', icon: 'pi pi-map', to: '/probability-mapping.html' },
                { label: 'April Tags', icon: 'pi pi-qrcode', to: '/photonvision.html' },
                // { label: 'Live Camera', icon: 'pi pi-camera', to: '/camera' }
            ]
        },
        {
            label: 'Machines',
            items: [
                { label: 'View', icon: 'pi pi-server', to: '/machines/view.html' },
                { label: 'Scripts', icon: 'pi pi-code', to: '/scripts.html' },
                { label: 'Dockers', icon: 'pi pi-box', items: [
                        { label: "Single Pipeline", icon: "pi pi-clock", to: '/dockers.html'},
                        { label: "Compose Pipeline", icon: "pi pi-book", to: '/dockers/compose.html'},
                        { label: "Scripts", icon: "pi pi-code", to: '/dockers/scripts.html'}
                    ] }

            ]
        },
        {
            label: 'Network Tables',
            items: [
                { label: 'XTABLES', icon: 'pi pi-fw pi-table', to: '/xtables.html' },

                {
                    label: 'Statistics', icon: 'pi pi-chart-bar',
                    items: [
                        { label: 'Live Statistics', icon: 'pi pi-chart-line', to: '/xtables/stats.html' },
                        { label: 'Record Statistics', icon: 'pi pi-history', to: '/xtables/stats/record.html' }
                    ]
                },
                { label: 'Graphs', icon: 'pi pi-chart-pie', to: '/xtables/graphs.html' }

            ]
        },
        {
            label: 'Settings',
            items: [{ label: 'Settings', icon: 'pi pi-cog', to: '/settings.html' }]
        },
        // {
        //     label: 'UI Components',
        //     items: [
        //         { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
        //         { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
        //         { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', to: '/uikit/floatlabel' },
        //         { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', to: '/uikit/invalidstate' },
        //         { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/uikit/button', class: 'rotated-icon' },
        //         { label: 'Table', icon: 'pi pi-fw pi-table', to: '/uikit/table' },
        //         { label: 'List', icon: 'pi pi-fw pi-list', to: '/uikit/list' },
        //         { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree' },
        //         { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/uikit/panel' },
        //         { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/uikit/overlay' },
        //         { label: 'Media', icon: 'pi pi-fw pi-image', to: '/uikit/media' },
        //         { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/uikit/menu', preventExact: true },
        //         { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
        //         { label: 'File', icon: 'pi pi-fw pi-file', to: '/uikit/file' },
        //         { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' },
        //         { label: 'Misc', icon: 'pi pi-fw pi-circle', to: '/uikit/misc' }
        //     ]
        // },
        // {
        //     label: 'Pages',
        //     icon: 'pi pi-fw pi-briefcase',
        //     to: '/pages',
        //     items: [
        //         {
        //             label: 'Auth',
        //             icon: 'pi pi-fw pi-user',
        //             items: [
        //                 {
        //                     label: 'Login',
        //                     icon: 'pi pi-fw pi-sign-in',
        //                     to: '/auth/login'
        //                 },
        //                 {
        //                     label: 'Error',
        //                     icon: 'pi pi-fw pi-times-circle',
        //                     to: '/auth/error'
        //                 },
        //                 {
        //                     label: 'Access Denied',
        //                     icon: 'pi pi-fw pi-lock',
        //                     to: '/auth/access'
        //                 }
        //             ]
        //         },
        //         {
        //             label: 'Crud',
        //             icon: 'pi pi-fw pi-pencil',
        //             to: '/pages/crud'
        //         },
        //         {
        //             label: 'Timeline',
        //             icon: 'pi pi-fw pi-calendar',
        //             to: '/pages/timeline'
        //         },
        //         {
        //             label: 'Not Found',
        //             icon: 'pi pi-fw pi-exclamation-circle',
        //             to: '/pages/notfound'
        //         },
        //         {
        //             label: 'Empty',
        //             icon: 'pi pi-fw pi-circle-off',
        //             to: '/pages/empty'
        //         }
        //     ]
        // },
        // {
        //     label: 'Hierarchy',
        //     items: [
        //         {
        //             label: 'Submenu 1',
        //             icon: 'pi pi-fw pi-bookmark',
        //             items: [
        //                 {
        //                     label: 'Submenu 1.1',
        //                     icon: 'pi pi-fw pi-bookmark',
        //                     items: [
        //                         { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
        //                         { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
        //                         { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
        //                     ]
        //                 },
        //                 {
        //                     label: 'Submenu 1.2',
        //                     icon: 'pi pi-fw pi-bookmark',
        //                     items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
        //                 }
        //             ]
        //         },
        //
        //     ]
        // },
        {
            label: 'Get Started',
            items: [
                {
                    label: 'Documentation',
                    icon: 'pi pi-fw pi-question',
                    to: '/documentation.html'
                }
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> :
                        <li className="menu-separator"></li>;
                })}

                <Link href="/" style={{ cursor: 'pointer' }}>
                    <img alt="XBOT Robotics" className="w-full my-4" src={`/images/logo/logo.png`} />
                </Link>
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
