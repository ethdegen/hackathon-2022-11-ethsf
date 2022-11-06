import { Button, Input, Layout, Menu, MenuProps } from "antd";
import { Content } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import { useCallback, useState } from "react";
import { MetadataOutput, PaginatedPublicationResult } from "./helpers/graphql/generated";
import { getPublications } from "./helpers/publications/get-publications";

export const PublicationsDisplay = () => {
    const [lensProfileId, setLensProfileId] = useState<string | undefined>("0x50e2");
    const [content, setContent] = useState<PaginatedPublicationResult | undefined>();
    const [active, setActive] = useState<MetadataOutput | undefined>();

    const display = useCallback(async () => {
        if (lensProfileId) {
            setContent(await getPublications(lensProfileId));
        }
    }, [lensProfileId]);

    type MenuItem = Required<MenuProps>["items"][number];

    function getItem(
        label: React.ReactNode,
        key: React.Key,
        onClick: (info: {
            key: string;
            keyPath: string[];
            domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
        }) => void
    ): MenuItem {
        return {
            key,
            label,
            onClick,
        } as MenuItem;
    }

    const items: MenuProps["items"] = content?.items.map((item, i) =>
        getItem(item.metadata.name, item.id, (item) => {
            setActive(content.items.find((i) => i.id == item.key)?.metadata);
        })
    );

    return (
        <>
            Lens Profile ID:
            <Input
                value={lensProfileId}
                onChange={(e) => {
                    setLensProfileId(e.target.value);
                    setContent(undefined);
                }}
            />
            {content === undefined && <Button onClick={display}>Display Publications</Button>}
            {content !== undefined && (
                <Layout style={{ flexDirection: "row" }}>
                    <Sider width={200}>
                        <Menu mode="inline" style={{ height: "100%", borderRight: 0 }} theme="dark" items={items} />
                    </Sider>
                    {active && (
                        <Content
                            style={{
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                            }}
                        >
                            {active.content && <span>{active.content}</span>}
                            {active.media[0]?.original.url && (
                                <iframe width={"100%"} height={"100%"} src={active.media[0].original.url} />
                            )}
                        </Content>
                    )}
                </Layout>
            )}
        </>
    );
};
