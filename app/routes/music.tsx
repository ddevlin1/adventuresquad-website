export function meta() {
    return [
        { title: "The Adventure Squad - Music" },
    ];
}

import AudioPlayer from "../components/AudioPlayer";

export default function Music() {
    return (
        <div className="container" style={{ textAlign: "center", marginTop: "2rem" }}>
            <h1>Sonic Frequency 🎵</h1>
            <p>Accessing encrypted audio streams...</p>

            <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
                <AudioPlayer />
                <p style={{ marginTop: "1rem", color: "#888" }}><small>Secure channel established.</small></p>
            </div>
        </div>
    );
}
