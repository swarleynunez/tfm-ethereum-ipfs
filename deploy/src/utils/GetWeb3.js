import Web3 from 'web3';

const GetWeb3 = () => {

    return new Promise((resolve, reject) => {

        window.addEventListener('load', function () {

            if (window.ethereum != undefined || window.web3 != undefined) {

                const provider = window.ethereum || window.web3.currentProvider;
                resolve(new Web3(provider));
            }
            else reject();
        });
    });
};

export default GetWeb3;
