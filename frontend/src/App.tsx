import { Tabs } from "antd";
import { Decentralizer } from "./components/decentralize/Decentralizer";
import { Authenticator } from "./components/lens/Authenticator";
import { LoginBrowser } from "./components/lens/LoginBrowser";
import { PublicationsDisplay } from "./components/lens/PublicationsDisplay";

export default function App() {
    const items = [
        { label: "Display Decentralized Social Media", key: "display", children: <PublicationsDisplay /> },
        {
            label: "Decentralize My Social Media !!",
            key: "decentralize",
            children: <Authenticator Login={LoginBrowser} Business={Decentralizer} />,
        },
    ];
    return <Tabs items={items} />;
}
