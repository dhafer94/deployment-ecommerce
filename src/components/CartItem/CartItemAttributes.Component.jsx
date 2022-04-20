import React, { PureComponent } from 'react';
import './CartItemAttributes.styles.scss';
import { withRouter } from '../../withRouter';

class CartItemAttributes extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			allAttributes: [],
			item: [],
		};
	}

	componentDidMount() {
		const { item } = this.props;
		this.setState({
			allAttributes: item.allAttributes,
			item: item,
		});
	}

	componentDidUpdate() {
		const { item } = this.props;
		this.setState({
			allAttributes: item.allAttributes,
			item: item,
		});
	}

	// handleAttributeClick = (e, attr) => {
	// 	console.log(attr);
	// };

	render() {
		const { allAttributes, item } = this.state;
		const { handleCartAttributesChange, itemIndex } = this.props;

		return (
			<div
				id='cart-overlay'
				className='cart-overlay-item-attributes-main-container'>
				{allAttributes.map((att, attIndex) => (
					<div
						key={attIndex}
						id='cart-overlay'
						className='cart-overlay-item-attributes-container'>
						{att.map((attr, i) =>
							attr.type === 'text' && i === 0 ? (
								<p
									key={i}
									className='cart-overlay-item-attributes-name'
									id='cart-overlay'>
									{att[i].name} :
								</p>
							) : attr.type === 'swatch' && i === 0 ? (
								<p
									key={i}
									className='cart-overlay-item-attributes-name'
									id='cart-overlay'>
									{att[i].name} :
								</p>
							) : null,
						)}
						<div
							key={attIndex}
							id='cart-overlay'
							className='cart-overlay-item-attributes-container'>
							{att.map((attr, i) =>
								attr.id === item.id && attr.type === 'text'
									? (i === 0 ? (
											<p
												key={i}
												className='cart-overlay-item-attributes-name'
												id='cart-overlay'>
												{att[i].name} :
											</p>
									  ) : null,
									  (
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
												id='cart-overlay'
												className={
													attr.selected
														? 'cart-overlay-item-attribute-box-selected'
														: 'cart-overlay-item-attribute-box'
												}>
												{attr.value}
											</div>
									  ))
									: attr.id === item.id && attr.type === 'swatch'
									? (i === 0 ? (
											<p
												key={i}
												className='cart-overlay-item-attributes-name'
												id='cart-overlay'>
												{att[i].name} :
											</p>
									  ) : null,
									  (
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
												id='cart-overlay'
												className={
													attr.selected
														? 'cart-overlay-item-attribute-swatch-selected'
														: 'cart-overlay-item-attribute-swatch'
												}
												style={{
													background: `${attr.value}`,
												}}></div>
									  ))
									: null,
							)}
						</div>
					</div>
				))}
			</div>
		);
	}
}

export default withRouter(CartItemAttributes);
