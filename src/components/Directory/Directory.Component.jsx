import React, { PureComponent } from 'react';
import './Directory.styles.scss';
import ProductCard from '../ProductCard/ProductCard.Component';
import { withRouter } from '../../withRouter';
import { HandleAttributesPopupContext } from '../../contexts';

class Directory extends PureComponent {
	render() {
		const { currency, products, dataFetched, category } = this.props;

		return (
			<>
				<h2 className='category-name'>{category}</h2>
				<div className='directory-container'>
					{dataFetched ? (
						products.map((product, i) => {
							return (
								<HandleAttributesPopupContext.Consumer key={i}>
									{(handleAttributesPopup) => (
										<ProductCard
											handleAttributesPopup={handleAttributesPopup}
											category={category}
											currency={currency}
											key={i}
											product={product}
										/>
									)}
								</HandleAttributesPopupContext.Consumer>
							);
						})
					) : (
						<h2>Loading ...</h2>
					)}
				</div>
			</>
		);
	}
}

export default withRouter(Directory);
