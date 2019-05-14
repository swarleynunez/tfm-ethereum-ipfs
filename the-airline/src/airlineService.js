export class AirlineService {

    constructor(contract) {
        this.contract = contract;
    }

    async getFlights() {

        let flightsCount = await this.getFlightsCount();
        let flights = [];

        for (let i = 0; i < flightsCount; i++) {

            let flight = await this.contract.flights(i);
            flights.push(flight);
        }

        //return this.mapFlights(flights);
        return flights;
    }

    async getFlightsCount() {

        return (await this.contract.getFlightsCount()).toNumber();
    }

    buyFlight(flightIndex, from, value) {

        return this.contract.buyFlight(flightIndex, { from, value });
    }

    async getUserFlights(account) {

        let userFlightsCount = await this.getUserFlightsCount(account);
        let flights = [];

        for (let i = 0; i < userFlightsCount; i++) {

            let flight = await this.contract.usersFlights(account, i);
            flights.push(flight);
        }

        return flights;
    }

    async getUserFlightsCount(account) {

        return (await this.contract.users(account))['flightsCount'].toNumber();
    }

    redeemLoyaltyPoints(from) {

        return this.contract.redeemLoyaltyPoints({ from });
    }

    getRefundableEther(from) {

        return this.contract.getRefundableEther({ from });
    }

    /*mapFlights(flights) {

        return flights.map(flight => {
            
            return {
                origin: flight['origin'],
                destination: flight['destination'],
                price: flight['price']
            }
        })
    }*/
}
