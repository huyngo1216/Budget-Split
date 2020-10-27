const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const plaid = require('plaid')
const moment = require('moment')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config();
const port = process.env.PORT || 8000;

const clientId = process.env.PLAID_CLIENT_ID;
const clientSecret = process.env.PLAID_CLIENT_SECRET;
const plaidEnv = process.env.PLAID_ENVIRONMENT;
const client = new plaid.Client({
    clientID: clientId,
    secret: clientSecret,
    env: plaid.environments[plaidEnv]
});
app.use(bodyParser.urlencoded({
    extended: false
  }));
app.use(bodyParser.json());
app.use(express.static('public'))
app.use(cors());

app.post('/create_link_token', async function(request, response) {
    // 1. Grab the client_user_id by searching for the current user in your database
    // 2. Create a link_token for the given user
    const linkTokenResponse = await client.createLinkToken({
      user: {
        client_user_id: 'huyngo',
      },
      client_name: 'HuyNgo',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en'
    });
    const link_token = linkTokenResponse.link_token;
    // 3. Send the data to the client
    response.json({ link_token });
});

app.post('/retrieve_transactions', function (req, res) {
    const publicToken = req.body.public_token;
    client.exchangePublicToken(publicToken, function(error, accessTokenResponse) {
        if (error) {
            console.log(error);
        }
        const accessToken = accessTokenResponse.access_token;
        const itemId = accessTokenResponse.item_id;
        const dayOffset = req.body.dayOffset || 10;
        client.getTransactions(
            accessToken,
            moment().subtract(dayOffset, 'days').format('YYYY-MM-DD'),
            moment().format('YYYY-MM-DD'),
            function(error, transactionResponse) {
                if (error) {
                    console.log(error);
                }

                res.json({
                    transactions: transactionResponse.transactions
                        .map((transaction) => {
                            return {
                                name: transaction.name,
                                amount: transaction.amount,
                                date: transaction.date,
                                pending: transaction.pending,
                                accountName: transactionResponse.accounts
                                    .find((account) => transaction.account_id === account.account_id).official_name,
                            }
                        })
                        .sort((a, b) => {
                            return Date.parse(a.date) - Date.parse(b.date);
                        })
                })
            }
        )
    });
})

app.get('/categories', function(req, res) {
    client.getCategories(function(err, response) {
        if (err) {
            console.log(err);
        }
        res.send(response);
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))