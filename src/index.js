import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import App from './App';

import { BrowserRouter } from 'react-router-dom';
import {Provider} from 'react-redux';
import {store} from './store/store';
 

import reportWebVitals from './reportWebVitals';

// import SimpleReactLightbox from "simple-react-lightbox";
import  ThemeContext  from "./context/ThemeContext"; 

//Apollo GrpahQL
// import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
// 2
// const httpLink = createHttpLink({ uri: 'http://localhost:4000' });
// const httpLink2 = createHttpLink({ uri: 'http://localhost:4001' });
// 3
// const client = new ApolloClient({ link: httpLink, cache: new InMemoryCache() });
// const client2 = new ApolloClient({ link: httpLink2, cache: new InMemoryCache() });

// 4
// ReactDOM.render(
//     <ApolloProvider client={client}>
//       <App />
//     </ApolloProvider>,
//     document.getElementById('root')
// );

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

ReactDOM.render(
	<React.StrictMode>
		<Provider store = {store}>
            {/* <SimpleReactLightbox> */}
                <BrowserRouter basename='/react/demo'>
                    <ThemeContext>
                        <App />
                        {/* <ApolloProvider client={client} client2={client2}>
                            <App />
                        </ApolloProvider>, */}
                    </ThemeContext>  
                </BrowserRouter>    
            {/* </SimpleReactLightbox> */}
        </Provider>	
	</React.StrictMode>,
  document.getElementById("root")
);
reportWebVitals(); 
