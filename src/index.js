import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Product from './pages/Product/Product.Component';
import Cart from './pages/Cart/Cart.Component';
import Category from './pages/Category/Category.Component';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
	uri: 'https://dhafer-e-commerce-react-app.herokuapp.com',
	cache: new InMemoryCache(),
});

ReactDOM.render(
	<React.StrictMode>
		<Router>
			<ApolloProvider client={client}>
				<Routes>
					<Route path='/' element={<App client={client} />}>
						<Route path='/plp/:plp' element={<Category client={client} />} />
						<Route path='/plp/:plp/:pdp' element={<Product client={client} />} />
						<Route path='/cart' element={<Cart client={client} />} />
					</Route>
				</Routes>
			</ApolloProvider>
		</Router>
	</React.StrictMode>,
	document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
