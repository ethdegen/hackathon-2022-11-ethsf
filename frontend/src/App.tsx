import { Space } from "antd";
import HealthCheck from "./components/HealthCheck";

function App() {
    return (
        <div className="App" style={{ margin: "24px" }}>
            {/* <Space>
                <OverlainMap />
            </Space>
            <Divider /> */}
            <Space>
                <HealthCheck />
            </Space>
        </div>
    );
}

export default App;
