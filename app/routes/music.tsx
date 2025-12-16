export function meta() {
    return [
        { title: "The Adventure Squad - Music" },
    ];
}

export default function Music() {
    return (
        <div className="container" style={{ textAlign: "center", marginTop: "2rem" }}>
            <h1>Music Room 🎵</h1>
            <p>Listen to the official Adventure Squad Theme!</p>

            <div className="card" style={{ maxWidth: "500px", margin: "2rem auto", padding: "3rem" }}>
                <div style={{ fontSize: "5rem" }}>💿</div>
                <h3>The Adventure Squad Theme</h3>
                <p><em>( Coming Soon! )</em></p>
                <audio controls style={{ width: "100%", marginTop: "1rem" }}>
                    <source src="/theme-song.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
                <p style={{ marginTop: "1rem" }}><small>Get ready to dance!</small></p>
            </div>
        </div>
    );
}
