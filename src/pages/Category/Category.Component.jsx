import React, { PureComponent } from 'react';
import './Category.styles.scss';
import Directory from '../../components/Directory/Directory.Component';
import {
	CategoryProductsContext,
	CurrencyContext,
	DataFetchedContext,
	ChosenCategoryContext,
} from '../../contexts';
import { withRouter } from '../../withRouter';

class Category extends PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className={'category-page'}>
				<ChosenCategoryContext.Consumer>
					{(category) => (
						<DataFetchedContext.Consumer>
							{(dataFetched) => (
								<CurrencyContext.Consumer>
									{(currency) => (
										<CategoryProductsContext.Consumer>
											{(products) => (
												<Directory
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
			</div>
		);
	}
}

export default withRouter(Category);
