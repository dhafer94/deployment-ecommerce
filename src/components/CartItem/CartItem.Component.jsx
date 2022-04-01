import React, { PureComponent } from 'react';
import './CartItem.styles.scss';
import { withRouter } from '../../withRouter';

class CartItem extends PureComponent {
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

	render() {
		const { allAttributes, item } = this.state;

		// console.log(allAttributes);

		return (
			<div
				id='cart-overlay'
				className='cart-overlay-item-attributes-main-container'>
				<div
					id='cart-overlay'
					className='cart-overlay-item-attributes-group-container'>
					{allAttributes.map((att, i) => (
						<div
							key={i}
							id='cart-overlay'
							className='cart-overlay-item-attributes-other-container'>
							{att.map((attr, i) =>
								attr.id === item.id ? (
									attr.type === 'text' ? (
										<div
											key={i}
											id='cart-overlay'
											className={
												attr.selected
													? 'cart-overlay-item-attribute-box-selected'
													: 'cart-overlay-item-attribute-box'
											}>
											{attr.value}
										</div>
									) : null
								) : null,
							)}
						</div>
					))}
				</div>
				<div
					id='cart-overlay'
					className='cart-overlay-item-attributes-group-container'>
					{allAttributes.map((att, i) => (
						<div
							key={i}
							id='cart-overlay'
							className='cart-overlay-item-attributes-swatch-container'>
							{att.map((attr, i) =>
								attr.id === item.id ? (
									attr.type === 'swatch' ? (
										<div
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
									) : null
								) : null,
							)}
						</div>
					))}
				</div>
			</div>
		);
	}
}

export default withRouter(CartItem);
