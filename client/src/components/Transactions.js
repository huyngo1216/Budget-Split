import React from 'react'
import '../index.css';
import PlaidLinkLogin from './PlaidLink';
import TransactionsTable from './TransactionsTable';
import Amount from './Amount';
import TextField from '@material-ui/core/TextField';
import uuid from 'uuid';

class Transactions extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        loggedIn: false,
        transactions: [],
        total: 0,
        splitTotal: 0,
        dayOffset: 10,
      }
      this.onSuccess = this.onSuccess.bind(this);
      this.toggleTransactionVisibility = this.toggleTransactionVisibility.bind(this);
      this.redistributeSplitEvent = this.redistributeSplitEvent.bind(this);
      this.redistributeSplit = this.redistributeSplit.bind(this);
      this.dayOffsetChange = this.dayOffsetChange.bind(this);
      this.calcTotalWithDivisor = this.calcTotalWithDivisor.bind(this);
      this.renderLogin = this.renderLogin.bind(this);
      this.renderTransactions = this.renderTransactions.bind(this);
    }

    calcTotalWithDivisor = (transactions = []) => (withDivisor = false) => {
      return transactions
        .filter((transaction) => transaction.hidden === false)
        .reduce(
          (accumulator, transaction) => {
              return accumulator + transaction.amount/(withDivisor ? transaction.divisor : 1)
          },
          0
        );
    }

    toggleTransactionVisibility(id) {
      const transactions = this.state.transactions.map((transaction) => {
        if (transaction.id === id) {
          transaction.hidden = !transaction.hidden;
        }
        return transaction;
      })
      const curryTransactions = this.calcTotalWithDivisor(transactions)

      this.setState(() => ({
            transactions: transactions,
            total: curryTransactions(false),
            splitTotal: curryTransactions(true),
        })
      )
    }

    redistributeSplitEvent(id, e) {
        this.redistributeSplit(e.target.value * 1)([id]);
    }

    redistributeSplit = (divisor = 1) => {
      // TODO: add regex check for divisor argument
      return (transactionIds = []) => {
        this.setState((state) => ({
          splitTotal: state.transactions
              .filter((transaction) => transaction.hidden === false)
              .reduce(
                (accumulator, transaction) => {
                  if (transactionIds.includes(transaction.id)) {
                    transaction.divisor = divisor;
                  }
                  return accumulator + transaction.amount / transaction.divisor;
                },
                0
              )
          })
        )
      }
    }

    dayOffsetChange(e) {
        this.setState({dayOffset: e.target.value * 1});
    }

    onSuccess(public_token) {
      fetch('http://localhost:8000/retrieve_transactions',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            public_token,
            dayOffset: this.state.dayOffset
          }),
        }
      ).then(res => {
        res.json().then(data => {
          const curryCalcTotal = this.calcTotalWithDivisor(data.transactions);
          this.setState({
              transactions: data.transactions.filter((transaction) => transaction.amount > 0)
                .map((transaction) => {
                  // all transactions are included by default
                  transaction.hidden = false;
                  // default behavior is to split the cost evenly
                  transaction.divisor = 2;
                  transaction.id = uuid.v4();
                  return transaction;
                }),
              total: curryCalcTotal(),
              splitTotal: curryCalcTotal(true),
              loggedIn: true,
          })
        })
      });
    }

    renderLogin() {
      if (!this.state.loggedIn) {
        return (
          <div className='half-wide-centered'>
              <TextField
                label='Day Offset'
                value={this.state.dayOffset}
                onChange={this.dayOffsetChange} />
              <PlaidLinkLogin
                onSuccessHandler={this.onSuccess} />
          </div>
        )
      }
    }

    renderTransactions() {
      if (this.state.loggedIn) {
        return (
          <div>
            <Amount
              label='Total'
              value={this.state.total}
            />
            <Amount
              label='Split Total'
              value={this.state.splitTotal}
            />
            <TransactionsTable
              columnNames={['Name', 'Amount', 'Date', 'AccountName', 'Split Divisor']}
              items={this.state.transactions}
              rowChangeEvent={this.toggleTransactionVisibility}
              onSplitEvent={this.redistributeSplitEvent}
            />
          </div>
        )
      }
    }
  
    render() {
      return (
        <div>
          {this.renderLogin()}
          {this.renderTransactions()}
        </div>
      )
    }
  }

  export default Transactions;