import { apolloClient } from "../apollo-client";
import { DefaultProfileDocument, DefaultProfileRequest } from "../graphql/generated";

const getDefaultProfileRequest = async (request: DefaultProfileRequest) => {
    const result = await apolloClient.query({
        query: DefaultProfileDocument,
        variables: {
            request,
        },
    });

    return result.data.defaultProfile;
};

export const getDefaultProfile = async (ethereumAddress: string) => {
    console.log("get default profile: address", ethereumAddress);

    const result = await getDefaultProfileRequest({ ethereumAddress });
    console.log("profiles: result", result);

    return result;
};
