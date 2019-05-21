import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { MatSnackBar } from '@angular/material';

declare let require: any;
const inx_artifacts = require('../../../build/contracts/INX.json');

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {
  accounts: string[];
  InternCoin: any;

  model = {
    amount: 5,
    receiver: '',
    balance: 0,
    account: ''
  };

  status = '';

  constructor(private web3Service: Web3Service, private matSnackBar: MatSnackBar) {
    console.log('Constructor: ' + web3Service);
  }

  ngOnInit(): void {
    console.log('OnInit: ' + this.web3Service);
    console.log(this);
    this.watchAccount();
    this.web3Service.artifactsToContract(inx_artifacts)
      .then((InternCoinAbstraction) => {
        this.InternCoin = InternCoinAbstraction;
        this.InternCoin.deployed().then(deployed => {
          console.log(deployed);
          deployed.Transfer({}, (err, ev) => {
            console.log('Transfer event came in, refreshing balance');
            this.refreshBalance();
          });
        });

      });
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.model.account = accounts[0];
      this.refreshBalance();
    });
  }

  setStatus(status) {
    this.matSnackBar.open(status, null, { duration: 3000 });
  }

  async sendCoin() {
    if (!this.InternCoin) {
      this.setStatus('InternCoin is not loaded, unable to send transaction');
      return;
    }

    const amount = this.model.amount;
    const receiver = this.model.receiver;

    console.log('Sending coins' + amount + ' to ' + receiver);

    this.setStatus('Initiating transaction... (please wait)');
    try {
      const deployedInternCoin = await this.InternCoin.deployed();
      const transaction = await deployedInternCoin.transfer.sendTransaction(receiver, amount, { from: this.model.account });

      if (!transaction) {
        this.setStatus('Transaction failed!');
      } else {
        this.setStatus('Transaction complete!');
      }
    } catch (e) {
      console.log(e);
      this.setStatus('Error sending coin; see log.');
    }
  }

  async refreshBalance() {
    console.log('Refreshing balance');

    try {
      const deployedInternCoin = await this.InternCoin.deployed();
      console.log(deployedInternCoin);
      console.log('Account', this.model.account);
      const InternCoinBalance = await deployedInternCoin.balanceOf(this.model.account);
      console.log('Found balance: ' + InternCoinBalance);
      this.model.balance = InternCoinBalance;
    } catch (e) {
      console.log(e);
      this.setStatus('Error getting balance; see log.');
    }
  }

  setAmount(e) {
    console.log('Setting amount: ' + e.target.value);
    this.model.amount = e.target.value;
  }

  setReceiver(e) {
    console.log('Setting receiver: ' + e.target.value);
    this.model.receiver = e.target.value;
  }

}
