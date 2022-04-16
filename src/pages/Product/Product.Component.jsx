import React, { PureComponent } from 'react';
import './Product.styles.scss';
import ProductProfile from '../../components/ProductProfile/ProductProfile.Component';
import {
	CategoryProductsContext,
	CurrencyContext,
	DataFetchedContext,
	HandleAddToCartContext,
	HandleAttributeClickContext,
} from '../../contexts';

class Product extends PureComponent {
	render() {
		const { client } = this.props;

		return (
			<div className={'product-profile'}>
				<HandleAttributeClickContext.Consumer>
					{(handleAttributeClick) => (
						<HandleAddToCartContext.Consumer>
							{(handleAddToCart) => (
								<CurrencyContext.Consumer>
									{(currency) => (
										<DataFetchedContext.Consumer>
											{(dataFetched) => (
												<CurrencyContext.Consumer>
													{(currency) => (
														<CategoryProductsContext.Consumer>
															{(products) => (
																<ProductProfile
																	client={client}
																	currency={currency}
																	products={products}
																	dataFetched={dataFetched}
																	handleAddToCart={handleAddToCart}
																	handleAttributeClick={handleAttributeClick}
																/>
															)}
														</CategoryProductsContext.Consumer>
													)}
												</CurrencyContext.Consumer>
											)}
										</DataFetchedContext.Consumer>
									)}
								</CurrencyContext.Consumer>
							)}
						</HandleAddToCartContext.Consumer>
					)}
				</HandleAttributeClickContext.Consumer>
			</div>
		);
	}
}

export default Product;
