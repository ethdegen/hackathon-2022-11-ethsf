import { gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import { apolloClient } from './apollo-client';

const query = `query($request: ChallengeRequest!) {
  challenge(request: $request) {
        text
    }
  }
`

export const DisplayAddress = () => {
 
    const [addressContent, setAddressContent] = useState<string | null>(null)

    useEffect(() => {
        const queryExample = async () => {
            const result = await apolloClient.query({
                query: gql(query),
                variables: {
                  request: {
                     address: "0xdfd7D26fd33473F475b57556118F8251464a24eb"
                  },
                },
              })

            setAddressContent(result.data.challenge.text)
        }

        queryExample()
    }, []
    )

    return <>{addressContent && <div>{addressContent}</div>}</>;
};
