import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("story", "routes/story.tsx"),
    route("music", "routes/music.tsx"),
    route("squad-profiles", "routes/squad-profiles.tsx"),
    route("create-story", "routes/create-story.tsx"),
    route("game", "routes/game.tsx")
] satisfies RouteConfig;
