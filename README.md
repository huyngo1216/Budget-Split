## Splitting Expenses

This application enables you to split expenses with your roommate(s). Using [Plaid](https://plaid.com/) to retrieve expenses, the user supplies the number of days to go back for a list of expenses, ordered by date. The server is a simple Express Node.js application and the client is written in React - all packages are managed via npm.

## Plaid API Keys
You'll have to register for an account on Plaid and generate `development` environment API keys. If you purely want to test, Plaid accounts automatically come with `sandbox` credentials without having to ask.

## Building
* Add your Plaid client + client secret to the `docker-compose.yml` file via the `environment` block with variables `PLAID_CLIENT_ID` and `PLAID_CLIENT_SECRET`.
* You'll have to have Docker + Docker CLI installed but after that, you're set.
* `docker-compose up` and visit `localhost:3000` to get started.