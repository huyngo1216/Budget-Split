import React from 'react'
import '../index.css';
import PlaidLinkLogin from './PlaidLink';
import TransactionsTable from './TransactionsTable';
import Amount from './Amount';
import GenericModal from './GenericModal';
import uuid from 'uuid';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import {generateChargeStrings} from '../utils/chargeDescription';
import {post} from '../utils/remoteCalls';


class Transactions extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        loggedIn: false,
        transactions: [],
        total: 0,
        splitTotal: 0,
        dayOffset: 10,
        showChargeDescription: false
      }
      this.onSuccess = this.onSuccess.bind(this);
      this.toggleTransactionVisibility = this.toggleTransactionVisibility.bind(this);
      this.redistributeSplitEvent = this.redistributeSplitEvent.bind(this);
      this.redistributeSplit = this.redistributeSplit.bind(this);
      this.dayOffsetChange = this.dayOffsetChange.bind(this);
      this.calcTotalWithDivisor = this.calcTotalWithDivisor.bind(this);
      this.renderLogin = this.renderLogin.bind(this);
      this.renderTransactions = this.renderTransactions.bind(this);
      this.renderRequestDescription = this.renderRequestDescription.bind(this);
      this.generateRequestDescription = this.generateRequestDescription.bind(this);
      this.hideChargeModal = this.hideChargeModal.bind(this);
    }

    generateRequestDescription() {
      this.setState(() => ({
        showChargeDescription: true
      }));
    }

    hideChargeModal() {
      this.setState(() => ({
        showChargeDescription: false
      }));
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

    async onSuccess(public_token, metadata) {
      await post('http://localhost:8000/retrieve_transactions',
        JSON.stringify({
          public_token,
          dayOffset: this.state.dayOffset
        }),
        res => {
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
          });
        }
      );
    }

    renderLogin() {
      if (!this.state.loggedIn) {
        return (
          <div className='half-wide-centered'>
              <Form.Control type='days'
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
            <div id='totals-block'>
              <Amount
                label='Total'
                value={this.state.total}
              />
              <Amount
                label='Split Total'
                value={this.state.splitTotal}
              />
            </div>
            <div className='export-btn'>
              <Button block
                onClick={this.generateRequestDescription}>
                Generate Request Description
              </Button>
            </div>
            <div>
              <TransactionsTable
                columnNames={['Name', 'Amount', 'Date', 'AccountName', 'Split Divisor']}
                items={this.state.transactions}
                rowChangeEvent={this.toggleTransactionVisibility}
                onSplitEvent={this.redistributeSplitEvent}
              />
            </div>
          </div>
        )
      }
    }

    renderRequestDescription() {
      if (this.state.showChargeDescription) {
        const descs = generateChargeStrings(this.state.transactions);
        return (
          <GenericModal onHide={this.hideChargeModal} lines={descs}></GenericModal>
        );
      }
    }
  
    render() {
      return (
        <div>
          {this.renderLogin()}
          {this.renderTransactions()}
          {this.renderRequestDescription()}
        </div>
      )
    }
  }

  export default Transactions;