import { useRef, useState } from "react";

export default function AudioPlayer() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    return (
        <div className="audio-player">
            <div className="player-display">
                <span className="scrolling-text">Adventure Squad Theme.mp3</span>
                <div className="visualizer">
                    {/* Fake visualizer bars */}
                    <div className={`bar ${isPlaying ? 'animating' : ''}`} style={{ animationDelay: '0ms' }}></div>
                    <div className={`bar ${isPlaying ? 'animating' : ''}`} style={{ animationDelay: '100ms' }}></div>
                    <div className={`bar ${isPlaying ? 'animating' : ''}`} style={{ animationDelay: '200ms' }}></div>
                    <div className={`bar ${isPlaying ? 'animating' : ''}`} style={{ animationDelay: '50ms' }}></div>
                </div>
            </div>

            <div className="controls">
                <button onClick={togglePlay} className="play-btn">
                    {isPlaying ? (
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
                    ) : (
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    )}
                </button>

                <div className="volume-control">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="volume-slider"
                    />
                </div>
            </div>

            <audio
                ref={audioRef}
                src="/Adventure%20Squad%20Theme.mp3"
                onEnded={() => setIsPlaying(false)}
            />
        </div>
    );
}
