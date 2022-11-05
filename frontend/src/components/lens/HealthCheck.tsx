import { Alert, Button } from "antd";
import { useCallback, useState } from "react";

export default function HealthCheck() {
    const [status, setStatus] = useState("");

    const checkStatus = useCallback(async () => {
        try {
            const resp = await fetch(new URL("http://localhost:3003/healthz"));
            const body = await resp.json();
            setStatus(body["status"].toString() ? "OK" : "Not OK");
        } catch (e) {
            setStatus(`Not OK: ${e}`);
        }
    }, []);

    return (
        <>
            <Button type="primary" onClick={checkStatus}>
                Check Health (Backend)
            </Button>
            <Alert message="Backend" description={status} />
        </>
    );
}
