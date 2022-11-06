export type NotionPending = {
    job_id: string;
};

export type NotionPull = {
    content: { type: string; url: string | string[] }[];
    success: boolean;
};

export default class NotionPuller {
    private readonly apiKey: string;
    private readonly livepeerApiKey: string;

    constructor(apiKey: string, livepeerApiKey: string) {
        this.apiKey = apiKey;
        this.livepeerApiKey = livepeerApiKey;
    }

    public async pull(pageId: string): Promise<NotionPending> {
        return (
            await fetch(
                `http://localhost:3003/notion/pull?api_key=${encodeURI(this.apiKey)}&page_id=${encodeURI(
                    pageId
                )}&livepeer_api_key=${encodeURI(this.livepeerApiKey)}`
            )
        ).json();
    }

    public async complete(jobId: string): Promise<NotionPull> {
        return (await fetch(`http://localhost:3003/notion/complete?id=${encodeURI(jobId)}`)).json();
    }
}
