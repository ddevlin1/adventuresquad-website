import { Link } from "react-router";

export function meta() {
    return [
        { title: "The Adventure Squad - Home" },
        { name: "description", content: "Join the Adventure Squad in their latest missions!" },
    ];
}

import AudioPlayer from "../components/AudioPlayer";

export default function Home() {
    return (
        <div className="home">
            <section className="hero">
                <div className="container">
                    <h1>Adventure Squad HQ Online ⚡</h1>
                    <p style={{ fontSize: "1.2rem", marginBottom: "2rem", color: "#ccc", maxWidth: "600px", margin: "0 auto", paddingBottom: "2rem" }}>
                        Initiating protocol... solving mysteries across the neighborhood.
                    </p>

                    <AudioPlayer />

                    <div style={{ marginTop: "3rem" }}>
                        <Link to="/story" className="btn">
                            Access Latest Log
                        </Link>
                    </div>
                </div>
            </section>

            <div className="container">
                <div className="card-grid">
                    <Link to="/story" className="card">
                        <h3>📖 Mission Logs</h3>
                        <p>Decrypted files of our recent operations.</p>
                    </Link>
                    <Link to="/music" className="card">
                        <h3>🎵 Sonic Data</h3>
                        <p>Stream the official squad frequency.</p>
                    </Link>
                    <Link to="/squad-profiles" className="card">
                        <h3>🦸 Squad Profiles</h3>
                        <p>Access profiles and special ability stats.</p>
                    </Link>
                    <Link to="/create-story" className="card">
                        <h3>✍️ New Protocol</h3>
                        <p>Input data for the next simulation.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
