import { Space } from "antd";
import { Authenticator } from "./components/lens/Authenticator";
import { LoginBrowser } from "./components/lens/LoginBrowser";
import { Poster } from "./components/lens/Poster";
import { PublicationsDisplay } from "./components/lens/PublicationsDisplay";
import NotionPuller from "./components/puller/NotionPuller";

export default function App() {
    return (
        <Space direction="vertical">
            <NotionPuller />
            <PublicationsDisplay />
            <Authenticator Login={LoginBrowser} Business={Poster} />
        </Space>
    );
}
