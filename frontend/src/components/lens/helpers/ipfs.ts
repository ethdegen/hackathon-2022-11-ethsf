export const uploadIpfs = async <T>(data: T) => {
    const response = await fetch("https://api.web3.storage/upload", {
        method: "POST",
        body: new File([JSON.stringify(data)], "metadata.json", { type: "application/json" }),
        headers: {
            Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEFlOGM2M2I1RkE4RUQ2RjNCN2Y1QzMzMDQ4ODYxNzcyNmNEN2M2Y0YiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Njc3MTgwOTI5OTYsIm5hbWUiOiJoYWNha3Rob24ifQ.gPD-iUQqNKg5iLkXksxD9o02VeeCzOANs4z6pRO7WT4"}`,
        },
    });
    const result = await response.json();
    const cid = result["cid"];
    console.log("stored files with cid:", cid);
    return `ipfs://${cid}`;

    // Quick version below for demo purposes

    // const response = await fetch("https://api.jsonbin.io/v3/b", {
    //     method: "POST",
    //     body: JSON.stringify(data),
    //     headers: {
    //         "Content-Type": "application/json",
    //         "X-Master-Key": "$2b$10$I7Jeee1lIgdFljvfqipY.O.jeAmx7QiqERUZGlCF/5UdI9Sbl42E6",
    //         "X-Bin-Private": "false",
    //     },
    // });

    // const result = (await response.json()) as { metadata: { id: string } };
    // const mid = result.metadata.id;
    // console.log("stored files with id:", mid);
    // return `https://api.jsonbin.io/v3/b/${mid}?meta=false`;
};
