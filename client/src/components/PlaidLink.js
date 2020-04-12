import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';

class PlaidLinkLogin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
        this.onEvent = this.onEvent.bind(this);
        this.onExit = this.onExit.bind(this);
        this.onSuccess = this.onSuccess.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        const plaid = document.createElement('script');
        plaid.type = 'text/javascript';
        plaid.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';

        document.head.appendChild(plaid);
    }

    onEvent() {
        this.setState({loading: true});
    }
  
    onExit() {
        this.setState({loading: false});
    }

    onSuccess(public_token, metadata) {
        this.props.onSuccessHandler(public_token, metadata);
        this.setState({loading: false});
    }

    onClick() {
        window.Plaid.create({
            clientName: 'HuyNgo',
            env: process.env.REACT_APP_PLAID_ENV,
            key: process.env.REACT_APP_PLAID_PUBLIC_KEY,
            product: ['auth', 'transactions'],
            onSuccess: this.onSuccess,
            onExit: this.onExit,
            onEvent: this.onEvent,
          }).open();
    }

    render () {
        return (
            <div>
                <Button id='plaid-login'
                    onClick={this.onClick}
                    variant='primary'>
                    Login
                </Button>
                {this.state.loading && <ProgressBar />}
            </div>
        )
    }
}
export default PlaidLinkLogin;