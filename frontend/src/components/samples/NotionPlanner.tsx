import { Alert, Button, Input } from "antd";
import { useCallback, useState } from "react";

export default function BackendStatusChecker() {
    const [database, setDatabase] = useState("1bd18ec17cf84683bc2eb71c4fb233d7");
    const [calendar, setCalendar] = useState("0ed9a0d3c83f4b6abf23c87cfa26ed0c");
    const [output, setOutput] = useState("");

    const trigger = useCallback(async () => {
        try {
            setOutput("Planning...");
            const resp = await fetch(new URL("http://localhost:3003/sample/notion_plan"), {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    database_id: database,
                    calendar_id: calendar,
                }),
            });
            setOutput("Planned: " + JSON.stringify(await resp.json()));
        } catch (e) {
            setOutput("Failed! " + e);
        }
    }, [database, calendar, setOutput]);

    return (
        <>
            Database ID:
            <Input value={database} onChange={(e) => setDatabase(e.target.value)} />
            Calendar ID:
            <Input value={calendar} onChange={(e) => setCalendar(e.target.value)} />
            <Button type="primary" onClick={trigger}>
                Plan!
            </Button>
            <Alert message="Plan Output" description={output} />
        </>
    );
}
