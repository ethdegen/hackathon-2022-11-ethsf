import { Alert, Button } from "antd";
import { useCallback, useState } from "react";
import { createPostImage, createPostText, createPostVideo } from "./helpers/publications/post-gasless";

export const Poster: React.FC<{
    walletAddress: string;
    activeProfile: string;
}> = ({ walletAddress, activeProfile }) => {
    const [content, setContent] = useState<string | null>(null);

    const post = useCallback(async () => {
        try {
            await createPostText(activeProfile, "text", "The quick brown fox jumps over the lazy dog.");
            await createPostImage(
                activeProfile,
                "image",
                "https://i1.wp.com/www.theclothparcel.com/wp-content/uploads/we-made-it-button.jpg"
            );
            await createPostVideo(activeProfile, "image", "https://samplelib.com/lib/preview/mp4/sample-5s.mp4");
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
