import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { socket } from '../socket';

const CosmosCanvas = ({ onProximityChange }) => {
    const canvasRef = useRef(null);
    const playersRef = useRef({});
    const appRef = useRef(null);
    const keys = useRef({});
    const lastProximityId = useRef(null);
    const isTyping = useRef(false);

    useEffect(() => {
        // Stop movement if user is typing
        const handleFocus = () => { isTyping.current = true; };
        const handleBlur = () => { isTyping.current = false; };

        window.addEventListener('focusin', handleFocus);
        window.addEventListener('focusout', handleBlur);

        const initPixi = async () => {
            if (appRef.current) return;

            const app = new PIXI.Application();
            await app.init({
                width: window.innerWidth,
                height: window.innerHeight,
                backgroundColor: 0x0f172a,
                antialias: true,
            });

            appRef.current = app;
            if (canvasRef.current) canvasRef.current.appendChild(app.canvas);

            // 1. IMPROVED AVATAR DESIGN HELPER
            const createStyledAvatar = (color, name = null) => {
                const container = new PIXI.Container();

                // Outer Glow/Border
                const border = new PIXI.Graphics()
                    .circle(0, 0, 24)
                    .fill({ color: 0xffffff, alpha: 0.1 });

                // Main Body
                const body = new PIXI.Graphics()
                    .circle(0, 0, 20)
                    .fill(color)
                    .stroke({ color: 0xffffff, width: 2, alpha: 0.8 });

                container.addChild(border, body);

                // Add Name Tag if provided (For remote players)
                if (name) {
                    const nameLabel = new PIXI.Text({
                        text: name,
                        style: {
                            fontSize: 14,
                            fill: '#ffffff',
                            fontWeight: 'bold',
                            stroke: { color: '#000000', width: 3 }
                        }
                    });
                    nameLabel.anchor.set(0.5);
                    nameLabel.y = -40;
                    container.addChild(nameLabel);
                }

                return container;
            };

            const myAvatar = createStyledAvatar(0x4f46e5);
            myAvatar.x = Math.random() * (app.screen.width - 100) + 50;
            myAvatar.y = Math.random() * (app.screen.height - 100) + 50;
            app.stage.addChild(myAvatar);

            socket.emit('requestPlayers');

            // 2. Remote Player Logic
            const addRemotePlayer = (id, data) => {
                if (playersRef.current[id]) return;

                const container = createStyledAvatar(0xef4444, data.name || "Explorer");
                container.x = data.x;
                container.y = data.y;

                app.stage.addChild(container);
                playersRef.current[id] = container;
            };

            socket.on('currentPlayers', (allPlayers) => {
                Object.keys(allPlayers).forEach((id) => {
                    if (id !== socket.id) addRemotePlayer(id, allPlayers[id]);
                });
            });

            socket.on('newPlayer', (data) => addRemotePlayer(data.id, data));

            socket.on('playerMoved', (data) => {
                if (playersRef.current[data.id]) {
                    playersRef.current[data.id].x = data.x;
                    playersRef.current[data.id].y = data.y;
                }
            });

            socket.on('playerDisconnected', (id) => {
                if (playersRef.current[id]) {
                    app.stage.removeChild(playersRef.current[id]);
                    delete playersRef.current[id];
                }
            });

            // 3. Game Loop
            app.ticker.add(() => {
                if (isTyping.current) return;

                let moved = false;
                const speed = 5;

                if (keys.current['ArrowUp'] || keys.current['KeyW']) { myAvatar.y -= speed; moved = true; }
                if (keys.current['ArrowDown'] || keys.current['KeyS']) { myAvatar.y += speed; moved = true; }
                if (keys.current['ArrowLeft'] || keys.current['KeyA']) { myAvatar.x -= speed; moved = true; }
                if (keys.current['ArrowRight'] || keys.current['KeyD']) { myAvatar.x += speed; moved = true; }

                if (moved) {
                    myAvatar.x = Math.max(25, Math.min(app.screen.width - 25, myAvatar.x));
                    myAvatar.y = Math.max(25, Math.min(app.screen.height - 25, myAvatar.y));
                    socket.emit('move', { x: myAvatar.x, y: myAvatar.y });
                }

                // --- FIXED PROXIMITY CHECK ---
                // --- STABLE PROXIMITY LOGIC (Inside app.ticker.add) ---
                const RADIUS_IN = 100;  // Is distance par chat khulegi
                const RADIUS_OUT = 140; // Jab tak isse door nahi jaoge, chat band nahi hogi (Buffer)

                let nearbyUser = null;

                Object.keys(playersRef.current).forEach(id => {
                    const p = playersRef.current[id];
                    const dx = myAvatar.x - p.x;
                    const dy = myAvatar.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Dynamic Radius check
                    const activeRadius = (lastProximityId.current === id) ? RADIUS_OUT : RADIUS_IN;

                    if (dist < activeRadius) {
                        const textChild = p.children.find(c => c instanceof PIXI.Text);
                        nearbyUser = { id: id, name: textChild ? textChild.text : "Explorer" };
                    }
                });

                const currentId = nearbyUser ? nearbyUser.id : null;

                // Ye guard spam ko rokta hai
                if (currentId !== lastProximityId.current) {
                    lastProximityId.current = currentId; // Turant update karo taaki agla frame skip ho jaye
                    console.log("SYNCING PROXIMITY:", currentId);
                    onProximityChange(nearbyUser);
                }
            });
        };

        initPixi();

        const handleDown = (e) => { keys.current[e.code] = true; };
        const handleUp = (e) => { keys.current[e.code] = false; };
        window.addEventListener('keydown', handleDown);
        window.addEventListener('keyup', handleUp);

        return () => {
            window.removeEventListener('keydown', handleDown);
            window.removeEventListener('keyup', handleUp);
            window.removeEventListener('focusin', handleFocus);
            window.removeEventListener('focusout', handleBlur);
            socket.off();
            if (appRef.current) {
                appRef.current.destroy(true, { children: true });
                appRef.current = null;
            }
        };
    }, [onProximityChange]);

    return <div ref={canvasRef} className="w-full h-full" />;
};

export default CosmosCanvas;