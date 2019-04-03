import React from 'react';
import './CardBackground.css';

const CardBackground = props => {
	console.log(props);
	return (
		<div className='card-background'>
			<img src={props.image.url} alt='Card background' />
		</div>
	);
};

export default CardBackground;
