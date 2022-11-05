import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { challenge } from "./helpers/api";
import { apolloClient } from "./helpers/apollo-client";

const ethereum = (window as any).ethereum;

export const LoginBrowser: React.FC<{
    challengeSigned: (address: string, signature: string) => Promise<void>;
}> = ({ challengeSigned }) => {
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
    const [address, setAddress] = useState<string | null>(null);

    useEffect(() => {
        async function effect() {
            try {
                setProvider(new ethers.providers.Web3Provider(ethereum));
            } catch (err) {
                // no provider
            }
        }
        effect();
    }, []);

    const connect = useCallback(async () => {
        if (provider) {
            await ethereum.request({ method: "eth_requestAccounts" });
            setAddress(await provider.getSigner().getAddress());
        }
    }, [provider]);

    const login = useCallback(async () => {
        if (provider && address) {
            try {
                const challengeInfo = await apolloClient.query({
                    query: challenge,
                    variables: { address },
                });
                const signer = provider.getSigner();
                challengeSigned(address, await signer.signMessage(challengeInfo.data.challenge.text));
            } catch (err) {
                // error signing in
            }
        }
    }, [provider, address, challengeSigned]);

    return (
        <div>
            {!provider && <div>Please install a browser-based wallet extension</div>}
            {provider && !address && <button onClick={connect}>Connect browser-based wallet</button>}
            {provider && address && <button onClick={login}>Login with browser-based wallet</button>}
        </div>
    );
};
