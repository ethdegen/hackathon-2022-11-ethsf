import { apolloClient } from "../apollo-client";
import { ProfileQueryRequest, ProfilesDocument } from "../graphql/generated";

const getProfilesRequest = async (request: ProfileQueryRequest) => {
    const result = await apolloClient.query({
        query: ProfilesDocument,
        variables: {
            request,
        },
    });

    return result.data.profiles;
};

export const profiles = async (address: string) => {
    console.log("profiles: address", address);

    const profilesOwned = await getProfilesRequest({ ownedBy: [address] });

    console.log("profiles: result", profilesOwned);

    return profilesOwned;
};
