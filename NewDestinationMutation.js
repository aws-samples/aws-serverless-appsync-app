import gql from 'graphql-tag';

export default gql`
mutation addDestination($id: ID!, $description: String!, $city: String!, $state: String!, $zip: String!){
    addDestination(
      id: $id
      description: $description
      state: $state
      city: $city
      zip: $zip
    ){
      __typename
      id
      description
      state
      conditions{
        description
          __typename
        maxTemp
        minTemp
        current
          }
    }
  }`;