import UserContract from '../../build/contracts/UserContract';
import contract from 'truffle-contract';

export default async (provider, address) => {

    const userContract = contract(UserContract);
    userContract.setProvider(provider);

    let instance = await userContract.at(address);
    return instance;
};
