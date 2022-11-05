import { generate } from "@ant-design/colors";
import { PageHeader, Tabs } from "antd";
import { Decentralizer } from "./components/decentralize/Decentralizer";
import { Authenticator } from "./components/lens/Authenticator";
import { LoginBrowser } from "./components/lens/LoginBrowser";
import { PublicationsDisplay } from "./components/lens/PublicationsDisplay";

const colors = generate("#1890ff", {
    theme: "dark",
    backgroundColor: "#141414",
});

export default function App() {
    const items = [
        { label: "Display Decentralized Social Media", key: "display", children: <PublicationsDisplay /> },
        {
            label: "Decentralize My Social Media !!",
            key: "decentralize",
            children: <Authenticator Login={LoginBrowser} Business={Decentralizer} />,
        },
    ];
    return (
        <div style={{ fontFamily: "Poppins" }}>
            <PageHeader
                title={"Social Media Decentralizer"}
                subTitle={"ETHSanFrancisco 2022"}
                avatar={{
                    src: "https://storage.googleapis.com/ethglobal-api-production/projects/qgvm9/images/icon.png",
                }}
            />

            <Tabs items={items} />
        </div>
    );
}
