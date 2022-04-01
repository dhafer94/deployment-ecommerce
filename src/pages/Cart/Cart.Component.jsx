import React, { PureComponent } from 'react';
import './Cart.styles.scss';
import CartProductCard from '../../components/CartProductCard/CartProductCard.Component';
import { withRouter } from '../../withRouter';
import {
	CartContext,
	CurrencyContext,
	HandleIncrementDecrementContext,
} from '../../contexts';

class Cart extends PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className={'cart'}>
				<h2 className='cart-title'>Cart</h2>
				<HandleIncrementDecrementContext.Consumer>
					{(handleIncrementDecrement) => (
						<CartContext.Consumer>
							{(cart) => (
								<CurrencyContext.Consumer>
									{(currency) => (
										<CartProductCard
											handleIncrementDecrement={handleIncrementDecrement}
											currency={currency}
											cart={cart}
										/>
									)}
								</CurrencyContext.Consumer>
							)}
						</CartContext.Consumer>
					)}
				</HandleIncrementDecrementContext.Consumer>
			</div>
		);
	}
}

export default withRouter(Cart);
