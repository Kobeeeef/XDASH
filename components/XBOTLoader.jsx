import { Image } from 'primereact/image';
import LoadingDots from './LoadingDots';
import React from 'react';
import PropTypes from 'prop-types';

const Loader = ({ message, speed="normal", dotSpeed = 400, ...classes }) => {

        return (<div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'

        }}>
            <Image {...classes} className={speed === "fast" ? 'animate-pulse-fast' : 'animate-pulse'} alt={'XBOT ROBOTICS LOGO'}
                   src={'/images/logo/logo.png'} />
            {message && <p className={'font-bold'}>{message ?? "Loading"}<LoadingDots delay={dotSpeed} /></p>}
        </div>);

}
Loader.propType = {
    message: PropTypes.number
}
export default Loader
