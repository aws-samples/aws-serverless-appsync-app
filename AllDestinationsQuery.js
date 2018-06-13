import gql from 'graphql-tag'

export default gql`
query getAllDestinations{
    getAllDestinations {
      id
      description
      state
      conditions {
        description
        current
        maxTemp
        minTemp
      }
    }
  }`;