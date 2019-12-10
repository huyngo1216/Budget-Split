## Splitting Expenses

This application enables you to split expenses with your roommate(s). Using [Plaid](https://plaid.com/) to retrieve expenses, the user supplies the number of days to go back for a list of expenses, ordered by date. The server is a simple Express Node.js application and the client is written in React - all packages are managed via npm.

## Building

### Plaid API Keys
You'll have to register for an account on Plaid and generate `development` environment API keys. If you purely want to test, Plaid accounts automatically come with `sandbox` credentials without having to ask.

### Server
```
1. specify Plaid configuration in `.env`
2. npm install
3. node app.js
```

### Client
```
1. specify Plaid client configuration in `client/.env`
2. npm install
3. npm start
```