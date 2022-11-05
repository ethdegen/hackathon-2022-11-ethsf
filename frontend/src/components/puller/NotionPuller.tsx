import { Alert, Button } from "antd";
import { useCallback, useState } from "react";
import PullerClient from "./helpers/client";

export default function NotionPuller() {
    const [result, setResult] = useState<string | undefined>();

    const checkStatus = useCallback(async () => {
        setResult(await PullerClient.gogogo());
    }, []);

    return (
        <>
            <Button type="primary" onClick={checkStatus}>
                Notion Puller
            </Button>
            <Alert message="GoGoGo" description={result} />
        </>
    );
}
