import React, { PureComponent } from 'react';
import './ProductProfile.styles.scss';
import { withRouter } from '../../withRouter';
import { DropdownContext } from '../../contexts';

class ProductProfile extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			allData: [],
			productId: this.props.router.params.pdp,
			category: this.props.router.params.plp,
			product: {},
			primaryImg: '',
		};
	}

	componentDidMount() {
		this.setState({
			allData: this.props.allData,
		});
	}

	componentDidUpdate() {
		this.setState({
			allData: this.props.allData,
		});
		if (this.state.allData[0]) {
			const product = this.state.allData
				.filter((category) => category.name === this.state.category)[0]
				.products.find((i) => i.id === this.state.productId);
			this.setState({
				product: product,
				primaryImg:
					this.state.primaryImg.length === 0
						? product.gallery[0]
						: this.state.primaryImg,
			});
		}
	}

	handleSecondaryImageClick = (e) => {
		const src = e.target.src;
		this.setState({
			primaryImg: src,
		});
	};

	render() {
		const {
			prices,
			name,
			brand,
			attributes,
			gallery,
			description,
			id,
			inStock,
		} = this.state.product;
		const { currency, handleAttributeClick } = this.props;
		const { primaryImg } = this.state;
		const createMarkup = () => {
			return { __html: description };
		};

		return (
			<>
				{gallery ? (
					<>
						<aside className='secondary-images'>
							{gallery.map((img, i) => (
								<img
									id={i}
									className={
										this.state.primaryImg === img
											? 'product-secondary-image-active'
											: 'product-secondary-image'
									}
									width='50'
									key={i}
									src={img}
									alt='product'
									onClick={this.handleSecondaryImageClick}
								/>
							))}
						</aside>

						<div className='product-image-description'>
							<img
								className='product-primary-image'
								src={primaryImg}
								alt='product'
							/>
							<div className='product-box'>
								<h2 className='product-brand'>{brand}</h2>
								<p className='product-name'>{name}</p>
								{typeof attributes !== 'undefined' &&
									attributes.map((attribute, i) =>
										attribute.type === 'swatch' ? (
											<div key={i}>
												<p
													key={i + 10}
													className='product-attribute-name'>{`${attributes[i].name}:`}</p>
												<div key={i} className='product-attributes-box'>
													{attribute.items.map((item, index) => (
														<div
															attribute={attribute.name}
															attributeval={item.value}
															type={attribute.type}
															id={id}
															onClick={(e) => handleAttributeClick(e)}
															style={{
																background: `${item.value}`,
																width: '63px',
																height: '45px',
															}}
															className={
																inStock
																	? 'product-attribute-swatch'
																	: 'product-attribute-out-of-stock'
															}
															key={index}></div>
													))}
												</div>
											</div>
										) : (
											<div key={i + 20}>
												<p
													key={i + 10}
													className='product-attribute-name'>{`${attributes[i].name}:`}</p>
												<div key={i} className='product-attributes-box'>
													{attribute.items.map((item, index) => (
														<p
															attribute={attribute.name}
															attributeval={item.value}
															type={attribute.type}
															id={id}
															onClick={(e) => handleAttributeClick(e)}
															className={
																inStock
																	? 'product-attribute'
																	: 'product-attribute-out-of-stock'
															}
															key={index}>
															{item.value}
														</p>
													))}
												</div>
											</div>
										),
									)}
								<p className='product-attribute-name'>price:</p>
								{typeof prices !== 'undefined' &&
									prices.map(
										(price, i) =>
											price.currency.label === currency[0].label && (
												<p className='product-price' key={i}>
													{`${price.currency.symbol}${price.amount}`}
												</p>
											),
									)}
								{inStock ? (
									<button
										onClick={this.props.handleAddToCart}
										id={id}
										className='add-to-cart-btn'>
										Add to Cart
									</button>
								) : (
									<button className='add-to-cart-btn-inactive'>
										out of stock
									</button>
								)}

								<div
									className='product-description-box'
									dangerouslySetInnerHTML={createMarkup()}
								/>
							</div>
						</div>
					</>
				) : (
					'Loading'
				)}
			</>
		);
	}
}

export default withRouter(ProductProfile);
