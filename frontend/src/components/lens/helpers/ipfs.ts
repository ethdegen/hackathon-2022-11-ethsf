// not actually IPFS right now for hackathon purposes but it will be in future !!!
// right now this method is a really stupid placeholder...
// we'll definitely absoltutely put all metadata onto IPFS in production !!!
export const uploadIpfs = async <T>(data: T) => {
    const response = await fetch("https://api.jsonbin.io/v3/b", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "X-Master-Key": "$2b$10$I7Jeee1lIgdFljvfqipY.O.jeAmx7QiqERUZGlCF/5UdI9Sbl42E6",
            "X-Bin-Private": "false",
        },
    });

    const result = (await response.json()) as { metadata: { id: string } };
    console.log(JSON.stringify(result));
    return {
        path: `api.jsonbin.io/v3/b/${result.metadata.id}?meta=false`,
    };
};
