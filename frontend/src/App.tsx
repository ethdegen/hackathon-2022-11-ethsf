import { createReactClient, studioProvider } from "@livepeer/react";
import { LoginPrompt } from "./components/lens/LoginPrompt";

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
        <LoginPrompt />
    );
}
