export class UserService {

    constructor(contract, web3) {
        this.contract = contract;
        this.web3 = web3;
    }

    // Functions
    async isDomainOwnedByUser(domain) {

        let resourcesCount = await this.getResourcesCount();

        for (let i = 0; i < resourcesCount; i++) {

            if (await this.contract.resources(i) == domain) return true;
        }

        return false;
    }

    async getUserResources() {

        let resourcesCount = await this.getResourcesCount();
        let resources = [];

        for (let i = 0; i < resourcesCount; i++) {

            let resource = await this.contract.resources(i);
            resources.push(resource);
        }

        return resources;
    }

    async getResourcesCount() {

        return (await this.contract.getResourcesCount()).toNumber();
    }

    async getUserFollowings() {

        let followingsCount = await this.getFollowingsCount();
        let followings = [];

        for (let i = 0; i < followingsCount; i++) {

            let following = await this.contract.followings(i);
            followings.push(following);
        }

        return followings;
    }

    async getFollowingsCount() {

        return (await this.contract.getFollowingsCount()).toNumber();
    }

    async isAlreadyFollowed(account) {

        return this.contract.isAlreadyFollowed(account);
    }

    async getUserCountry() {

        let hexCountry = await this.contract.country();
        return this.web3.utils.hexToUtf8(hexCountry);
    }
}
