import React, { PureComponent } from 'react';
import './App.scss';
import Navigation from './components/Navigation/Navigation.Component';
import CartOverlay from './components/CartOverlay/CartOverlay.Component';
import { Outlet } from 'react-router-dom';
import { gql } from '@apollo/client';
import {
	CategoryProductsContext,
	CurrencyContext,
	DataFetchedContext,
	ChosenCategoryContext,
	HandleAddToCartContext,
	HandleAttributeClickContext,
	CartContext,
	HandleIncrementDecrementContext,
	HandleCartAttributesChangeContext
} from './contexts';
import { withRouter } from './withRouter';
import { isEqual } from './isEqual';

class App extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			allData: [],
			products: [],
			categoriesNames: [],
			productsToBeShown: [],
			currency: [],
			dataFetched: false,
			dropdown: {
				currency: 'inactive',
				cartOverlay: 'inactive'
			},
			chosenAttributes: [],
			cart: []
		};
	}

	//one request to get all the needed data from the server
	componentDidMount() {
		const controller = new AbortController();
		this.props.client
			.query({
				query: gql`
					{
						categories {
							name
							products {
								id
								category
								name
								gallery
								prices {
									currency {
										label
										symbol
									}
									amount
								}
								brand
								inStock
								attributes {
								name
								type
									items {
										value
									}
								}
								description
							}
						}
					}
				`,
			})
			.then((res) => {
				if (!this.state.dataFetched) {

					this.setState({
						allData: res.data.categories.map((item) => item),
						categoriesNames: res.data.categories.map((item) => item.name),
						productsToBeShown: res.data.categories[0].products,
						currency: res.data.categories[0].products[0].prices.map(
							(item, i) => {
								return {
									label: item.currency.label,
									symbol: item.currency.symbol,
									selected: i === 0 ? true : false,
								};
							},
						),
						dataFetched: true,
						//all products with duplicates if they exist in other categories
						products: res.data.categories.map((item) => item.products).flat(Infinity)

					});
				}
			});
		return () => {
			controller.abort();
		};
	}

	componentDidUpdate() {
		if (this.state.dataFetched && this.props.router.location.pathname === `/plp/${this.props.router.params.plp}`) {
			const productsToBeShown = this.state.allData.filter((category) => {
				return category.name === this.props.router.params.plp && category.products;
			})[0].products;

			return this.setState({
				productsToBeShown: productsToBeShown,
			});
		}
		if (this.props.router.location.pathname === '/') {
			this.props.router.navigate('/plp/all');
		}
	}

	handleCurrencyClick = (e) => {
		const value = e.target.value;
		if (this.state.dataFetched) {
			this.setState((state) => ({
				currency: state.currency.map((c) => {
					return {
						...c,
						selected: c.label === value,
					};
				}),
				dropdown: 'inactive'
			}));
		}
	};

	handleAttributeClick = (e) => {
		const name = e.target.attributes.attribute.nodeValue;
		const value = e.target.attributes.attributeval.nodeValue;
		const type = e.target.attributes.type.nodeValue;
		const id = e.target.id;

		//to reset the previous active attribute/s and visually set the active attribute visually
		if (e.target.className === 'product-attribute') {
			e.target.parentNode.childNodes.forEach(
				(child) => (child.className = 'product-attribute'),
			);
			e.target.className = 'product-attribute-active';
		}
		if (e.target.className === 'product-attribute-swatch') {
			e.target.parentNode.childNodes.forEach(
				(child) => (child.className = 'product-attribute-swatch'),
			);
			e.target.className = 'product-attribute-swatch-active';
		}

		//to set active attributes, reset the previous active attribute/s in our data and set the newones if any changes
		this.setState({
			chosenAttributes:
				this.state.chosenAttributes.length === 0
					?
					[
						{
							id: id,
							name: name,
							value: value,
							type: type
						}
					]
					:
					[
						...this.state.chosenAttributes.filter((att) => att.name !== name),
						{
							id: id,
							name: name,
							value: value,
							type: type
						}
					],
		});
	};


	handleAddToCart = (e) => {
		const { products, cart } = this.state;
		const AddedProductId = e.target.id;

		const AddedProduct = products.find((product) => product.id === AddedProductId);
		const { name, brand, prices, attributes, id, gallery } = AddedProduct;

		//To add the chosen attributes when adding a product from pdp and choose first one as default when adding from plp
		const chosenAttributes = e.target.attributes.btnname.value === 'pdp' ? this.state.chosenAttributes.filter((att) => att.id === AddedProductId) : attributes.map(att =>
		({
			id: id,
			name: att.name,
			value: att.items[0].value,
			type: att.type
		}));

		const allAttributes = e.target.attributes.btnname.value === 'pdp' ? attributes.map(att => (
			att.items.map((attr) => (
				{
					id: AddedProductId,
					name: att.name,
					value: attr.value,
					type: att.type,
					selected: chosenAttributes.some(i => i.name === att.name && i.value === attr.value)
				}))
		)) : attributes.map(att =>
			att.items.map((attr, i) =>
			({
				id: AddedProductId,
				name: att.name,
				value: attr.value,
				type: att.type,
				selected: i === 0 ? true : false

			})));
		//To only add the product to the cart when attributes has been chosen
		//a popup to choose the correct one can be shown to the user otherwise, in the meantime an alert is implemented
		if (chosenAttributes.length === attributes.length) {
			if (cart.length > 0) {
				if (cart.some((item) => item.id === AddedProductId)) {
					cart.forEach(item => {
						if (isEqual(chosenAttributes, item.attributes)) {
							this.setState({
								cart: [
									...cart.filter(item => item.id !== AddedProductId),
									...cart.filter(item => item.id === AddedProductId && !isEqual(chosenAttributes, item.attributes)),
									{
										name: item.name,
										brand: item.brand,
										prices: item.prices,
										id: item.id,
										attributes: item.attributes,
										quantity: item.quantity + 1,
										gallery: item.gallery,
										allAttributes: item.allAttributes,
									}

								]

							});
						} else {
							const newItem = cart.filter(item => item.id === AddedProductId && isEqual(chosenAttributes, item.attributes));
							if (newItem.length > 0) {
								newItem.splice(0, 1, {
									name: newItem[0].name,
									brand: newItem[0].brand,
									prices: newItem[0].prices,
									id: newItem[0].id,
									attributes: newItem[0].attributes,
									quantity: newItem[0].quantity + 1,
									gallery: newItem[0].gallery,
									allAttributes: newItem[0].allAttributes,
								});
								this.setState({
									cart: [
										...cart.filter(item => item.id !== AddedProductId),
										...cart.filter(item => item.id === AddedProductId && !isEqual(chosenAttributes, item.attributes)),
										...newItem,
									]

								});
							}
							if (newItem.length <= 0) {
								newItem.splice(0, 0, {
									name: name,
									brand: brand,
									prices: prices,
									id: id,
									attributes: chosenAttributes,
									quantity: 1,
									gallery: gallery,
									allAttributes: allAttributes,
								});
								this.setState({
									cart: [
										...cart.filter(item => item.id !== AddedProductId),
										...cart.filter(item => item.id === AddedProductId && !isEqual(chosenAttributes, item.attributes)),
										...newItem,
									]

								});
							}
						}

					});
				}
				else {
					this.setState({
						cart: [
							...this.state.cart,
							{
								name: name,
								brand: brand,
								prices: prices,
								id: id,
								attributes: chosenAttributes,
								quantity: 1,
								gallery: gallery,
								allAttributes: allAttributes
							}
						]
					});
				}
			}
			else {
				this.setState({
					cart: [
						...this.state.cart,
						{
							name: name,
							brand: brand,
							prices: prices,
							id: id,
							attributes: chosenAttributes,
							quantity: 1,
							gallery: gallery,
							allAttributes: allAttributes
						}]
				});
			}

		} else {
			const chosenAttributesNames = chosenAttributes.filter((att) => att.id === AddedProductId).map((att) => att.name);
			const notAddedAttributes = attributes.map(att => att.name).filter((attr) => !chosenAttributesNames.includes(attr));
			if (e.target.attributes.btnname.value === 'pdp') {
				if (notAddedAttributes.length === 1) {
					const alert = notAddedAttributes.map(att => att);
					window.alert(`Please select one of the available options for your ${name}:\n${alert.map((att) => ` ${att}`)
						} `);
				}
				else {
					const alert = notAddedAttributes.map(att => att);
					window.alert(`Please select one of the available options for your ${name}:\n${alert.map((att) => ` ${att}`).slice(0, -1)} and ${alert[alert.length - 1]
						} `);
				}
			};
		}
	};

	//Listen to clicks anywhere on the page to control dropdown active, inactive state
	//Added the cart for the same action and refactored the code using id in s
	handleClicksForDropDown = (e) => {
		const id = e.target.id;
		const { dropdown } = this.state;
		const cartId = 'navbar-cart';
		const currencyId = 'navbar-currency';

		if (id === cartId && dropdown.cartOverlay === 'inactive') {
			this.setState({
				dropdown: {
					currency: 'inactive',
					cartOverlay: 'active'
				}
			});
		} else
			if (id === cartId && dropdown.cartOverlay === 'active') {
				this.setState({
					dropdown: {
						currency: 'inactive',
						cartOverlay: 'inactive'
					}
				});

			}
		if (id === currencyId && dropdown.currency === 'inactive') {
			this.setState({
				dropdown: {
					currency: 'active',
					cartOverlay: 'inactive'
				}
			});

		} else
			if (id === currencyId && dropdown.currency === 'active') {
				this.setState({
					dropdown: {
						currency: 'inactive',
						cartOverlay: 'inactive'
					}
				});

			}

	};

	handleIncrementDecrement = (e, i) => {
		const name = e.target.name;
		const cart = [...this.state.cart];

		if (i !== 'undefined') {
			const item = cart[i];

			const incremented = {
				name: item.name,
				brand: item.brand,
				prices: item.prices,
				attributes: item.attributes,
				id: item.id,
				quantity: item.quantity + 1,
				gallery: item.gallery,
				allAttributes: item.allAttributes
			};
			const decremented = {
				name: item.name,
				brand: item.brand,
				prices: item.prices,
				attributes: item.attributes,
				id: item.id,
				quantity: item.quantity - 1,
				gallery: item.gallery,
				allAttributes: item.allAttributes
			};

			const newCart = [...cart];

			if (name === 'increment') {
				newCart.splice(i, 1, incremented);
				this.setState({
					cart: newCart
				});
			}
			if (name === 'decrement') {
				//remove the item if the quantity hits zero
				if (decremented.quantity <= 0) {
					newCart.splice(i, 1);
					this.setState({
						cart: newCart
					});;
				} else {
					newCart.splice(i, 1, decremented);
					this.setState({
						cart: newCart
					});
				}
			}
		}
	};

	handleCartAttributesChange = (e, attr, attIndex, itemIndex) => {
		const cart = [...this.state.cart];
		const cartItem = cart[itemIndex];
		const itemAttributes = [...cartItem.allAttributes[attIndex]];
		const allAttributes = [...cartItem.allAttributes];
		const newAttribute = itemAttributes.map(att =>
		({
			id: att.id,
			name: att.name,
			selected: attr.value === att.value && attr.name === att.name ? true : false,
			type: att.type,
			value: att.value,
		})
		);

		allAttributes.splice(attIndex, 1, newAttribute);

		const chosenAttributes = allAttributes.flat().map(attr => attr.selected ? ({
			id: attr.id,
			name: attr.name,
			value: attr.value,
			type: attr.type
		}) : []).flat();

		const clickedItem = cart.filter((item, i) => i === itemIndex);

		const itemWithMatchingAttributesIndex = this.state.cart.findIndex(item => isEqual(item.allAttributes, allAttributes));

		//to not duplicate the item if it is already exists in the bag and only add to its quantity
		if (itemWithMatchingAttributesIndex >= 0) {
			cart.splice(itemWithMatchingAttributesIndex, 1, {
				name: clickedItem[0].name,
				brand: clickedItem[0].brand,
				prices: clickedItem[0].prices,
				id: clickedItem[0].id,
				attributes: chosenAttributes,
				quantity: clickedItem[0].quantity + cart[itemWithMatchingAttributesIndex].quantity,
				gallery: clickedItem[0].gallery,
				allAttributes: allAttributes,
			});
			cart.splice(itemIndex, 1);
		}
		else {
			cart.splice(itemIndex, 1, {
				name: clickedItem[0].name,
				brand: clickedItem[0].brand,
				prices: clickedItem[0].prices,
				id: clickedItem[0].id,
				attributes: chosenAttributes,
				quantity: clickedItem[0].quantity,
				gallery: clickedItem[0].gallery,
				allAttributes: allAttributes,
			});
		}
		this.setState({ cart: [...cart] });

	};

	//to hide dropdown and cart overlay when clicking anywhere else on the page
	resetter = (e) => {
		const id = e.target.id;
		const name = e.target.name;
		const cartId = 'navbar-cart';
		const currencyId = 'navbar-currency';

		//Added cart-overlay id to all it's elements
		const cartOverlayId = 'cart-overlay';

		//exceptions are
		if (id !== cartId && name !== 'increment' && name !== 'decrement' && id !== currencyId && id !== currencyId && id !== cartOverlayId) {
			this.setState({
				dropdown: {
					currency: 'inactive',
					cartOverlay: 'inactive'
				}
			});

		}
	};

	render() {
		const { productsToBeShown, currency, dataFetched, dropdown, cart } = this.state;
		const chosenCategory = this.props.router.params.plp;
		const selectedCurrency = dataFetched ? this.state.currency.filter(
			(item) => item.selected === true,
		) : [];

		return (
			<div
				onClick={this.resetter}
				className='App'				>
				<Navigation
					categoriesNames={this.state.categoriesNames}
					currency={currency}
					handleCurrencyClick={this.handleCurrencyClick}
					dataFetched={dataFetched}
					selectedCurrency={selectedCurrency}
					dropdown={dropdown.currency}
					cartLength={cart.length}
					handleClicksForDropDown={this.handleClicksForDropDown}
					cart={cart}
				/>
				<HandleCartAttributesChangeContext.Provider value={this.handleCartAttributesChange}>
					<HandleIncrementDecrementContext.Provider value={this.handleIncrementDecrement}>
						<CartContext.Provider value={cart}>
							<HandleAttributeClickContext.Provider value={this.handleAttributeClick}>
								<HandleAddToCartContext.Provider value={this.handleAddToCart}>
									<ChosenCategoryContext.Provider value={chosenCategory}>
										<DataFetchedContext.Provider value={dataFetched}>
											<CurrencyContext.Provider value={selectedCurrency}>
												<CategoryProductsContext.Provider value={productsToBeShown}>
													<div className={dropdown.cartOverlay === 'active' ? 'opacity' : 'normal'}>
														<Outlet />
													</div>
													<CartOverlay
														dropdown={dropdown.cartOverlay}
														handleIncrementDecrement={this.handleIncrementDecrement}
														currency={selectedCurrency}
														cart={cart}
														handleCartAttributesChange={this.handleCartAttributesChange} />
												</CategoryProductsContext.Provider>
											</CurrencyContext.Provider>
										</DataFetchedContext.Provider>
									</ChosenCategoryContext.Provider>
								</HandleAddToCartContext.Provider>
							</HandleAttributeClickContext.Provider>
						</CartContext.Provider>
					</HandleIncrementDecrementContext.Provider>
				</HandleCartAttributesChangeContext.Provider>
			</div >
		);
	}
}

export default withRouter(App);
