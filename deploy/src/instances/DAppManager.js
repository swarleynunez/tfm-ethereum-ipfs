import DAppManager from '../../build/contracts/DAppManager';
import contract from 'truffle-contract';

export default async (provider) => {

    const managerContract = contract(DAppManager);
    managerContract.setProvider(provider);

    let instance = await managerContract.deployed();
    return instance;
};
