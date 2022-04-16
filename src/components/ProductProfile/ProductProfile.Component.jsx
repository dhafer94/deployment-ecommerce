import React, { PureComponent } from 'react';
import './ProductProfile.styles.scss';
import { withRouter } from '../../withRouter';
import parse from 'html-react-parser';
import { gql } from '@apollo/client';

class ProductProfile extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			allData: [],
			dataFetched: false,
			productId: this.props.router.params.pdp,
			category: this.props.router.params.plp,
			product: {},
			primaryImg: '',
			readMore: false,
			currency: this.props.currency,
		};
	}

	componentDidMount() {
		const controller = new AbortController();
		this.props.client
			.query({
				query: gql`
					{
						categories {
							name
							products {
								id
								category
								name
								gallery
								prices {
									currency {
										label
										symbol
									}
									amount
								}
								brand
								inStock
								attributes {
									name
									type
									items {
										value
									}
								}
								description
							}
						}
					}
				`,
			})
			.then((res) => {
				if (!this.state.dataFetched) {
					this.setState({
						allData: res.data.categories.map((item) => item),
						dataFetched: true,
					});
				}
			});
		return () => {
			controller.abort();
		};
	}

	componentDidUpdate() {
		this.setState({
			allData: this.state.allData,
			currency: this.props.currency,
		});
		if (this.state.allData.length > 0) {
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
		const { handleAttributeClick } = this.props;
		const { primaryImg, readMore, currency } = this.state;
		// const createMarkup = () => {
		// 	return { __html: description };
		// };
		return (
			<>
				{typeof gallery !== 'undefined' ? (
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
							<div className='product-primary-image-container'>
								<img
									className='product-primary-image'
									src={primaryImg}
									alt='product'
								/>
							</div>
							<div className='product-box'>
								<h2 className='product-brand'>{brand}</h2>
								<p className='product-name'>{name}</p>
								{typeof attributes !== 'undefined' &&
									attributes.map((attribute, i) =>
										attribute.type === 'swatch' ? (
											<div className='product-attribute-container' key={i}>
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
											<div className='product-attribute-container' key={i + 20}>
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
								<p className='product-price-title'>price:</p>
								{typeof prices !== 'undefined' &&
									currency.length > 0 &&
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
										btnname='pdp'
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
								{description.length > 250 ? (
									<div
										id='product-description-box'
										className='product-description-box'
										// dangerouslySetInnerHTML={createMarkup()}
									>
										{readMore
											? parse(description.concat(`<p className=dots></p>`), {
													trim: true,
													replace: ({ attribs }) => {
														if (attribs && attribs.classname === 'dots') {
															return (
																<a
																	href='#product-description-box'
																	className='product-description-btn-less'
																	onClick={() =>
																		this.setState({
																			readMore: !readMore,
																		})
																	}>
																	Read less
																</a>
															);
														}
													},
											  })
											: parse(
													description
														.substring(0, 180)
														.concat(`<span className=dots> .....</span>`),
													{
														trim: true,
														replace: ({ attribs }) => {
															if (attribs && attribs.classname === 'dots') {
																return (
																	<span className='dots'>
																		.....
																		<a
																			href='#product-description-box'
																			className='product-description-btn-more'
																			onClick={() =>
																				this.setState({
																					readMore: !readMore,
																				})
																			}>
																			Read more
																		</a>
																	</span>
																);
															}
														},
													},
											  )}
									</div>
								) : (
									<div
										id='product-description-box'
										className='product-description-box'>
										{parse(description)}
									</div>
								)}
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
