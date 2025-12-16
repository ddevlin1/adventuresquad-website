const characters = [
    {
        name: "Jack",
        role: "Tech Specialist",
        color: "#00ccff",
        description: "The mastermind behind the squad's gadgets. Never seen without his tablet.",
        detectiveInfo: "Expert in cracking codes and flying drones.",
        icon: "💻"
    },
    {
        name: "Peter",
        role: "Chief Investigator",
        color: "#00ff99",
        description: "Has an eagle eye for details. Nothing escapes his magnifying glass.",
        detectiveInfo: "Found the missing cat using only a footprint and a candy wrapper.",
        icon: "🔍"
    },
    {
        name: "Charlie",
        role: "Team Leader",
        color: "#ff3366",
        description: "The fearless leader who rallies the team. Always has a plan B.",
        detectiveInfo: "Once outsmarted a raccoon to retrieve the stolen cookies.",
        icon: "🚀"
    },
];

export function meta() {
    return [
        { title: "The Adventure Squad - Squad Profiles" },
    ];
}

export default function SquadProfiles() {
    return (
        <div className="container">
            <h1 style={{ textAlign: "center", marginTop: "2rem" }}>Squad Profiles 🦸‍♀️🦸‍♂️</h1>
            <div className="card-grid">
                {characters.map(char => (
                    <div key={char.name} className="card" style={{
                        borderTop: `4px solid ${char.color}`,
                        boxShadow: `0 0 15px ${char.color}40`
                    }}>
                        <div style={{
                            fontSize: "3rem",
                            background: `linear-gradient(135deg, ${char.color}, #000)`,
                            width: "100px",
                            height: "100px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 1.5rem auto",
                            color: "white",
                            border: `2px solid ${char.color}`
                        }}>
                            {char.icon}
                        </div>
                        <h2>{char.name}</h2>
                        <h4 style={{ color: "#aaa", textTransform: "uppercase", fontSize: "0.9rem", letterSpacing: "1px" }}>{char.role}</h4>
                        <p style={{ fontStyle: "italic", margin: "1rem 0" }}>"{char.description}"</p>

                        <div style={{ background: "rgba(255,255,255,0.05)", padding: "1rem", borderRadius: "8px", marginTop: "1rem", borderLeft: `2px solid ${char.color}` }}>
                            <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc" }}><strong>📁 Detective Record:</strong><br />{char.detectiveInfo}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
