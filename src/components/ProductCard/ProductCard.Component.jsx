import React, { PureComponent } from 'react';
import './ProductCard.styles.scss';
import { NavLink } from 'react-router-dom';

class ProductCard extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			isHovering: false,
		};
	}

	handleMouseEnter = (e) => {
		this.setState(() => ({
			isHovering: true,
		}));
	};

	handleMouseLeave = (e) => {
		this.setState(() => ({
			isHovering: false,
		}));
	};

	render() {
		const { currency, product, category, handleAttributesPopup } = this.props;
		const { id, name, gallery, prices, inStock } = product;
		const { isHovering } = this.state;
		const img = gallery[0];
		const price =
			currency.length > 0 &&
			prices.find((i) => currency[0].label === i.currency.label);

		return (
			<div
				className={inStock ? 'product-card' : 'product-card-out-of-stock'}
				id={id}
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}>
				<NavLink className='product-card-navlink' to={`/plp/${category}/${id}`}>
					<img
						className='product-img'
						id={id}
						src={img}
						alt={name}
						height='330px'
					/>
					{!inStock ? (
						<div className='product-out-of-Stock-txt'>out of Stock</div>
					) : null}

					<div className='product-info'>
						<p className='product-title' id={id}>
							{name}
						</p>
						<p className='product-price' id={id}>
							{price.currency.symbol}
							{price.amount}
						</p>
					</div>
				</NavLink>
				{isHovering &&
					(inStock ? (
						<div
							btnname='plp'
							id={id}
							className='product-card-cart'
							onClick={handleAttributesPopup}
						/>
					) : (
						<div id={id} className='product-card-cart' />
					))}
			</div>
		);
	}
}

export default ProductCard;
