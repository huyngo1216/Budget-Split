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
    }

    componentDidMount() {
        const plaid = document.createElement('script');
        plaid.type = 'text/javascript';
        plaid.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
        const link = document.createElement('script');
        link.type = 'text/javascript';
        link.src = this.linkToken();

        document.head.appendChild(plaid);
        document.head.appendChild(link);
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

    async linkToken() {
        const fetchLinkToken = async () => {
            const response = await fetch('http://localhost:8000/create_link_token', {
                method: 'POST'
            })
            const responseJSON = await response.json();
            return responseJSON.link_token;
        }
        const configs = {
            // 1. Pass a new link_token to Link.
            token: await fetchLinkToken(),
            onSuccess: this.onSuccess,
            onExit: async function(err, metadata) {
              // 2b. Gracefully handle the invalid link token error. A link token
              // can become invalidated if it expires, has already been used
              // for a link session, or is associated with too many invalid logins.
              if (err != null && err.error_code === 'INVALID_LINK_TOKEN') {
                linkHandler.destroy();
                linkHandler = window.Plaid.create({
                  ...configs,
                  token: await fetchLinkToken(),
                });
              }
              if (err != null) {
                // Handle any other types of errors.
              }
              // metadata contains information about the institution that the
              // user selected and the most recent API request IDs.
              // Storing this information can be helpful for support.
            },
        };
        console.log('initializing');
        var linkHandler = window.Plaid.create(configs);
        document.getElementById('plaid-login').onclick = function() {
            linkHandler.open();
        };
    }
}
export default PlaidLinkLogin;