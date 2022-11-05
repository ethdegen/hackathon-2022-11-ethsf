import { createReactClient, LivepeerConfig, studioProvider } from "@livepeer/react";
import { CreateAndViewAsset } from "./components/livepeer/CreateAndViewAsset";

const livepeerClient = createReactClient({
    provider: studioProvider(),
});

// Pass client to React Context Provider
export default function App() {
    return (
        <LivepeerConfig client={livepeerClient}>
            <CreateAndViewAsset />
        </LivepeerConfig>
    );
}
