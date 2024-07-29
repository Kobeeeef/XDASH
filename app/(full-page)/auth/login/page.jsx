/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';

const LoginPage = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { layoutConfig } = useContext(LayoutContext);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });
    const toast = useRef(null);
    useEffect(() => {
        setError(null);
    }, [password]);
    const handleLogin = useCallback(async (e) => {
        e.preventDefault();
        if (!password) {
            return setError('Password is required');
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        try {
            setLoading(true);
            const response = await fetch('/perform_login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `username=user&password=${password}`,
                signal: controller.signal
            });
            setLoading(false);
            clearTimeout(timeoutId);
            if (response.ok) {
                setLoading(true);
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Redirecting to dashboard...',
                    life: 2000
                });
                setTimeout(() => {
                    router.replace('/');
                }, 2000);
            } else {
                setError('Invalid password, please try again.');
            }
        } catch (error) {
            setLoading(false);
            if (error.name === 'AbortError') {
                setError('Request timed out, please try again.');
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    }, [password, router]);
    useEffect(() => {
        const handleKeyDown = async (event) => {
            if (event.key === 'Enter') {
                await handleLogin(event);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleLogin]);
    return (
        <div className={containerClassName}>
            <Toast ref={toast} />
            <div className="flex flex-column align-items-center justify-content-center">
                <img src="/images/logo/logo.png" alt="XBOT logo" className="xl:mb-5 lg:mb-4 sm:mb-3 xl:mb-5 lg:mb-4 sm:mb-3 mb-2 xl:w-30rem lg:w-25rem sm:w-20rem w-9 flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <img src="/images/logo/favicon.ico" alt="Image" height="50" className="mb-3" />
                            <div className="text-900 text-3xl font-medium mb-3">Welcome!</div>
                            <span className="text-600 font-medium">Sign in to continue</span>
                        </div>

                        <div>
                            <div>
                                <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                    Password
                                </label>
                                {error && <div className="mb-3 text-red-600">{error}</div>}
                                <Password invalid={error} disabled={loading} inputId="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem" />
                            </div>
                            <Button loading={loading} label="Sign In" className="w-full p-3 text-xl" onClick={handleLogin} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
