import { Button, Input, Progress, Space } from "antd";
import { useCallback, useEffect, useState } from "react";
import LensPusher from "./helpers/lens_pusher";
import NotionPuller, { NotionPull } from "./helpers/notion_puller";

export const Decentralizer: React.FC<{
    walletAddress: string;
    activeProfile: string;
}> = ({ walletAddress, activeProfile }) => {
    const [notionApiKey, setNotionApiKey] = useState<string | undefined>(
        "secret_ThyBFJOGvfg9verCNa3So5dK3e8eGeZ5030j05XsWjn"
    );
    const [notionPageId, setNotionPageId] = useState<string | undefined>("de32e778309648648c27fef0e74e3d4a");
    const [livepeerApiKey, setLivepeerApiKey] = useState<string | undefined>("8e39b76d-8a23-417c-bb64-e31e94d9796a");
    const [completion, setCompletion] = useState<number | undefined>();
    const [notionPull, setNotionPull] = useState<NotionPull | undefined>();

    const progress = useCallback((done: number, total: number) => {
        setCompletion(done / total);
    }, []);

    const completer = useCallback(
        async (jobId: string) => {
            if (!notionApiKey || !livepeerApiKey) {
                return;
            }
            const puller = new NotionPuller(notionApiKey, livepeerApiKey);
            const pull = await puller.complete(jobId);
            if (pull.success) {
                setNotionPull(pull);
            } else {
                setTimeout(() => completer(jobId), 2000);
            }
        },
        [notionApiKey, livepeerApiKey]
    );

    const decentralize = useCallback(async () => {
        if (notionApiKey && notionPageId && livepeerApiKey) {
            const puller = new NotionPuller(notionApiKey, livepeerApiKey);
            const jobId = (await puller.pull(notionPageId)).content.job_id;
            console.log("!!!!! " + jobId);
            setTimeout(() => completer(jobId), 4000);
        }
    }, [notionApiKey, notionPageId, livepeerApiKey, completer]);

    useEffect(() => {
        const effect = async () => {
            if (notionPull && completion === undefined) {
                const pusher = new LensPusher(activeProfile);
                await pusher.push(notionPull, progress);
                setCompletion(undefined);
                setNotionPull(undefined);
            }
        };

        effect();
    }, [notionPull, activeProfile, progress, completion]);

    return (
        <Space direction="vertical">
            <div>Social Media Decentralizer</div>
            Notion API key:
            <Input value={notionApiKey} onChange={(e) => setNotionApiKey(e.target.value)} />
            Notion Page ID:
            <Input value={notionPageId} onChange={(e) => setNotionPageId(e.target.value)} />
            LivePeer API key:
            <Input value={livepeerApiKey} onChange={(e) => setLivepeerApiKey(e.target.value)} />
            {completion === undefined && (
                <Button type="primary" onClick={decentralize}>
                    Decentralize My Social Media
                </Button>
            )}
            {completion !== undefined && (
                <div>
                    Decentralizing: <Progress percent={completion * 100} />
                </div>
            )}
        </Space>
    );
};
