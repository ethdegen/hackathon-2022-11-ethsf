import { createPostImage, createPostText } from "../../lens/helpers/publications/post-gasless";
import { NotionPull } from "./notion_puller";

export default class LensPusher {
    private readonly activeProfile: string;

    constructor(activeProfile: string) {
        this.activeProfile = activeProfile;
    }

    public async push(pull: NotionPull, progress?: (done: number, total: number) => void) {
        if (progress) {
            progress(0, pull.content.length);
        }
        for (let i = 0; i < pull.content.length; i++) {
            const post = pull.content[i];
            if (post.type === "paragraph") {
                const content = Array.isArray(post.url) ? post.url.join("\n") : post.url;
                await createPostText(this.activeProfile, i.toString(), content);
            } else if (post.type === "image") {
                const url = Array.isArray(post.url) ? post.url[0] : post.url;
                await createPostImage(this.activeProfile, i.toString(), url);
            } else if (post.type === "video") {
                const url = Array.isArray(post.url) ? post.url[0] : post.url;
                await createPostImage(this.activeProfile, i.toString(), url);
            }
            if (progress) {
                progress(i + 1, pull.content.length);
            }
        }
    }
}
