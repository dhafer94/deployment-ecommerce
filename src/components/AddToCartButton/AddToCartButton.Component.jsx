import React, { PureComponent } from 'react';
import './AddToCartButton.styles.scss';

class AddToCartButton extends PureComponent {
	// componentDidMount() {
	// 	const product = this.props.product;
	// 	if (product[0] !== 'undefined') {
	// 		this.setState({
	// 			product: product,
	// 			dataLoaded: true,
	// 		});
	// 	}
	// }

	render() {
		const { handleAddToCart, id, inStock, btnname } = this.props;
		// console.log();

		return inStock ? (
			<button
				btnname={btnname}
				onClick={handleAddToCart}
				id={id}
				className='add-to-cart-btn'>
				Add to Cart
			</button>
		) : (
			<button className='add-to-cart-btn-inactive'>out of stock</button>
		);
	}
}

export default AddToCartButton;
