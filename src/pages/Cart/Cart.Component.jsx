import React, { PureComponent } from 'react';
import './Cart.styles.scss';
import CartProductCard from '../../components/CartProductCard/CartProductCard.Component';
import { withRouter } from '../../withRouter';
import {
	CartContext,
	CurrencyContext,
	HandleIncrementDecrementContext,
	HandleCartAttributesChangeContext,
} from '../../contexts';

class Cart extends PureComponent {
	render() {
		return (
			<div className={'cart'}>
				<h2 className='cart-title'>Cart</h2>
				<HandleCartAttributesChangeContext.Consumer>
					{(handleCartAttributesChange) => (
						<HandleIncrementDecrementContext.Consumer>
							{(handleIncrementDecrement) => (
								<CartContext.Consumer>
									{(cart) => (
										<CurrencyContext.Consumer>
											{(currency) => (
												<CartProductCard
													handleCartAttributesChange={
														handleCartAttributesChange
													}
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
					)}
				</HandleCartAttributesChangeContext.Consumer>
			</div>
		);
	}
}

export default withRouter(Cart);
