import React, { PureComponent } from 'react';
import './Directory.styles.scss';
import ProductCard from '../ProductCard/ProductCard.Component';
import { withRouter } from '../../withRouter';

class Directory extends PureComponent {
	render() {
		const { currency, products, dataFetched, category, handleAddToCart } =
			this.props;

		return (
			<>
				<h2 className='category-name'>{category}</h2>
				<div className='directory-container'>
					{dataFetched ? (
						products.map((product, i) => {
							return (
								<ProductCard
									handleAddToCart={handleAddToCart}
									category={category}
									currency={currency}
									key={i}
									product={product}
								/>
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
