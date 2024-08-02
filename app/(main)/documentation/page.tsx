/* eslint-disable @next/next/no-sync-scripts */
import React from 'react';

const Documentation = () => {
    return (
        <>
            <div className="grid fadeIn">
                <div className="col-12">
                    <div className="card docs">
                        <h4>About This Website</h4>
                        <p>
                            This website is created for XBOT Robotics FRC&apos;s vision team. It is designed to control all machines that host the cameras, AI models, and XTABLES. The website provides a user-friendly interface that simplifies the
                            management and operation of these systems.
                        </p>
                        <p>
                            Our goal is to streamline the control process, making it easy for team members to interact with the hardware and software components seamlessly. With this platform, users can monitor camera feeds, manage AI model
                            operations, and interact with XTABLES data efficiently.
                        </p>
                        <p>
                            For more details and to contribute to the project, please visit our GitHub repository:
                            <br />
                            <a href="https://github.com/Kobeeeef/XDASH" className="font-medium hover:underline text-primary">
                                XBOT Robotics Control Dashboard GitHub Repository
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Documentation;
