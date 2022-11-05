export default class PullerClient {
    private readonly apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    public async getPage(pageId: string) {
        return (
            await fetch(
                `http://localhost:3003/notion/pull?api_key=${encodeURI(this.apiKey)}&page_id=${encodeURI(pageId)}`
            )
        ).json();
    }

    public static async gogogo(): Promise<string> {
        const tester = new PullerClient("secret_ThyBFJOGvfg9verCNa3So5dK3e8eGeZ5030j05XsWjn");
        return JSON.stringify(await tester.getPage("de32e778309648648c27fef0e74e3d4a"));
    }
}
