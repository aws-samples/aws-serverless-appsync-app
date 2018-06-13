import gql from 'graphql-tag';

export default gql`
subscription NewDestinationSub {
    newDestination {
        __typename
        id
        description
        state
        conditions {
            __typename
            description
            current
            maxTemp
            minTemp 
        }
    }
}`;