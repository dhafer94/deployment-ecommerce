import React, { PureComponent } from 'react';
import Attribute from '../Attribute/Attribute.Component';
import AddToCartButton from '../AddToCartButton/AddToCartButton.Component';
import './AttributesPopup.styles.scss';
import { withRouter } from '../../withRouter';

class AttributesPopup extends PureComponent {
	// componentDidMount() {
	// 	const allData = this.props.allData;
	// 	if (product[0] !== 'undefined') {
	// 		this.setState({
	// 			product: product,
	// 			dataLoaded: true,
	// 		});
	// 	}
	// }

	render() {
		const {
			handleAttributesPopup,
			handleAddToCart,
			handleAttributeClick,
			product,
		} = this.props;
	

		const { attributes, inStock, name, id } = product[0];

		return (
			<div id='popup' className='attributes-popup'>
				<div className='attributes-popup-inner'>
					<button
						btnname='x'
						onClick={handleAttributesPopup}
						className='attributes-popup-x-btn'>
						x
					</button>
					<h2 className='attributes-popup-title'>
						please select the {name} attributes to add to your cart:
					</h2>
					<Attribute
						attributes={attributes}
						inStock={inStock}
						id={id}
						handleAttributeClick={handleAttributeClick}
					/>
					<AddToCartButton
						btnname='plp'
						inStock={inStock}
						handleAddToCart={handleAddToCart}
						id={id}
					/>
				</div>
			</div>
		);
	}
}

export default withRouter(AttributesPopup);
