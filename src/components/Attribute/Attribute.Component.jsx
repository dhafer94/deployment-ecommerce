import React, { PureComponent } from 'react';
import './Attribute.styles.scss';

class Attribute extends PureComponent {
	render() {
		const { attributes, handleAttributeClick, id, inStock } = this.props;

		return typeof attributes !== 'undefined' ? (
			<div>
				{attributes.map((attribute, i) =>
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
			</div>
		) : null;
	}
}
export default Attribute;
