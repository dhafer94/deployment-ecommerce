import React, { PureComponent } from 'react';
import './Product.styles.scss';
import ProductProfile from '../../components/ProductProfile/ProductProfile.Component';
import {
	CategoryProductsContext,
	CurrencyContext,
	AllDataContext,
	DataFetchedContext,
	HandleAddToCartContext,
	HandleAttributeClickContext,
} from '../../contexts';

class Product extends PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
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
												<AllDataContext.Consumer>
													{(allData) => (
														<CurrencyContext.Consumer>
															{(currency) => (
																<CategoryProductsContext.Consumer>
																	{(products) => (
																		<ProductProfile
																			currency={currency}
																			products={products}
																			allData={allData}
																			dataFetched={dataFetched}
																			handleAddToCart={handleAddToCart}
																			handleAttributeClick={
																				handleAttributeClick
																			}
																		/>
																	)}
																</CategoryProductsContext.Consumer>
															)}
														</CurrencyContext.Consumer>
													)}
												</AllDataContext.Consumer>
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
