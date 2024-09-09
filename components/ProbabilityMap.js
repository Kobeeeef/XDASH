import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Button } from 'primereact/button';

// Function to load emoji as a texture
const loadEmoji = (emoji) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 128;
    canvas.height = 128;
    ctx.font = '100px sans-serif';
    ctx.fillText(emoji, 0, 100);
    return new THREE.CanvasTexture(canvas);
};

// Function to load an image as a texture
const loadImage = (imagePath) => {
    return new Promise((resolve, reject) => {
        const loader = new THREE.TextureLoader();
        loader.load(
            imagePath,
            (texture) => {
                resolve(texture);
            },
            undefined,
            (err) => {
                reject(err);
            }
        );
    });
};

// Function to create game pieces (emoji or image)
const createPiece = async (scene, x, y, texture, probability, isRound = false) => {
    const geometry = isRound ? new THREE.CircleGeometry(25, 32) : new THREE.PlaneGeometry(50, 50);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: probability / 100  // Set opacity based on probability
    });

    const piece = new THREE.Mesh(geometry, material);
    piece.position.set(x, y, 0);
    scene.add(piece);
    return piece;
};

const ProbabilityMap = ({ initialRobotPosition, initialGamePieces, robotImagePath }) => {
    const containerRef = useRef(null);
    const [labels, setLabels] = useState([]);

    useEffect(() => {
        const container = containerRef.current;

        // Get parent div size
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Create a scene
        const scene = new THREE.Scene();

        // Create an orthographic camera for 2D view
        const camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0.1, 1000);
        camera.position.set(0, 0, 500);

        // Create a renderer and attach it to the container
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio); // To support high-DPI screens
        container.appendChild(renderer.domElement);

        // Create a black background plane
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Black background
        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        const updateLabels = (scene, camera) => {
            const newLabels = [];
            scene.children.forEach((object) => {
                if (object instanceof THREE.Mesh) {
                    const vector = new THREE.Vector3(object.position.x, object.position.y, object.position.z);
                    vector.project(camera);

                    // Convert from normalized device coordinates to screen coordinates
                    const x = (vector.x * 0.5 + 0.5) * container.clientWidth;
                    const y = -(vector.y * 0.5 - 0.5) * container.clientHeight;

                    // Add label for each piece
                    newLabels.push({ x, y, text: object.userData.probability });
                }
            });
            setLabels(newLabels);
        };

        const loadAndCreate = async () => {
            // Load the robot image as a texture
            const robotTexture = await loadEmoji('🤖');

            // Add the robot to the scene (robot image in circular geometry)
            const robot = await createPiece(scene, initialRobotPosition.x, initialRobotPosition.y, robotTexture, 100, true);
            robot.userData.probability = 100;

            // Add game pieces (emoji)
            for (const piece of initialGamePieces) {
                const emojiTexture = loadEmoji('⭕');
                const gamePiece = await createPiece(scene, piece.position.x, piece.position.y, emojiTexture, piece.probability);
                gamePiece.userData.probability = piece?.probability?.toFixed() ?? 0;
            }
        };

        loadAndCreate();

        const animate = () => {
            try {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
                updateLabels(scene, camera);
            } catch (e) {
            }
        };
        animate();

        // Handle window resizing to ensure the map always fits the parent div
        const handleResize = () => {
            const newWidth = container.clientWidth;
            const newHeight = container.clientHeight;

            // Update camera
            camera.left = newWidth / -2;
            camera.right = newWidth / 2;
            camera.top = newHeight / 2;
            camera.bottom = newHeight / -2;
            camera.updateProjectionMatrix();

            // Update renderer size
            renderer.setSize(newWidth, newHeight);
        };

        window.addEventListener('resize', handleResize);

        // Clean up on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
            container.removeChild(renderer.domElement);
        };
    }, [initialRobotPosition, initialGamePieces, robotImagePath]);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
                height: '50vh', // Set to 50% of the viewport height
                overflow: 'hidden' // Ensure no overflow beyond parent div
            }}
        >
            {/* The Three.js scene will be rendered here */}
            {labels.map((label, index) => (
                <Button
                    disabled={label.text <= 0}
                    rounded={true}
                    size={'small'}
                    key={index}
                    style={{
                        position: 'absolute',
                        left: `${label.x + 2}px`,
                        top: `${label.y - 25}px`,  // Slight offset to position above the piece
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    {label.text}%
                </Button>
            ))}
        </div>
    );
};

export default ProbabilityMap;
