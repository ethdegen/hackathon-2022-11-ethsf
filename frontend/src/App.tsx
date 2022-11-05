import { createReactClient, studioProvider } from "@livepeer/react";
import Home from "./components/lens/Home";

const livepeerClient = createReactClient({
    provider: studioProvider(),
});

// Pass client to React Context Provider

export default function App() {
    return (
        // <LivepeerConfig client={livepeerClient}>
        //     <CreateAndViewAsset />
        // </LivepeerConfig>
        // <DisplayAddress />
        <Home />
    );
}
