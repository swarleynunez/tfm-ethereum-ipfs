import BlacklistContract from '../../build/contracts/BlacklistContract';
import contract from 'truffle-contract';

export default async (provider, address) => {

    const blacklistContract = contract(BlacklistContract);
    blacklistContract.setProvider(provider);

    let instance = await blacklistContract.at(address);
    return instance;
};
