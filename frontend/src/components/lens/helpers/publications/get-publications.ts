import { apolloClient } from "../apollo-client";
import { PublicationsDocument, PublicationsQueryRequest, PublicationTypes } from "../graphql/generated";

const getPublicationsRequest = async (request: PublicationsQueryRequest) => {
    const result = await apolloClient.query({
        query: PublicationsDocument,
        variables: {
            request,
        },
    });

    return result.data.publications;
};

export const getPublications = async (profileId: string) => {
    return await getPublicationsRequest({
        profileId,
        publicationTypes: [PublicationTypes.Post, PublicationTypes.Comment, PublicationTypes.Mirror],
    });
};
