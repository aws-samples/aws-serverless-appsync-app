import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import "semantic-ui-css/semantic.min.css";

import AllDestinations from "./Components/AllDestinations";
import AddDestination from "./Components/AddDestination";
import NewDestinationsSubscription from './Queries/NewDestinationsSubscription';

import AWSAppSyncClient from "aws-appsync";
import { Rehydrated } from 'aws-appsync-react';
import { AUTH_TYPE } from "aws-appsync/lib/link/auth-link";
import { graphql, ApolloProvider, compose } from 'react-apollo';
import * as AWS from 'aws-sdk';
import AppSync from './aws-exports.js';
import AllDestinationsQuery from './Queries/AllDestinationsQuery';
import NewDestinationMutation from './Queries/NewDestinationMutation';

const client = new AWSAppSyncClient({
  url: AppSync.aws_appsync_graphqlEndpoint,
  region: AppSync.aws_appsync_region,
  auth: {
      type: AUTH_TYPE.API_KEY,
      apiKey: AppSync.aws_appsync_apiKey,

      // type: AUTH_TYPE.AWS_IAM,
      // Note - Testing purposes only
      /*credentials: new AWS.Credentials({
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_SECRET_ACCESS_KEY
      })*/

      // Amazon Cognito Federated Identities using AWS Amplify
      //credentials: () => Auth.currentCredentials(),

      // Amazon Cognito user pools using AWS Amplify
      // type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
      // jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken(),
  },
  options: {
    fetchPolicy: 'cache-and-network'
  },
  disableOffline:false  
});


const appHeaderStyle = {
  marginBottom: '20px'
};

const headerStyle = {
  color: 'white',
  padding: '10px'
}

const Home = () => (
  
  <div>
    <header className="App-header" style={appHeaderStyle}>
      <h2 class="ui center aligned icon header">
        <img src="https://d1.awsstatic.com/serverless/Lambda%20Resources%20images/sam_acorn_shadow.8915b92ddd48a78d8c05d55ce4b26e472889c573.png" className="App-logo" alt="logo" />
        <span style={headerStyle}>Welcome to Serverless Bytes #3: Serverless Web App powered by AWS AppSync</span>
      </h2>
    </header>

    <div className="ui container">

      <h3 className="ui horizontal divider header">
        <i className="paper plane icon"></i>
          Travel Destinations and Current Conditions
      </h3>
      <AllDestinationsWithData />
      <h4 className="ui horizontal divider header">
          <i className="tag icon"></i>
          Create a destination
      </h4>
      <NewDestinationWithData />
    </div>
  </div>

);

const App = () => (
  <Router>
    <div>
      <Route exact={true} path="/" component={Home} />
    </div>
  </Router>
);

const AllDestinationsWithData = compose(
  graphql(AllDestinationsQuery, {
      options: {
          fetchPolicy: 'cache-and-network'
      },
      props: (props) => ({
        destinations: props.data.getAllDestinations,
        
        // START - NEW PROP :
        subscribeToDestinations: params => {
          props.data.subscribeToMore({
              document: NewDestinationsSubscription,
              updateQuery: (previousResult, { subscriptionData, variables }) => {
                // Perform updates on previousResult with subscriptionData
                console.log(previousResult);

                var newDestination = subscriptionData.data.newDestination;
                console.log (newDestination);

                const newObj = {};
                newObj.getAllDestinations = [newDestination, ...previousResult.getAllDestinations];
                console.log(newObj);
                
                return  newObj;
              }
              
              /*(prev, { subscriptionData: {data: {newDestination}} }) => ({
                ...prev,
                getAllDestinations: { getAllDestinations: [newDestination, prev.getAllDestinations.filter(d => d.id != newDestination.id)] , __typename: 'Destinations'}
              })*/
          });
        }
        // END - NEW PROP
        
      })
  })
  )(AllDestinations);

  const NewDestinationWithData = graphql(NewDestinationMutation, {
    props: (props) => ({
        onAdd: destination => props.mutate({
            variables: destination,
            optimisticResponse: () => ({ addDestination: { ...destination, __typename: 'Destination', version: 1 } }),
        })
    }),
    options: {
        //refetchQueries: [{ query: AllDestinationsQuery }],
        update: (dataProxy, { data: { addDestination } }) => {
            const query = AllDestinationsQuery;
            const data = dataProxy.readQuery({ query });

            data.getAllDestinations.destinations.push(addDestination);

            dataProxy.writeQuery({ query, data });
        },
        fetchPolicy: 'cache-and-network',
        disableOffline:false  
    }
  })(AddDestination);

  const WithProvider = () => (
    <ApolloProvider client={client}>
        <Rehydrated>
            <App />
        </Rehydrated>
    </ApolloProvider>
);

export default WithProvider;