import { Button, Input, Progress, Space, Spin } from "antd";
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
    const [livepeerApiKey, setLivepeerApiKey] = useState<string | undefined>("8e39b76d-8a23-417c-bb64-e31e94d9796a");
    const [completion, setCompletion] = useState<number | undefined>();
    const [content, setContent] = useState<{ type: string; url: string | string[] }[] | undefined>();
    const [pulling, setPulling] = useState<boolean>(false);

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
                setPulling(false);
                setContent(pull.content);
            } else {
                setTimeout(() => completer(jobId), 2000);
            }
        },
        [notionApiKey, livepeerApiKey]
    );

    const prepare = useCallback(async () => {
        if (notionApiKey && notionPageId && livepeerApiKey) {
            const puller = new NotionPuller(notionApiKey, livepeerApiKey);
            const content = (await puller.pull(notionPageId)).content;
            const jobId = content.job_id;
            // setContent(content.preview);
            setPulling(true);
            setTimeout(() => completer(jobId), 4000);
        }
    }, [notionApiKey, notionPageId, livepeerApiKey, completer]);

    const dencentralize = useCallback(async () => {
        if (content && completion === undefined) {
            const pusher = new LensPusher(activeProfile);
            await pusher.push(content, progress);
            setContent(undefined);
        }
    }, [content, completion, progress, activeProfile]);

    return (
        <Space direction="vertical">
            Notion API key:
            <Input
                value={notionApiKey}
                onChange={(e) => {
                    setNotionApiKey(e.target.value);
                    setCompletion(undefined);
                }}
            />
            Notion Page ID:
            <Input
                value={notionPageId}
                onChange={(e) => {
                    setNotionPageId(e.target.value);
                    setCompletion(undefined);
                }}
            />
            LivePeer API key:
            <Input
                value={livepeerApiKey}
                onChange={(e) => {
                    setLivepeerApiKey(e.target.value);
                    setCompletion(undefined);
                }}
            />
            {completion === undefined && !pulling && !content && (
                <Button type="primary" onClick={prepare}>
                    Prepare My Social Media for Decentralization
                </Button>
            )}
            {completion === undefined && pulling && (
                <div>
                    Preparing: <Spin />
                </div>
            )}
            {completion === undefined && content && (
                <Button type="primary" onClick={dencentralize}>
                    Decentralize My Social Media
                </Button>
            )}
            {completion !== undefined && (
                <div>
                    {completion < 1 ? "Decentralizing" : "Decentralized"}: <Progress percent={completion * 100} />
                </div>
            )}
        </Space>
    );
};
