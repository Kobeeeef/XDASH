'use client';
import React, { useContext, useEffect, useState } from 'react';
import type { ChartDataState, ChartOptionsState } from '@/types';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { ChartData, ChartOptions } from 'chart.js';
import { Chart } from 'primereact/chart';

const EmptyPage = () => {
    const [options, setOptions] = useState<ChartOptionsState>({});
    const [data, setChartData] = useState<ChartDataState>({});
    const { layoutConfig } = useContext(LayoutContext);

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#6c757d';
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#dfe7ef';

        const lineData: ChartData = {
            labels: ['7:46', 'February', 'March', 'April', 'May', 'June', 'July', "da"],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40, 1000],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--primary-500') || '#6366f1',
                    borderColor: documentStyle.getPropertyValue('--primary-500') || '#6366f1',
                    tension: 0.4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90, 1],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--primary-200') || '#bcbdf9',
                    borderColor: documentStyle.getPropertyValue('--primary-200') || '#bcbdf9',
                    tension: 0.4
                }
            ]
        };

        const lineOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    },
                    border: {
                        display: false
                    }
                }
            }
        };

        setOptions({
            lineOptions
        });
        setChartData({
            lineData
        });
    }, [layoutConfig]);

    return (
        <div className="grid p-fluid">
            <div className="col-12">
                <div className="card">
                    <Chart type="line" data={data.lineData} options={options.lineOptions}></Chart>
                </div>
            </div>
        </div>
    );
};

export default EmptyPage;
