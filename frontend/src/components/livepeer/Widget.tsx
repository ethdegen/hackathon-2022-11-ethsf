import { createReactClient, LivepeerConfig, studioProvider } from "@livepeer/react";
import { CreateAndViewAsset } from "./CreateAndViewAsset";

const livepeerClient = createReactClient({
    provider: studioProvider(),
});

// Pass client to React Context Provider

export default function Widget() {
    return (
        <LivepeerConfig client={livepeerClient}>
            <CreateAndViewAsset />
        </LivepeerConfig>
    );
}
