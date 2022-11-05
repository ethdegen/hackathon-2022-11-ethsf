import GoogleMapReact from "google-map-react";

const Overlay = ({ text }: { lat: number; lng: number; text: string }) => (
    <div
        style={{
            color: "white",
            background: "grey",
            padding: "15px 10px",
            display: "inline-flex",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "100%",
            transform: "translate(-50%, -50%)",
        }}
    >
        {text}
    </div>
);

export default function OverlainMap() {
    const defaultProps = {
        center: {
            lat: 10.99835602,
            lng: 77.01502627,
        },
        zoom: 11,
    };

    return (
        // Important! Always set the container height explicitly
        <div style={{ height: "100vh", width: "100%" }}>
            <GoogleMapReact
                // bootstrapURLKeys={{ key: "" }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
            >
                <Overlay lat={59.955413} lng={30.337844} text={"Yeehah!"} />
            </GoogleMapReact>
        </div>
    );
}
