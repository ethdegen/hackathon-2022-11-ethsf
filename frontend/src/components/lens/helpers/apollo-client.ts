import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const LOCAL_STORAGE_LENS_ACCESS_TOKEN = "lens-access-token";

const APIURL = "https://api-mumbai.lens.dev/";

const authLink = setContext((_, { headers }) => {
    const token = window.localStorage.getItem(LOCAL_STORAGE_LENS_ACCESS_TOKEN);

    if (!token) {
        return headers;
    }

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

const httpLink = createHttpLink({
    uri: APIURL,
});

export const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export function getAuthentication(): string | null {
    return window.localStorage.getItem(LOCAL_STORAGE_LENS_ACCESS_TOKEN);
}

export function setAuthentication(token: string) {
    window.localStorage.setItem(LOCAL_STORAGE_LENS_ACCESS_TOKEN, token);
}
