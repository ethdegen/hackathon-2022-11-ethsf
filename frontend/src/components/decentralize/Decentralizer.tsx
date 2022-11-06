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
    const [pendingJob, setPendingJob] = useState<string | undefined>();
    const [notionPull, setNotionPull] = useState<NotionPull | undefined>();

    const progress = useCallback((done: number, total: number) => {
        setCompletion(done / total);
    }, []);

    const completer = useCallback(
        () => async () => {
            if (!pendingJob || !notionApiKey) {
                return;
            }
            const puller = new NotionPuller(notionApiKey);
            const pull = await puller.complete(pendingJob);
            if (pull.success) {
                setPendingJob(undefined);
                setNotionPull(pull);
            } else {
                setTimeout(completer, 1000);
            }
        },
        [pendingJob, notionApiKey]
    );

    const decentralize = useCallback(async () => {
        if (notionApiKey && notionPageId && livepeerApiKey) {
            const puller = new NotionPuller(notionApiKey);
            setPendingJob((await puller.pull(notionPageId)).job_id);
            setTimeout(completer, 1000);
        }
    }, [notionApiKey, notionPageId, livepeerApiKey, walletAddress]);

    useEffect(() => {
        const effect = async () => {
            if (pendingJob === undefined && notionPull) {
                const pusher = new LensPusher(activeProfile);
                await pusher.push(notionPull, progress);
                setCompletion(undefined);
            }
        };

        effect();
    }, [pendingJob, notionPull, activeProfile]);

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
