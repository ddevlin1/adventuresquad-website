export function meta() {
    return [
        { title: "The Adventure Squad - Create a Story" },
    ];
}

export default function CreateStory() {
    return (
        <div className="container">
            <h1 style={{ textAlign: "center", marginTop: "2rem" }}>Create Your Own Adventure! ✍️</h1>
            <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
                <form onSubmit={(e) => { e.preventDefault(); alert("Wow! That's a great story idea! We'll add it to the archives!"); }}>
                    <div style={{ marginBottom: "1rem", textAlign: "left" }}>
                        <label style={{ display: "block", fontWeight: "bold", marginBottom: ".5rem" }}>Story Title:</label>
                        <input type="text" placeholder="The Case of..." style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "2px solid #eee", fontSize: "1rem" }} />
                    </div>
                    <div style={{ marginBottom: "1rem", textAlign: "left" }}>
                        <label style={{ display: "block", fontWeight: "bold", marginBottom: ".5rem" }}>The Villain:</label>
                        <input type="text" placeholder="Dr. Diabolical..." style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "2px solid #eee", fontSize: "1rem" }} />
                    </div>
                    <div style={{ marginBottom: "1rem", textAlign: "left" }}>
                        <label style={{ display: "block", fontWeight: "bold", marginBottom: ".5rem" }}>What Happens?</label>
                        <textarea rows={5} placeholder="Once upon a time..." style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "2px solid #eee", fontSize: "1rem", fontFamily: "inherit" }}></textarea>
                    </div>
                    <button type="submit" className="btn" style={{ width: "100%", border: "none", cursor: "pointer" }}>Send to HQ!</button>
                </form>
            </div>
        </div>
    );
}
