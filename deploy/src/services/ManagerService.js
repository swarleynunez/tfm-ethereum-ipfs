import WolframAlphaAPI from 'wolfram-alpha-api';

export class ManagerService {

    constructor(contract, web3) {
        this.contract = contract;
        this.web3 = web3;
        this.wolframAlpha = WolframAlphaAPI('9636L9-JUV6VLQ8HY');
    }

    // Setters
    async publishNewResource(domain, ipnsHash, resourceCountry, from) {

        let country = await this.web3.utils.utf8ToHex(resourceCountry);

        return this.contract.publishNewResource(domain, ipnsHash, country, { from: from, gas: 500000 });
    }

    async registerUser(userCountry, from) {

        let country = await this.web3.utils.utf8ToHex(userCountry);

        return this.contract.registerUser(country, { from });
    }

    async deployNewBlacklist(blacklistCountry, from) {

        let country = await this.web3.utils.utf8ToHex(blacklistCountry);
        let votesLimit = await this.getWolframAlphaData(blacklistCountry);

        return this.contract.deployNewBlacklist(country, votesLimit, { from });
    }

    async voteResource(domain, from) {

        return this.contract.voteResource(domain, { from: from, gas: 100000 });
    }

    async manageUserFollowings(account, from) {

        return this.contract.manageUserFollowings(account, { from: from, gas: 100000 });
    }

    // Getters
    async searchResource(domain) {

        let resource = await this.contract.searchResource(domain);

        return {
            ipnsHash: resource[0],
            country: await this.web3.utils.hexToUtf8(resource[1]),
            level: await this.web3.utils.hexToNumber(resource[2])
        }
    }

    async getDeployedBlacklists() {

        let blacklistsCount = await this.getBlacklistsCount();
        let blacklists = [];

        for (let i = 0; i < blacklistsCount; i++) {

            let hexCountry = await this.contract.blacklistsDeployed(i);
            let countryCode = await this.web3.utils.hexToUtf8(hexCountry);
            blacklists.push(countryCode);
        }

        return blacklists;
    }

    async getBlacklistsCount() {

        return (await this.contract.getBlacklistsCount()).toNumber();
    }

    async getWolframAlphaData(blacklistCountry) {

        let internetUsage = 0;
        let gdpPerCapita = 0;
        let maxGdp = 0;

        await this.wolframAlpha.getShort(`${blacklistCountry} country internet usage`).then((data) => {

            let values = data.match(/\d+(.\d+)?/g);

            if (values.length > 0) {

                if (data.includes('million')) internetUsage = Number(values[0]) * Math.pow(10, 6);
                else if (data.includes('billion')) internetUsage = Number(values[0]) * Math.pow(10, 9);
                else internetUsage = values[0];
            }

        });

        await this.wolframAlpha.getShort(`${blacklistCountry} country GDP per capita`).then((data) => {

            let values = data.match(/\d+(.\d+)?/g);

            if (values.length > 0) gdpPerCapita = Number(values[0]);

        });

        await this.wolframAlpha.getShort('MC country GDP per capita').then((data) => {

            let values = data.match(/\d+(.\d+)?/g);

            if (values.length > 0) maxGdp = Number(values[0]);

        });

        if (internetUsage != 0 && gdpPerCapita != 0 && maxGdp != 0) {
            
            return Math.round(Math.sqrt((gdpPerCapita / maxGdp) * internetUsage));
        }
        else return 0;
    }

    async isUserRegistered(account) {

        return this.contract.isUserRegistered(account);
    }

    async isDomainChosen(domain) {

        return this.contract.isDomainChosen(domain);
    }

    async getUserContractAddress(account) {

        return this.contract.users(account);
    }

    async getBlacklistContractAddress(blacklistCountry) {

        let country = await this.web3.utils.utf8ToHex(blacklistCountry);

        return this.contract.blacklists(country);
    }
}
