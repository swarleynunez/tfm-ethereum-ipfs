import React, { Component } from 'react';
import getWeb3 from './getWeb3';

// Utils
const converter = (web3) => {

    return (value) => {
        return web3.utils.fromWei(value, 'ether');
    }
}

// React component
export class App extends Component {

    constructor(props) {

        super(props);

        this.state = {
            account: undefined
        };
    }

    // First executed function
    async componentDidMount() {

        // Instances
        this.web3 = await getWeb3();

        // Utils
        this.toEther = converter(this.web3);

        // Check permission to access MetaMask accounts
        await this.web3.currentProvider.enable();

        // Get initial account
        let account = (await this.web3.eth.getAccounts())[0];

        // Set initial state and refresh data
        this.setState({
            account: account.toLowerCase()
        }, () => {
            this.refresh();
        });

        // Update data when account is changed in MetaMask
        this.web3.currentProvider.on('accountsChanged', function (accounts) {

            if (accounts[0] !== undefined) {

                this.setState({
                    account: accounts[0].toLowerCase()
                }, () => {
                    this.refresh();
                });
            }
        }.bind(this));

        // Events
        //
    }

    // Second executed function
    async refresh() {

    }

    // Functions
    //

    render() {
        return <React.Fragment>
            <div className="jumbotron">
                <h4 className="display-4">Sentinel</h4>
            </div>
            <div className="row">
                <div className="col-sm">

                </div>
                <div className="col-sm">

                </div>
            </div>
            <div className="row">
                <div className="col-sm">

                </div>
                <div className="col-sm">

                </div>
            </div>
        </React.Fragment>
    }
}
