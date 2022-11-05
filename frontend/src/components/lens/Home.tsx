import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { authenticate, challenge } from "./api";
import { apolloClient } from "./apollo-client";

const ethereum = (window as any).ethereum;

export default function Home() {
    /* local state variables to hold user's address and access token */
    const [address, setAddress] = useState<string | undefined>();
    const [token, setToken] = useState<string | undefined>();
    useEffect(() => {
        /* when the app loads, check to see if the user has already connected their wallet */
        checkConnection();
    }, []);
    async function checkConnection() {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length) {
            setAddress(accounts[0]);
        }
    }
    async function connect() {
        /* this allows the user to connect their wallet */
        const account = await ethereum.request({ method: "eth_requestAccounts" });
        if (account.result.length) {
            setAddress(account.result[0]);
        }
    }
    async function login() {
        try {
            /* first request the challenge from the API server */
            const challengeInfo = await apolloClient.query({
                query: challenge,
                variables: { address },
            });
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            /* ask the user to sign a message with the challenge info returned from the server */
            const signature = await signer.signMessage(challengeInfo.data.challenge.text);
            /* authenticate the user */
            const authData = await apolloClient.mutate({
                mutation: authenticate,
                variables: {
                    address,
                    signature,
                },
            });
            /* if user authentication is successful, you will receive an accessToken and refreshToken */
            const {
                data: {
                    authenticate: { accessToken },
                },
            } = authData;
            console.log({ accessToken });
            setToken(accessToken);
        } catch (err) {
            console.log("Error signing in: ", err);
        }
    }

    return (
        <div>
            {/* if the user has not yet connected their wallet, show a connect button */}
            {!address && <button onClick={connect}>Connect</button>}
            {/* if the user has connected their wallet but has not yet authenticated, show them a login button */}
            {address && !token && (
                <div onClick={login}>
                    <button>Login</button>
                </div>
            )}
            {/* once the user has authenticated, show them a success message */}
            {address && token && <h2>Successfully signed in!</h2>}
        </div>
    );
}
