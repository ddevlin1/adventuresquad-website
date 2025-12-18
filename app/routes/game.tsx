import { useEffect, useRef, useState, useCallback } from "react";

export function meta() {
    return [
        { title: "Adventure Squad - Neon Runner" },
        { name: "description", content: "Jump, Dodge, Collect! Join the squad in this high-tech runner game." },
    ];
}

// --- Types ---
type GameState = 'CHARACTER_SELECT' | 'START' | 'PLAYING' | 'GAME_OVER';

interface Character {
    id: string;
    name: string;
    description: string;
    svg: string;
    color: string;
}

const CHARACTERS: Character[] = [
    { id: 'jack', name: 'Jack', description: 'Tech Leader', svg: '/jack.svg', color: '#00ffff' },
    { id: 'peter', name: 'Peter', description: 'Detective', svg: '/peter.svg', color: '#22c55e' },
    { id: 'charlie', name: 'Charlie', description: 'Powerhouse', svg: '/charlie.svg', color: '#ff00ff' },
];

interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface Platform extends Rect {
    id: number;
}

interface Enemy extends Rect {
    svg: string;
    id: number;
}

interface Coin extends Rect {
    id: number;
    collected: boolean;
}

interface HeartPickup extends Rect {
    id: number;
    collected: boolean;
}

// --- Constants ---
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const GROUND_Y = 350;
const CEILING_Y = 60;
const PLAYER_X = 80;
const PLAYER_SIZE = 45;
const GRAVITY = 0.7;
const JUMP_FORCE = -14;
const BASE_SPEED = 4;
const MAX_SPEED = 12;

const ENEMY_SVGS = [
    '/ghost.svg',
    '/ghost2.svg',
    '/dino.svg',
    '/dino2.svg'
];

// --- Utility: AABB Collision ---
function checkCollision(a: Rect, b: Rect): boolean {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export default function Game() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameState, setGameState] = useState<GameState>('CHARACTER_SELECT');
    const [score, setScore] = useState(0);
    const [hearts, setHearts] = useState(3);
    const [selectedCharacter, setSelectedCharacter] = useState<Character>(CHARACTERS[0]);

    // Refs for game loop state
    const stateRef = useRef({
        playerY: GROUND_Y, // Y represents bottom/feet position
        playerVy: 0,
        isGrounded: true,
        score: 0,
        hearts: 3,
        speed: BASE_SPEED,
        platforms: [] as Platform[],
        enemies: [] as Enemy[],
        coins: [] as Coin[],
        heartPickups: [] as HeartPickup[],
        lastPlatformSpawn: 0,
        lastObjectSpawn: 0,
        nextPlatformDelay: 1000,
        nextObjectDelay: 1500,
        invulnerableUntil: 0,
        frameCount: 0,
    });

    const frameRef = useRef<number>(0);
    const audioRef = useRef<HTMLAudioElement>(null);
    const gameOverAudioRef = useRef<HTMLAudioElement>(null);
    const playerImageRef = useRef<HTMLImageElement | null>(null);
    const enemyImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());

    // Load player image when character changes
    useEffect(() => {
        const img = new Image();
        img.src = selectedCharacter.svg;
        playerImageRef.current = img;
    }, [selectedCharacter]);

    // Preload enemy images
    useEffect(() => {
        ENEMY_SVGS.forEach(svgPath => {
            const img = new Image();
            img.src = svgPath;
            img.onload = () => {
                enemyImagesRef.current.set(svgPath, img);
            };
        });
    }, []);

    const resetGame = useCallback(() => {
        const s = stateRef.current;
        s.playerY = GROUND_Y; // Y represents bottom/feet position
        s.playerVy = 0;
        s.isGrounded = true;
        s.score = 0;
        s.hearts = 3;
        s.speed = BASE_SPEED;
        s.platforms = [];
        s.enemies = [];
        s.coins = [];
        s.heartPickups = [];
        s.lastPlatformSpawn = 0;
        s.lastObjectSpawn = 0;
        s.nextPlatformDelay = 1000;
        s.nextObjectDelay = 1500;
        s.invulnerableUntil = 0;
        s.frameCount = 0;
        setScore(0);
        setHearts(3);
    }, []);

    const startGame = useCallback(() => {
        resetGame();
        setGameState('PLAYING');
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.playbackRate = 1;
            audioRef.current.play().catch(() => { });
        }
        if (gameOverAudioRef.current) {
            gameOverAudioRef.current.pause();
            gameOverAudioRef.current.currentTime = 0;
        }
    }, [resetGame]);

    const endGame = useCallback(() => {
        setGameState('GAME_OVER');
        if (audioRef.current) {
            audioRef.current.pause();
        }
        if (gameOverAudioRef.current) {
            gameOverAudioRef.current.currentTime = 0;
            gameOverAudioRef.current.play().catch(() => { });
        }
    }, []);

    const takeDamage = useCallback(() => {
        const s = stateRef.current;
        if (Date.now() < s.invulnerableUntil) return;

        s.hearts -= 1;
        s.invulnerableUntil = Date.now() + 1500;
        setHearts(s.hearts);

        if (s.hearts <= 0) {
            endGame();
        }
    }, [endGame]);

    const jump = useCallback(() => {
        const s = stateRef.current;
        if (gameState === 'PLAYING' && s.isGrounded) {
            s.playerVy = JUMP_FORCE;
            s.isGrounded = false;
        } else if (gameState !== 'PLAYING') {
            startGame();
        }
    }, [gameState, startGame]);

    // Main game loop
    useEffect(() => {
        if (gameState !== 'PLAYING') return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const s = stateRef.current;

        const loop = (timestamp: number) => {
            if (gameState !== 'PLAYING') return;

            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            s.frameCount++;

            // --- Speed Progression ---
            s.speed = Math.min(BASE_SPEED + s.score / 50, MAX_SPEED);
            if (audioRef.current) {
                audioRef.current.playbackRate = 1 + s.score / 500;
            }

            // --- Spawning Logic (Independent Timers) ---

            // Spawn Platforms independently
            if (timestamp - s.lastPlatformSpawn > s.nextPlatformDelay) {
                const platformHeight = 20;
                const platformY = GROUND_Y - 80 - Math.random() * 100;
                s.platforms.push({
                    x: CANVAS_WIDTH,
                    y: platformY,
                    w: 100 + Math.random() * 80,
                    h: platformHeight,
                    id: Date.now()
                });
                s.lastPlatformSpawn = timestamp;
                // Random delay between 800-2000ms, faster as score increases
                s.nextPlatformDelay = Math.max(800, 2000 - s.score * 2) + Math.random() * 500;
            }

            // Spawn Objects (Enemies, Coins, Hearts) independently
            if (timestamp - s.lastObjectSpawn > s.nextObjectDelay) {
                const rand = Math.random();

                if (rand < 0.08) {
                    // 8% chance: Spawn Heart
                    const heartY = Math.random() > 0.5 ? GROUND_Y - 70 : GROUND_Y - 150;
                    s.heartPickups.push({ x: CANVAS_WIDTH, y: heartY, w: 25, h: 25, id: Date.now(), collected: false });
                } else if (rand < 0.65) {
                    // 57% chance: Spawn Enemy
                    s.enemies.push({
                        x: CANVAS_WIDTH,
                        y: GROUND_Y - 35,
                        w: 35,
                        h: 35,
                        svg: ENEMY_SVGS[Math.floor(Math.random() * ENEMY_SVGS.length)],
                        id: Date.now()
                    });
                } else {
                    // 35% chance: Spawn Coin
                    const coinY = Math.random() > 0.5 ? GROUND_Y - 70 : GROUND_Y - 150;
                    s.coins.push({ x: CANVAS_WIDTH, y: coinY, w: 20, h: 20, id: Date.now(), collected: false });
                }

                s.lastObjectSpawn = timestamp;
                // Random delay between 600-1800ms, faster as score increases
                s.nextObjectDelay = Math.max(600, 1800 - s.score * 3) + Math.random() * 600;
            }

            // --- Update & Draw Platforms ---
            ctx.fillStyle = "#00ffff";
            for (let i = s.platforms.length - 1; i >= 0; i--) {
                const p = s.platforms[i];
                p.x -= s.speed;
                if (p.x + p.w < 0) { s.platforms.splice(i, 1); continue; }
                ctx.shadowBlur = 5;
                ctx.shadowColor = "#00ffff";
                ctx.fillRect(p.x, p.y, p.w, p.h);
                ctx.shadowBlur = 0;
            }

            // --- Update Player Physics ---
            s.playerVy += GRAVITY;
            s.playerY += s.playerVy;
            s.isGrounded = false;

            // Player dimensions (y is bottom/feet position)
            const PLAYER_WIDTH = 35;
            const PLAYER_HEIGHT = 90;

            // Player hitbox - y represents bottom of sprite
            const playerRect: Rect = {
                x: PLAYER_X + 5,
                y: s.playerY - PLAYER_HEIGHT,
                w: PLAYER_WIDTH,
                h: PLAYER_HEIGHT
            };

            // Ground collision
            if (s.playerY >= GROUND_Y) {
                s.playerY = GROUND_Y;
                s.playerVy = 0;
                s.isGrounded = true;
            }

            // Ceiling collision (damage!)
            if (s.playerY - PLAYER_HEIGHT <= CEILING_Y) {
                s.playerY = CEILING_Y + PLAYER_HEIGHT;
                s.playerVy = 2; // Bounce down
                takeDamage();
            }

            // Platform collision (land on top)
            for (const p of s.platforms) {
                // Only land if falling down and feet are near platform top
                if (s.playerVy >= 0 &&
                    playerRect.x + playerRect.w > p.x && playerRect.x < p.x + p.w &&
                    s.playerY >= p.y && s.playerY <= p.y + p.h + s.playerVy + 5) {
                    s.playerY = p.y;
                    s.playerVy = 0;
                    s.isGrounded = true;
                }
            }

            // --- Draw Player ---
            const isInvulnerable = Date.now() < s.invulnerableUntil;
            if (!isInvulnerable || s.frameCount % 10 < 5) { // Blink when invulnerable
                if (playerImageRef.current) {
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = selectedCharacter.color;
                    // Draw player sprite with feet at s.playerY
                    ctx.drawImage(playerImageRef.current, PLAYER_X, s.playerY - PLAYER_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT);
                    ctx.shadowBlur = 0;
                } else {
                    ctx.fillStyle = selectedCharacter.color;
                    ctx.fillRect(PLAYER_X, s.playerY - PLAYER_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT);
                }
            }

            // --- Update & Draw Enemies ---
            for (let i = s.enemies.length - 1; i >= 0; i--) {
                const e = s.enemies[i];
                e.x -= s.speed;
                if (e.x + e.w < 0) {
                    s.enemies.splice(i, 1);
                    s.score += 1;
                    setScore(s.score);
                    continue;
                }

                // Enemy hitbox (e.y is bottom position, matching player)
                const enemyRect: Rect = {
                    x: e.x,
                    y: e.y - e.h,
                    w: e.w,
                    h: e.h
                };

                // Draw enemy SVG with feet at e.y
                const enemyImg = enemyImagesRef.current.get(e.svg);
                if (enemyImg) {
                    ctx.drawImage(enemyImg, e.x, e.y - e.h, e.w, e.h);
                } else {
                    // Fallback to colored rectangle if image not loaded
                    ctx.fillStyle = "#ff0055";
                    ctx.fillRect(e.x, e.y - e.h, e.w, e.h);
                }

                // Collision with player
                if (checkCollision(playerRect, enemyRect)) {
                    takeDamage();
                }
            }

            // --- Update & Draw Coins ---
            ctx.fillStyle = "#ffd700";
            for (let i = s.coins.length - 1; i >= 0; i--) {
                const c = s.coins[i];
                c.x -= s.speed;
                if (c.x + c.w < 0) { s.coins.splice(i, 1); continue; }

                ctx.beginPath();
                ctx.arc(c.x + c.w / 2, c.y + c.h / 2, c.w / 2, 0, Math.PI * 2);
                ctx.fill();

                if (checkCollision(playerRect, c)) {
                    s.coins.splice(i, 1);
                    s.score += 10;
                    setScore(s.score);
                }
            }

            // --- Update & Draw Hearts ---
            for (let i = s.heartPickups.length - 1; i >= 0; i--) {
                const h = s.heartPickups[i];
                h.x -= s.speed;
                if (h.x + h.w < 0) { s.heartPickups.splice(i, 1); continue; }

                // Draw Heart
                ctx.font = "24px 'Inter'";
                ctx.fillText("❤️", h.x, h.y + h.h);

                if (checkCollision(playerRect, h)) {
                    s.heartPickups.splice(i, 1);
                    if (s.hearts < 3) {
                        s.hearts += 1;
                        setHearts(s.hearts);
                    } else {
                        s.score += 50; // Bonus points if full health
                        setScore(s.score);
                    }
                }
            }

            // --- Draw Ground ---
            ctx.fillStyle = "#00ffff";
            ctx.shadowBlur = 8;
            ctx.shadowColor = "#00ffff";
            ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 4);
            ctx.shadowBlur = 0;

            // --- Draw Ceiling ---
            ctx.fillStyle = "#ff0055";
            ctx.shadowBlur = 8;
            ctx.shadowColor = "#ff0055";
            ctx.fillRect(0, CEILING_Y - 4, CANVAS_WIDTH, 4);
            ctx.shadowBlur = 0;

            frameRef.current = requestAnimationFrame(loop);
        };

        frameRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameRef.current);
    }, [gameState, takeDamage]);

    // Input Handling
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                jump();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [jump]);

    // Render Game Over screen
    useEffect(() => {
        if (gameState !== 'GAME_OVER') return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = "#fff";
        ctx.font = "40px 'Orbitron'";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
        ctx.font = "24px 'Orbitron'";
        ctx.fillText(`Final Score: ${stateRef.current.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
        ctx.font = "18px 'Inter'";
        ctx.fillStyle = "#00ffff";
        ctx.fillText("Tap or Press Space to Restart", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
    }, [gameState]);

    return (
        <div className="container" style={{ marginTop: "2rem" }}>
            <h1>Neon Runner 🏃‍♂️💨</h1>
            <p>Dodge enemies, jump on platforms, collect coins! <span style={{ color: "#ff0055" }}>Watch the ceiling!</span></p>

            <audio ref={audioRef} src="/AdventureSquad16bit.mp3" loop />
            <audio ref={gameOverAudioRef} src="/GameOver.mp3" />

            <div
                className="game-container"
                onClick={jump}
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: `${CANVAS_WIDTH}px`,
                    height: `${CANVAS_HEIGHT}px`,
                    margin: "2rem auto",
                    background: "linear-gradient(#0a0a12, #1a1a2e)",
                    border: "4px solid #00ffff",
                    borderRadius: "16px",
                    boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)",
                    overflow: "hidden",
                    cursor: "pointer",
                    userSelect: "none"
                }}
            >
                {/* HUD */}
                <div style={{ position: "absolute", top: 20, left: 20, color: "#fff", display: "flex", gap: "20px", fontSize: "1.2rem", fontWeight: "bold", textShadow: "0 0 5px #bf00ff", zIndex: 10 }}>
                    <span>SCORE: {score}</span>
                    <span>HEARTS: {"❤️".repeat(Math.max(0, hearts))}</span>
                </div>

                {/* Character Select Screen */}
                {gameState === 'CHARACTER_SELECT' && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.8)", zIndex: 30 }}>
                        <h2 style={{ fontSize: "2rem", color: "#fff", marginBottom: "1rem" }}>CHOOSE YOUR HERO</h2>
                        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
                            {CHARACTERS.map(char => (
                                <button
                                    key={char.id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedCharacter(char);
                                        setGameState('START');
                                    }}
                                    style={{
                                        background: "rgba(255,255,255,0.1)",
                                        border: `2px solid ${char.color}`,
                                        borderRadius: "12px",
                                        padding: "1rem",
                                        cursor: "pointer",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        minWidth: "100px",
                                        transition: "transform 0.2s"
                                    }}
                                >
                                    <img src={char.svg} alt={char.name} width="40" height="80" style={{ marginBottom: "0.5rem" }} />
                                    <span style={{ color: char.color, fontWeight: "bold" }}>{char.name}</span>
                                    <span style={{ color: "#aaa", fontSize: "0.8rem" }}>{char.description}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {gameState === 'START' && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", zIndex: 20 }}>
                        <h2 style={{ fontSize: "2.5rem", color: selectedCharacter.color, marginBottom: "0.5rem" }}>READY, {selectedCharacter.name.toUpperCase()}?</h2>
                        <p style={{ color: "#fff", fontSize: "1rem", marginBottom: "1rem" }}>Tap or Press Space to Start</p>
                        <p style={{ color: "#888", fontSize: "0.85rem" }}>Jump on platforms • Dodge villains • <span style={{ color: "#ff0055" }}>Avoid the ceiling!</span></p>
                        <button
                            onClick={(e) => { e.stopPropagation(); setGameState('CHARACTER_SELECT'); }}
                            style={{ marginTop: "1rem", background: "none", border: "1px solid #666", color: "#888", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}
                        >
                            Change Character
                        </button>
                    </div>
                )}

                <canvas
                    ref={canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    style={{ width: "100%", height: "100%" }}
                />
            </div>

            <div style={{ maxWidth: "600px", margin: "0 auto", color: "#888" }}>
                <p><strong>Controls:</strong> Space / Click to Jump</p>
            </div>
        </div>
    );
}
