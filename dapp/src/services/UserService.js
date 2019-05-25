export class UserService {

    constructor(contract) {
        this.contract = contract;
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
}
