export const uploadIpfs = async <T>(data: T) => {
    const file = new File([JSON.stringify(data)], "metadata.json", { type: "application/json" });

    const response = await fetch("https://api.web3.storage/upload", {
        method: "POST",
        body: file,
        headers: {
            Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEFlOGM2M2I1RkE4RUQ2RjNCN2Y1QzMzMDQ4ODYxNzcyNmNEN2M2Y0YiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Njc3MTgwOTI5OTYsIm5hbWUiOiJoYWNha3Rob24ifQ.gPD-iUQqNKg5iLkXksxD9o02VeeCzOANs4z6pRO7WT4"}`,
        },
    });
    const result = await response.json();
    const cid = result["cid"];

    console.log("stored files with cid:", cid);

    return {
        path: cid,
    };
};
