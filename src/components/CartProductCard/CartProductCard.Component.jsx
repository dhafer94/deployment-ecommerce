import React, { PureComponent } from 'react';
import './CartProductCard.styles.scss';
import { withRouter } from '../../withRouter';

class CartProductCard extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			image: [],
		};
	}

	handleChevronClick = (e, i) => {
		const { image } = this.state;
		const { cart } = this.props;
		const images = cart.map((item, i) => ({
			index: i,
			gallery: item.gallery,
		}));
		const productImgs = images.filter((img) => img.index === i);

		if (image.length > 0) {
			if (e.target.attributes.name.value === 'left' && image[0].imgIndex > 0) {
				this.setState({
					image: [
						{
							itemIndex: i,
							imgIndex: image[0].imgIndex - 1,
						},
					],
				});
			}
			if (
				e.target.attributes.name.value === 'right' &&
				image[0].imgIndex < productImgs[0].gallery.length - 1
			) {
				this.setState({
					image: [
						{
							itemIndex: i,
							imgIndex: image[0].imgIndex + 1,
						},
					],
				});
			}
		} else {
			this.setState({
				image: [
					{
						itemIndex: i,
						imgIndex: 0,
					},
				],
			});
		}
	};

	render() {
		const {
			cart,
			currency,
			handleIncrementDecrement,
			handleCartAttributesChange,
		} = this.props;
		const { image } = this.state;

		return (
			<div className='cart-products-container'>
				{cart.length > 0 ? (
					cart.map((item, itemIndex) => (
						<div key={itemIndex} id={itemIndex} className='cart-product-card'>
							<div className='cart-product-left-container'>
								<h3 key={itemIndex} className='cart-product-card-brand'>
									{item.brand}
								</h3>
								<h3 key={itemIndex + 1000} className='cart-product-card-name'>
									{item.name}
								</h3>
								{item.prices.map((price) =>
									currency.length > 0 &&
									price.currency.label === currency[0].label ? (
										<p key={itemIndex} className='cart-product-card-price'>
											{price.currency.symbol}
											{price.amount}
										</p>
									) : null,
								)}
								<div
									key={itemIndex + 20000}
									className='cart-product-card-attributes-main-container'>
									<div
										key={itemIndex}
										className='cart-product-card-attributes-text-container'>
										{item.allAttributes.map((att, attIndex) =>
											att.map((attr, i) =>
												attr.type === 'text' ? (
													<div
														onClick={(e) =>
															handleCartAttributesChange(
																e,
																attr,
																attIndex,
																itemIndex,
															)
														}
														key={i}
														className={
															attr.selected
																? 'cart-product-card-attribute-box-selected'
																: 'cart-product-card-attribute-box'
														}>
														{attr.value}
													</div>
												) : (
													<div
														onClick={(e) =>
															handleCartAttributesChange(
																e,
																attr,
																attIndex,
																itemIndex,
															)
														}
														key={i}
														style={{ background: attr.value }}
														className={
															attr.selected
																? 'cart-product-card-attribute-swatch-selected'
																: 'cart-product-card-attribute-swatch'
														}></div>
												),
											),
										)}
									</div>
								</div>
							</div>

							<div className='cart-product-right-container'>
								<div key={itemIndex} className='cart-product-mid-container'>
									<button
										id={item.id}
										name='increment'
										onClick={(e) => handleIncrementDecrement(e, itemIndex)}
										className='cart-product-increment-decrement'>
										+
									</button>
									<p className='cart-product-quantity'>{item.quantity}</p>
									<button
										id={item.id}
										name='decrement'
										onClick={(e) => handleIncrementDecrement(e, itemIndex)}
										className='cart-product-increment-decrement'>
										-
									</button>
								</div>
								<div className='cart-product-img-container'>
									<svg
										id={itemIndex}
										onClick={(e) => this.handleChevronClick(e, item)}
										name='left'
										className='cart-product-img-chevron-left'
										width='8'
										height='14'
										viewBox='0 0 8 14'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'>
										<path
											name='left'
											id={itemIndex}
											d='M1 13L7 7L1 1'
											stroke='white'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
										/>
									</svg>
									<img
										className='cart-product-img'
										src={
											image.length > 0
												? itemIndex === image[0].itemIndex
													? item.gallery[image[0].imgIndex]
													: item.gallery[0]
												: item.gallery[0]
										}
										alt={item.name}
									/>
									<svg
										id={itemIndex}
										className='cart-product-img-chevron-right'
										onClick={(e) => this.handleChevronClick(e, itemIndex)}
										name='right'
										width='8'
										height='14'
										viewBox='0 0 8 14'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'>
										<path
											id={itemIndex}
											name='right'
											d='M1 13L7 7L1 1'
											stroke='white'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
										/>
									</svg>
								</div>
							</div>
						</div>
					))
				) : (
					<h2 className='cart-product-no-products'>
						you have no Products in your bag
					</h2>
				)}
			</div>
		);
	}
}

export default withRouter(CartProductCard);
