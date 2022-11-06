import { Button, Input, Progress, Space } from "antd";
import { useCallback, useState } from "react";
import LensPusher from "./helpers/lens_pusher";
import NotionPuller from "./helpers/notion_puller";

export const Decentralizer: React.FC<{
    walletAddress: string;
    activeProfile: string;
}> = ({ walletAddress, activeProfile }) => {
    const [notionApiKey, setNotionApiKey] = useState<string | undefined>(
        "secret_ThyBFJOGvfg9verCNa3So5dK3e8eGeZ5030j05XsWjn"
    );
    const [notionPageId, setNotionPageId] = useState<string | undefined>("de32e778309648648c27fef0e74e3d4a");
    const [livepeerApiKey, setLivepeerApiKey] = useState<string | undefined>("todo");
    const [completion, setCompletion] = useState<number | undefined>();

    const progress = useCallback((done: number, total: number) => {
        setCompletion(done / total);
    }, []);

    const decentralize = useCallback(async () => {
        if (notionApiKey && notionPageId && livepeerApiKey) {
            const puller = new NotionPuller(notionApiKey);
            const pusher = new LensPusher(activeProfile);
            await pusher.push(await puller.pull(notionPageId), progress);
            setCompletion(undefined);
        }
    }, [notionApiKey, notionPageId, livepeerApiKey, walletAddress, activeProfile]);

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
