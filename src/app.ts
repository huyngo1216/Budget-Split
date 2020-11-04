import express from 'express';
import plaid, { Account, CreateLinkTokenResponse, TransactionsResponse } from 'plaid';
import moment from 'moment';
import cors from 'cors';

const app = express()
const port: string = process.env.PORT as string;
const clientId: string = process.env.PLAID_CLIENT_ID as string;
const clientSecret: string = process.env.PLAID_CLIENT_SECRET as string;
const plaidEnv: string = process.env.PLAID_ENVIRONMENT as string;

const client: plaid.Client = new plaid.Client({
    clientID: clientId,
    secret: clientSecret,
    env: plaid.environments[plaidEnv],
    options: {}
});

app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
app.use(express.static('public'))
app.use(cors());

app.post('/create_link_token', async (__, response: express.Response) => {
    const linkTokenResponse: CreateLinkTokenResponse = await client.createLinkToken({
      user: {
        client_user_id: 'foo',
      },
      client_name: 'foo',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en'
    });
    const link_token: string = linkTokenResponse.link_token;
    response.json({ link_token });
});

app.post('/retrieve_transactions', (req: express.Request, res: express.Response) => {
        const publicToken: string = req.body.public_token;
        client.exchangePublicToken(publicToken, function (error, accessTokenResponse) {
            if (error) {
                console.log(error);
            }
            const accessToken: string = accessTokenResponse.access_token;
            const dayOffset: number = req.body.dayOffset || 10;
            client.getTransactions(
                accessToken,
                moment().subtract(dayOffset, 'days').format('YYYY-MM-DD'),
                moment().format('YYYY-MM-DD'),
                function (error, transactionResponse: TransactionsResponse) {
                    if (error) {
                        console.log(error);
                    }
                    const accounts = transactionResponse.accounts;
                    res.json({
                        transactions: transactionResponse.transactions
                            .map((transaction) => {
                                return {
                                    name: transaction.name,
                                    amount: transaction.amount,
                                    date: transaction.date,
                                    pending: transaction.pending,
                                    accountName: accounts.find((a) => a.account_id === transaction.account_id)?.official_name
                                };
                            })
                            .sort((a, b) => {
                                return Date.parse(a.date) - Date.parse(b.date);
                            })
                    });
                }
            );
        });
    })

app.get('/categories', function(__, res: express.Response) {
    client.getCategories(function(err, response) {
        if (err) {
            console.log(err);
        }
        res.send(response);
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))