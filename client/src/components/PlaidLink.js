import React from 'react'
import PlaidLink from 'react-plaid-link';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';

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
            env: 'sandbox',
            key: '3015a68e34d69730c6e3126d102046',
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
                    variant='contained'
                    color='primary'>
                    Login
                </Button>
                {this.state.loading && <LinearProgress />}
            </div>
        )
    }
}
export default PlaidLinkLogin;