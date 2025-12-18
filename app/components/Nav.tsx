import { NavLink } from "react-router";

export default function Nav() {
    return (
        <nav>
            <div className="container">
                <NavLink to="/" className="logo">
                    The Adventure Squad ⚡
                </NavLink>
                <div className="nav-links">
                    <NavLink to="/" end>Home</NavLink>
                    <NavLink to="/story">Story</NavLink>
                    <NavLink to="/music">Music</NavLink>
                    <NavLink to="/squad-profiles">Squad Profiles</NavLink>
                    <NavLink to="/game">Game</NavLink>
                    <NavLink to="/create-story">Create</NavLink>
                </div>
            </div>
        </nav>
    );
}
