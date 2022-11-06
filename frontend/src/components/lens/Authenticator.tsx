import React, { useCallback, useEffect, useState } from "react";
import { authenticate } from "./helpers/api";
import { apolloClient, setAuthentication } from "./helpers/apollo-client";
import { createProfile } from "./helpers/profile/create-profile";
import { profiles } from "./helpers/profile/get-profiles";

type LoginComponent = React.FC<{
    challengeSigned: (address: string, signature: string) => Promise<void>;
}>;

type BusinessComponent = React.FC<{
    walletAddress: string;
    activeProfile: string;
}>;

export const Authenticator: React.FC<{ Login: LoginComponent; Business: BusinessComponent }> = ({
    Login,
    Business,
}) => {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [activeProfile, setActiveProfile] = useState<string | null>(null);

    const challengeSigned = useCallback(async (address: string, signature: string) => {
        const {
            data: {
                authenticate: { accessToken },
            },
        } = await apolloClient.mutate({
            mutation: authenticate,
            variables: {
                address,
                signature,
            },
        });
        setAuthentication(accessToken);
        setWalletAddress(address);
    }, []);

    useEffect(() => {
        const effect = async () => {
            if (walletAddress && !activeProfile) {
                let profs = await profiles(walletAddress);
                while (!profs.items.length) {
                    await createProfile(walletAddress);
                    profs = await profiles(walletAddress);
                    console.log(`Profiles: ${JSON.stringify(profs.items)}`);
                }
                setActiveProfile(profs.items[0].id);
            }
        };

        effect();
    }, [walletAddress, activeProfile]);

    return (
        <>
            {walletAddress && activeProfile && <Business walletAddress={walletAddress} activeProfile={activeProfile} />}
            {!walletAddress && <Login challengeSigned={challengeSigned} />}
        </>
    );
};
