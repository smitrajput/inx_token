import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { MatSnackBar } from '@angular/material';
declare let window: any;
declare let require: any;
const inx_artifacts = require('../../../build/contracts/INX.json');


@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.css']
})
export class ApproveComponent implements OnInit {
  accounts: string[];
  InternCoin: any;

  model = {
    amount: 5,
    spender: '',
    account: ''
  };

  status = '';

  constructor(private web3Service: Web3Service, private matSnackBar: MatSnackBar) {
    console.log('Constructor: ', web3Service);
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
            //his.refreshBalance();
          });
        });

      });
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.model.account = accounts[0];
      //this.refreshBalance();
    });
  }

  setStatus(status) {
    this.matSnackBar.open(status, null, { duration: 3000 });
  }

  async approve() {
    if (!this.InternCoin) {
      this.setStatus('InternCoin is not loaded, unable to send transaction');
      return;
    }

    const amount = this.model.amount;
    const spender = this.model.spender;

    console.log('Sending coins' + amount + ' to ' + spender);

    this.setStatus('Initiating transaction... (please wait)');
    try {
      const deployedInternCoin = await this.InternCoin.deployed();
      const transaction = await deployedInternCoin.approve.sendTransaction(spender, amount, { from: this.model.account });
      console.log(deployedInternCoin.getAllowance.call(spender, this.model.account));
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

  // async refreshBalance() {
  //   console.log('Refreshing balance');

  //   try {
  //     const deployedMetaCoin = await this.InternCoin.deployed();
  //     console.log(deployedMetaCoin);
  //     console.log('Account', this.model.account);
  //     const metaCoinBalance = await deployedMetaCoin.getBalance.call(this.model.account);
  //     console.log('Found balance: ' + metaCoinBalance);
  //     this.model.balance = metaCoinBalance;
  //   } catch (e) {
  //     console.log(e);
  //     this.setStatus('Error getting balance; see log.');
  //   }
  // }

  setAmount(e) {
    console.log('Setting amount: ' + e.target.value);
    this.model.amount = e.target.value;
  }

  setSpender(e) {
    console.log('Setting spender: ' + e.target.value);
    this.model.spender = e.target.value;
  }

}
