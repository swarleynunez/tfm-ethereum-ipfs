export class BlacklistService {

    constructor(contract) {
        this.contract = contract;
    }

    // Setters
    //

    // Getters
    async isAlreadyVoted(domain, account) {

        return this.contract.isAlreadyVoted(domain, account);
    }
}
