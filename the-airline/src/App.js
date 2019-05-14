import React, { Component } from 'react';
import Panel from './Panel';
import getWeb3 from './getWeb3';
import AirlineContract from './airline';
import { AirlineService } from './airlineService';
import { ToastContainer } from 'react-toastr';

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
            account: undefined,
            balance: 0,
            flights: [],
            userFlights: [],
            refundableEther: 0
        };
    }

    // First executed function
    async componentDidMount() {

        // Instances
        this.web3 = await getWeb3();
        this.airline = await AirlineContract(this.web3.currentProvider);
        this.airlineService = new AirlineService(this.airline);

        // Utils
        this.toEther = converter(this.web3);

        // Permissions to access MetaMask accounts
        await ethereum.enable();

        // Initial state
        let account = (await this.web3.eth.getAccounts())[0];

        // Set current account and load data
        this.setState({
            account: account.toLowerCase()
        }, () => {
            this.load();
        });

        // Update data when account is changed in MetaMask
        this.web3.currentProvider.publicConfigStore.on('update', async function (event) {

            if (event.selectedAddress !== undefined) {

                this.setState({
                    account: event.selectedAddress.toLowerCase()
                }, () => {
                    this.load();
                });
            }
        }.bind(this));

        // Events
        this.airline.onFlightPurchase((error, event) => {

            const { user, origin, destination, price } = event.args;

            if (user.toLowerCase() === this.state.account) {

                console.log(`You have purchased a flight from ${origin} to ${destination} with a cost of ${this.toEther(price)} ETH`);
            }
            else {
                this.container.success(
                    `Somebody has purchased a flight from ${origin} to ${destination} with a cost of ${this.toEther(price)} ETH`,
                    <strong>Airline Information</strong>
                );
            }
        });
    }

    // Second executed function
    async load() {

        this.getBalance();
        this.getFlights();
        this.getUserFlights();
        this.getRefundableEther();
    }

    async getBalance() {

        let weiBalance = await this.web3.eth.getBalance(this.state.account);
        this.setState({
            balance: this.toEther(weiBalance)
        });
    }

    async getFlights() {

        let flights = await this.airlineService.getFlights();
        this.setState({
            flights
        });
    }

    async buyFlight(flightIndex, flight) {

        await this.airlineService.buyFlight(flightIndex, this.state.account, flight.price);
    }

    async getUserFlights() {

        let userFlights = await this.airlineService.getUserFlights(this.state.account);
        this.setState({
            userFlights
        });
    }

    async redeemLoyaltyPoints() {

        await this.airlineService.redeemLoyaltyPoints(this.state.account);
    }

    async getRefundableEther() {

        let refundableEther = this.toEther(await this.airlineService.getRefundableEther(this.state.account));
        this.setState({
            refundableEther
        });
    }

    render() {
        return <React.Fragment>
            <div className="jumbotron">
                <h4 className="display-4">Welcome to the Airline!</h4>
            </div>

            <div className="row">
                <div className="col-sm">
                    <Panel title="Profile">
                        {this.state.account ? <p><strong>Address: </strong>{this.state.account}</p> : undefined}
                        {this.state.balance ? <span><strong>Balance: </strong>{this.state.balance} ETH</span> : undefined}
                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Loyalty points">
                        {this.state.refundableEther ?
                            <div>
                                <span><strong>Refundable: </strong>{this.state.refundableEther} ETH</span>
                                <button className="btn btn-success btn-sm" onClick={() => this.redeemLoyaltyPoints()}>Refund</button>
                            </div>
                            : undefined}
                    </Panel>
                </div>
            </div>
            <div className="row">
                <div className="col-sm">
                    <Panel title="Available flights">
                        {this.state.flights.length > 0 ?
                            this.state.flights.map((flight, i) => {
                                return <div key={i}>
                                    <span>{flight.origin} --> {flight.destination} <strong>({this.toEther(flight.price)} ETH)</strong></span>
                                    <button className="btn btn-success btn-sm" onClick={() => this.buyFlight(i, flight)}>Buy</button>
                                </div>
                            })
                            : 'Empty'}
                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Your flights">
                        {this.state.userFlights.length > 0 ?
                            this.state.userFlights.map((flight, i) => {
                                return <div key={i}>
                                    <span>{flight.origin} --> {flight.destination} <strong>({this.toEther(flight.price)} ETH)</strong></span>
                                </div>
                            })
                            : 'Empty'}
                    </Panel>
                </div>
            </div>
            <ToastContainer ref={(ref) => this.container = ref} className="toast-top-right" />
        </React.Fragment>
    }
}
