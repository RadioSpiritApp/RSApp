/**
 * @author Systango Technologies 
 * Date: Sept 25, 2018
 * Description: Common Web View !
 * 
 */

import React, {
	Component
} from 'react';

import CommonWebViewComponent from './CommonWebViewComponent';

export default class CommonWebViewContainer extends Component {
	render() {
		return (
			<CommonWebViewComponent {...this.props} />
		);
	}
}