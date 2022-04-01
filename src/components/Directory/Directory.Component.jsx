import React, { PureComponent } from 'react';
import './Directory.styles.scss';
import ProductCard from '../ProductCard/ProductCard.Component';
import { withRouter } from '../../withRouter';
// import { FixedSizeGrid as Grid } from 'react-window';

class Directory extends PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		const { currency, products, dataFetched, category } = this.props;
		// const category = this.props.router.params.plp;
		// console.log(category);
		return (
			<>
				<h2 className='category-name'>{category}</h2>
				<div className='directory-container'>
					{dataFetched ? (
						products.map((product, i) => {
							return (
								<ProductCard
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
