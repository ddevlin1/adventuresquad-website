const characters = [
    { name: "Captain Red", power: "Super Shield", color: "#ff4757", description: "The brave leader who is afraid of spiders!", icon: "🛡️" },
    { name: "Blue Bolt", power: "Lightning Speed", color: "#0984e3", description: "Fastest kid in town, but always untied shoelaces.", icon: "⚡" },
    { name: "Mighty Max", power: "Super Strength", color: "#2ed573", description: "Can lift a whole couch (if he eats his broccoli)!", icon: "💪" },
    { name: "Professor Gizmo", power: "Smart Inventions", color: "#ffa502", description: "Builds cool gadgets that sometimes explode (oops).", icon: "🔧" },
];

export function meta() {
    return [
        { title: "The Adventure Squad - Characters" },
    ];
}

export default function Characters() {
    return (
        <div className="container">
            <h1 style={{ textAlign: "center", marginTop: "2rem" }}>Meet the Squad 🦸‍♀️🦸‍♂️</h1>
            <div className="card-grid">
                {characters.map(char => (
                    <div key={char.name} className="card" style={{ borderTop: `10px solid ${char.color}` }}>
                        <div style={{ fontSize: "3rem", background: char.color, width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem auto", color: "white" }}>
                            {char.icon}
                        </div>
                        <h2>{char.name}</h2>
                        <p><strong>Power:</strong> {char.power}</p>
                        <p>{char.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
