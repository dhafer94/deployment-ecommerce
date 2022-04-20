import React, { PureComponent } from 'react';
import './ProductProfile.styles.scss';
import Attribute from '../Attribute/Attribute.Component';
import AddToCartButton from '../AddToCartButton/AddToCartButton.Component';
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
								<Attribute
									inStock={inStock}
									id={id}
									handleAttributeClick={handleAttributeClick}
									attributes={attributes}
								/>
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
								{/* {inStock ? ( */}
								<AddToCartButton
									btnname='pdp'
									inStock={inStock}
									handleAddToCart={this.props.handleAddToCart}
									id={id}
								/>
								{/* ) : (
									<button className='add-to-cart-btn-inactive'>
										out of stock
									</button>
								)} */}
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
