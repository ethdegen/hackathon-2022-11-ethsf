import { Alert, Button } from "antd";
import { useCallback, useState } from "react";
import { getPublications } from "./helpers/publications/get-publications";

export const PublicationsDisplay = () => {
    const [content, setContent] = useState<string | null>(null);

    const post = useCallback(async () => {
        try {
            const publications = await getPublications("0x50e2");
            setContent(JSON.stringify(publications));
        } catch (e) {
            setContent(`Not OK: ${e}`);
        }
    }, []);

    return (
        <>
            <Button type="primary" onClick={post}>
                Display Publications
            </Button>
            <Alert message="Publications" description={content} />
        </>
    );
};
