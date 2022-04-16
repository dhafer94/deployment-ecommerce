import React, { PureComponent } from 'react';
import './Category.styles.scss';
import Directory from '../../components/Directory/Directory.Component';
import {
	CategoryProductsContext,
	CurrencyContext,
	DataFetchedContext,
	ChosenCategoryContext,
	HandleAddToCartContext,
} from '../../contexts';
import { withRouter } from '../../withRouter';

class Category extends PureComponent {
	render() {
		return (
			<div className={'category-page'}>
				<HandleAddToCartContext.Consumer>
					{(handleAddToCart) => (
						<ChosenCategoryContext.Consumer>
							{(category) => (
								<DataFetchedContext.Consumer>
									{(dataFetched) => (
										<CurrencyContext.Consumer>
											{(currency) => (
												<CategoryProductsContext.Consumer>
													{(products) => (
														<Directory
															handleAddToCart={handleAddToCart}
															currency={currency}
															products={products}
															dataFetched={dataFetched}
															category={category}
														/>
													)}
												</CategoryProductsContext.Consumer>
											)}
										</CurrencyContext.Consumer>
									)}
								</DataFetchedContext.Consumer>
							)}
						</ChosenCategoryContext.Consumer>
					)}
				</HandleAddToCartContext.Consumer>
			</div>
		);
	}
}

export default withRouter(Category);
