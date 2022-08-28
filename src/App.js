import './App.css';
import React, { useContext, useState, createContext } from 'react'
import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider ,split} from '@apollo/client'
import {  BrowserRouter,Route } from "react-router-dom";
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import {setContext} from 'apollo-link-context'
import { AuthContext, AuthProvider } from './auth/auth';
import Login from './components/registration/login/login';
import Register from './components/registration/register/register';
import { CSSTransition } from 'react-transition-group'
import Middleware from './middleware/middleware';
import { SnackbarProvider } from 'notistack';
import RoomProvider from './reducer/chatRoomReducer'
import MyToolbar from './components/toolbar/toolbar';

const routes = [
  {
    path: ["/home", "/home/room/:room_id"], 
    name: 'Home',
    Component: Middleware
  },
  {
    path: '/login',
    name: "Login",
    Component: Login,
  },
  {
    path: '/register',
    name: "Register",
    Component: Register
  },
]

function createApolloClient() {
  const httpLink = createHttpLink({
    uri: process.env.REACT_APP_BACKEND_HTTP_URL,
  })
  
  const authLink = setContext(() => {
    const token = localStorage.getItem('jwtToken')
      return {
        headers: {
          Authorization: token ? `${token}` : ''
      }
    }
  })
  
  const wsLink = new WebSocketLink({
    uri: process.env.REACT_APP_BACKEND_WS_URL,
    options: {
      reconnect: true,
      timeout: 60000,
      lazy: true,
      connectionParams: {
        Authorization: localStorage.getItem('jwtToken') ? localStorage.getItem('jwtToken') : '',
      },
    },
  })
  
  // The split function takes three parameters:
  //
  // * A function that's called for each operation to execute
  // * The Link to use for an operation if the function returns a "truthy" value
  // * The Link to use for an operation if the function returns a "falsy" value
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    authLink.concat(httpLink),
  )
  
  const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache()
  })
  return client
}

function App() {
  

  const [DrawerState, setDrawerState] = useState(false)
  const [apolloClient, setApolloClient] = useState(createApolloClient());

  const handleAuthTokenReceived = () => {
    setApolloClient(createApolloClient());
  };

  const toggleDrawer = (open) => (event) => { 
    setDrawerState(open);
};

  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider client={apolloClient} onTokenReceived={handleAuthTokenReceived}>
        <DrawerTogglerContext.Provider value={{DrawerState,toggleDrawer}}>
          <SnackbarProvider maxSnack={2}>
            <RoomProvider>
              <BrowserRouter>
                <MyToolbar drawerHandler={setDrawerState} drawerState={DrawerState}/>
                {routes.map(({ path, Component }) => (
                  <Route key={path} exact path={path} component={Component}>
                      {({ match }) => (
                        <CSSTransition
                            in={match != null}
                            timeout={500}
                            classNames="page"
                            unmountOnExit
                        >
                            <div className="page">
                                <Component drawerState={DrawerState} drawerHandler={setDrawerState} />
                            </div>
                        </CSSTransition>
                      )}
                  </Route>
                ))}
              </BrowserRouter>
            </RoomProvider>         
          </SnackbarProvider> 
        </DrawerTogglerContext.Provider>     
      </AuthProvider>    
    </ApolloProvider>
  );
}

export const DrawerTogglerContext = createContext()
export default App;
