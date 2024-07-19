/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { classNames } from 'primereact/utils';

const LoginPage = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { layoutConfig } = useContext(LayoutContext);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const handleLogin = async () => {
        setError('');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        try {
            setLoading(true);
            const response = await fetch('/perform_login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `username=user&password=${password}`,
                signal: controller.signal
            });
            setLoading(false);
            clearTimeout(timeoutId);
            if (response.ok) {
                router.push('/');
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
    };

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src="/layout/images/logo.png" alt="XBOT logo" className="mb-5 w-30rem flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <img src="/layout/images/favicon.ico" alt="Image" height="50" className="mb-3" />
                            <div className="text-900 text-3xl font-medium mb-3">Welcome!</div>
                            <span className="text-600 font-medium">Sign in to continue</span>
                        </div>

                        <div>
                            <div>
                                <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                    Password
                                </label>
                                <Password
                                    inputId="password1"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    toggleMask
                                    className="w-full mb-5"
                                    inputClassName="w-full p-3 md:w-30rem"
                                />
                            </div>
                            {error && (
                                <div className="mb-3 text-red-600">
                                    {error}
                                </div>
                            )}
                            <Button
                                loading={loading}
                                label="Sign In"
                                className="w-full p-3 text-xl"
                                onClick={handleLogin}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
