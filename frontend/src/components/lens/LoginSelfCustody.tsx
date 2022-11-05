import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { authenticate, challenge } from "./helpers/api";
import { apolloClient, LOCAL_STORAGE_LENS_LOGIN_ACCESS_TOKEN } from "./helpers/apollo-client";

const ethereum = (window as any).ethereum;

export default function LoginSelfCustody() {
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | undefined>();
    const [address, setAddress] = useState<string | undefined>();
    const [token, setToken] = useState<string | undefined>();

    useEffect(() => {
        async function checkConnection() {
            if (token) {
                window.localStorage.setItem(LOCAL_STORAGE_LENS_LOGIN_ACCESS_TOKEN, token);
                return;
            }
            try {
                const provider = new ethers.providers.Web3Provider(ethereum);
                setProvider(provider);
                setAddress(await provider.getSigner().getAddress());
            } catch (err) {
                console.log("Error with Web3 provider: ", err);
            }
        }
        checkConnection();
    }, []);

    /* this allows the user to connect their wallet */
    async function connect() {
        if (provider) {
            setAddress(await provider.getSigner().getAddress());
        }
    }

    async function login() {
        try {
            if (provider) {
                /* first request the challenge from the API server */
                const challengeInfo = await apolloClient.query({
                    query: challenge,
                    variables: { address },
                });
                /* ask the user to sign a message with the challenge info returned from the server */
                const signer = provider.getSigner();
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
                setToken(accessToken);
                window.localStorage.setItem(LOCAL_STORAGE_LENS_LOGIN_ACCESS_TOKEN, accessToken);
            }
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
