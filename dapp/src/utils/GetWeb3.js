import Web3 from 'web3';

const GetWeb3 = () => {

    return new Promise((resolve, reject) => {

        window.addEventListener('load', function () {

            if (typeof window.ethereum !== undefined || typeof window.web3 !== undefined) {

                const provider = window.ethereum || window.web3.currentProvider;
                resolve(new Web3(provider));
            }
            else {
                console.log('No provider found. Please, install Metamask.');
                reject();
            }
        });
    });
};

export default GetWeb3;
