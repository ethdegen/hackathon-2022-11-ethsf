import { Alert, Button } from "antd";
import { useCallback, useState } from "react";
import { createPostGasless } from "./helpers/publications/post-gasless";

export const Poster: React.FC<{
    walletAddress: string;
    activeProfile: string;
}> = ({ walletAddress, activeProfile }) => {
    const [content, setContent] = useState<string | null>(null);

    const post = useCallback(async () => {
        try {
            await createPostGasless(
                walletAddress,
                activeProfile,
                "ipfs://QmQqzMTavQgT4f4T5v6PWBp7XNKtoPmC9jvn12WPT3gkSE"
            );
            setContent("OK");
        } catch (e) {
            setContent(`Not OK: ${e}`);
        }
    }, [walletAddress, activeProfile]);

    return (
        <>
            <Button type="primary" onClick={post}>
                Create Post
            </Button>
            <Alert message="Post Creation" description={content} />
        </>
    );
};
