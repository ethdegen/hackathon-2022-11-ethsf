import { Player, useAsset, useAssetMetrics, useCreateAsset } from "@livepeer/react";
import { Space, Spin } from "antd";
import Badge from "antd/lib/badge";
import Button from "antd/lib/button";

import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";

export const CreateAndViewAsset = () => {
    const [video, setVideo] = useState<File | undefined>();
    const {
        mutate: createAsset,
        data: createdAsset,
        status: createStatus,
        error: createError,
        uploadProgress,
    } = useCreateAsset();
    const { data: asset, status: assetStatus } = useAsset({
        assetId: createdAsset?.id,
        refetchInterval: (asset) => (asset?.status?.phase !== "ready" ? 5000 : false),
    });
    const { data: metrics } = useAssetMetrics({
        assetId: createdAsset?.id,
        refetchInterval: 30000,
    });

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0 && acceptedFiles?.[0]) {
            setVideo(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            "video/*": ["*.mp4"],
        },
        maxFiles: 1,
        onDrop,
    });

    // we check here for either creating the asset, or polling for the asset
    // until the video is in the ready phase and can be consumed
    const isLoading = useMemo(
        () => createStatus === "loading" || assetStatus === "loading" || (asset && asset?.status?.phase !== "ready"),
        [createStatus, asset, assetStatus]
    );

    const progressFormatted = useMemo(
        () =>
            uploadProgress
                ? `Uploading: ${Math.round(uploadProgress * 100)}%`
                : asset?.status?.progress
                ? `Processing: ${Math.round(asset?.status?.progress * 100)}%`
                : null,
        [uploadProgress, asset?.status?.progress]
    );

    return (
        <>
            {!asset?.playbackId && (
                <Space direction="vertical" {...getRootProps()}>
                    <input type="text" {...getInputProps()} />
                    <p>
                        <span>Drag and drop or browse files</span>
                    </p>

                    {createError?.message && <span>{createError.message}</span>}

                    {video ? <Badge>{video.name}</Badge> : <span>Select a video file to upload.</span>}
                    {progressFormatted && <span>{progressFormatted}</span>}

                    <Button
                        onClick={() => {
                            if (video) {
                                createAsset({ name: video.name, file: video });
                            }
                        }}
                        disabled={!video || isLoading || Boolean(asset)}
                    >
                        {isLoading && <Spin />}
                        Upload
                    </Button>
                </Space>
            )}

            {asset?.playbackId && <Player playbackId={asset?.playbackId} />}

            {metrics?.metrics?.[0] && <Badge>Views: {metrics?.metrics?.[0]?.startViews}</Badge>}
        </>
    );
};
