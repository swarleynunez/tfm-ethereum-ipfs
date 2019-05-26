export class UserService {

    constructor(contract, web3) {
        this.contract = contract;
        this.web3 = web3;
    }

    // Setters
    //

    // Getters
    async isDomainOwnedByUser(domain) {

        let resourcesCount = await this.getResourcesCount();

        for (let i = 0; i < resourcesCount; i++) {

            if (await this.contract.resources(i) == domain) return true;
        }

        return false;
    }

    async getResourcesCount() {

        return (await this.contract.getResourcesCount()).toNumber();
    }

    async isAlreadyFollowed(account) {

        return this.contract.isAlreadyFollowed(account);
    }

    async getUserCountry() {

        let hexCountry = await this.contract.country();
        return this.web3.utils.hexToUtf8(hexCountry);
    }
}
