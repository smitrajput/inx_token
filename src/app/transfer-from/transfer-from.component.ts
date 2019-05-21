import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { MatSnackBar } from '@angular/material';

declare let require: any;
const inx_artifacts = require('../../../build/contracts/INX.json');

@Component({
  selector: 'app-transfer-from',
  templateUrl: './transfer-from.component.html',
  styleUrls: ['./transfer-from.component.css']
})
export class TransferFromComponent implements OnInit {
  accounts: string[];
  InternCoin: any;

  model = {
    amount: 5,
    sender: '',
    receiver: '',
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
          });
        });

      });
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.model.account = accounts[0];
    });
  }

  setStatus(status) {
    this.matSnackBar.open(status, null, { duration: 3000 });
  }

  async sendCoinFrom() {
    if (!this.InternCoin) {
      this.setStatus('Metacoin is not loaded, unable to send transaction');
      return;
    }

    const sender = this.model.sender;
    const amount = this.model.amount;
    const receiver = this.model.receiver;

    console.log('Sending coins ' + amount + ' from ' + sender + ' to ' + receiver);

    this.setStatus('Initiating transaction... (please wait)');
    try {
      const deployedInternCoin = await this.InternCoin.deployed();

      const transaction = await deployedInternCoin.transferFrom.sendTransaction(sender, receiver, amount, { from: this.model.account });

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

  setAmount(e) {
    console.log('Setting amount: ' + e.target.value);
    this.model.amount = e.target.value;
  }

  setReceiver(e) {
    console.log('Setting receiver: ' + e.target.value);
    this.model.receiver = e.target.value;
  }

  async setSender(e) {
    console.log('Setting sender: ' + e.target.value);
    this.model.sender = e.target.value;
    const deployedInternCoin = await this.InternCoin.deployed();
    console.log(deployedInternCoin.getAllowance(this.model.sender, this.model.account));
  }
}
