export type NotionPending = {
    job_id: string;
};

export type NotionPull = {
    content: { type: string; url: string | string[] }[];
    success: boolean;
};

export default class NotionPuller {
    private readonly apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    public async pull(pageId: string): Promise<NotionPending> {
        return (
            await fetch(
                `http://localhost:3003/notion/pull?api_key=${encodeURI(this.apiKey)}&page_id=${encodeURI(pageId)}`
            )
        ).json();
    }

    public async complete(jobId: string): Promise<NotionPull> {
        return (await fetch(`http://localhost:3003/notion/complete?id=${encodeURI(jobId)}`)).json();
    }
}
