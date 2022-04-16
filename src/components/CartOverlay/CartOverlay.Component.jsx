import React, { PureComponent } from 'react';
import './CartOverlay.styles.scss';
import CartItemComponent from '../CartItem/CartItem.Component';
import { NavLink } from 'react-router-dom';

class CartOverlay extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			totalPrice: 0,
			allAttributes: [],
		};
	}

	componentDidUpdate() {
		const { cart, currency } = this.props;
		if (cart.length > 0) {
			const priceArray = cart
				.map(
					(item) =>
						item.prices.filter(
							(price) => price.currency.label === currency[0].label,
						)[0].amount * item.quantity,
				)
				.flat(1);

			const sum = priceArray
				.reduce((prevItem, item) => prevItem + item)
				.toFixed(2);

			this.setState({
				totalPrice: sum,
			});
		} else {
			this.setState({
				totalPrice: 0,
			});
		}
	}

	render() {
		const {
			cart,
			currency,
			handleIncrementDecrement,
			dropdown,
			handleClicksForDropDown,
			handleCartAttributesChange,
		} = this.props;
		const { totalPrice } = this.state;
		// const allAttributes = cart.map((item) => item.allAttributes).flat(1);

		// console.log(allAttributes, 'allAttributes');

		return (
			<div
				onClick={handleClicksForDropDown}
				id='cart-overlay'
				className={
					dropdown === 'active' ? 'cart-overlay' : 'cart-overlay-invisible'
				}>
				<h2 id='cart-overlay' className='cart-overlay-title'>
					my Bag{' '}
					<span id='cart-overlay' className='cart-overlay-products-count'>
						{`${cart.length ? cart.length : 'no'}`} items
					</span>
				</h2>
				<div
					id='cart-overlay'
					className={
						cart.length <= 1
							? 'cart-overlay-items-main-container-mini'
							: 'cart-overlay-items-main-container'
					}>
					{cart.length > 0
						? cart.map(
								(item, i) =>
									item.quantity >= 1 && (
										<div
											id='cart-overlay'
											key={i}
											className={'cart-overlay-item-container'}>
											{' '}
											<div
												id='cart-overlay'
												className='cart-overlay-item-left-container'>
												<h3
													id='cart-overlay'
													className='cart-overlay-item-title'>
													{item.brand}
													<br />
													{item.name}
												</h3>
												{currency.length > 0
													? item.prices.map(
															(price, i) =>
																price.currency.label === currency[0].label && (
																	<p
																		id='cart-overlay'
																		className='cart-overlay-item-price'
																		key={i}>
																		{`${price.currency.symbol}${price.amount}`}
																	</p>
																),
													  )
													: null}
												<CartItemComponent
													item={item}
													allAttributes={item.allAttributes}
													handleCartAttributesChange={
														handleCartAttributesChange
													}
													itemIndex={i}
												/>
											</div>
											<div
												key={i}
												id='cart-overlay'
												className='cart-overlay-item-right-container'>
												<div
													id='cart-overlay'
													key={i}
													className='cart-overlay-item-mid-container'>
													<button
														id={item.id}
														name='increment'
														onClick={(e) => handleIncrementDecrement(e, i)}
														className='cart-overlay-item-attribute-increment-decrement'>
														+
													</button>

													<p
														id='cart-overlay'
														className='cart-overlay-item-quantity'>
														{item.quantity}
													</p>
													<button
														id={item.id}
														name='decrement'
														onClick={(e) => handleIncrementDecrement(e, i)}
														className='cart-overlay-item-attribute-increment-decrement'>
														-
													</button>
												</div>
												<img
													id='cart-overlay'
													src={item.gallery[0]}
													className='cart-overlay-item-img'
													alt={item.name}
												/>
											</div>
										</div>
									),
						  )
						: null}
				</div>

				<div id='cart-overlay' className='cart-overlay-total-price-container'>
					<p id='cart-overlay' className='cart-overlay-total-price-text'>
						total
					</p>
					<p id='cart-overlay' className='cart-overlay-total-price-amount'>
						{currency[0] && currency[0].symbol}
						{totalPrice}
					</p>
				</div>
				<div id='cart-overlay' className='cart-overlay-total-price-container'>
					<NavLink className='cart-overlay-view-btn' to={`/cart`}>
						view bag
					</NavLink>
					<button className='cart-overlay-checkout-btn'>checkout</button>
				</div>
			</div>
		);
	}
}

export default CartOverlay;
