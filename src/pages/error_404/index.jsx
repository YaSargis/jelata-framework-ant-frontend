import React from 'react';
import { Result, Button } from 'antd';

let goBack = (((LaNg || {}).goBack ||{})[LnG || 'EN'] || 'go back')
let notFound = (((LaNg || {}).notFound ||{})[LnG || 'EN'] || '404: Not found')
const Error_404 = ({history, location}) => {
	return (
		<Result
			status='404'
			title={notFound}
			subTitle={`${location.pathname + location.search + location.hash}`}
			extra={<Button type="primary" onClick={() => history.goBack()} >{goBack}</Button>}
		/>
	)
};

export default Error_404;
