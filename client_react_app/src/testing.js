// code for deployment of smart contract using hardhat

const { ethers } = require('hardhat');
const hre = require('hardhat');
const { experimentalAddHardhatNetworkMessageTraceHook } = require('hardhat/config');

async function main(){
    const [owner] = await hre.ethers.getSigners();
    const contractBook = await hre.ethers.getContractFactory('book');
    const contractBook_deployed =  await contractBook.deploy();
    await contractBook_deployed.deployed();
}

// code for conneting to the front end using ethers

const{ethereum} = window;
const provider =  new ethers.providers.Web3Provider(ethereum,"any");
const signer = provider.getSigner();
const addData = new ethers.Contract("address",abi.abi,signer);
const tx = await addData.methodNamePresentInTheSmartContract("pass on the required parameters");

//this function will help in connecting to the metamask

const handleMetmask = async() =>{
    document.getElementById('connect').addEventListener('click',event =>{
        let account;
        const {ethereum} =  window;
        ethereum.request({method:'eth_requestAccount'}).then(accounts => {
            account = accounts[0];
        })
    })
}


//how to read the events emitted by the deployed contract using ether

const provider = new  ethers.providers.JsonRpcProvider("testnet api");
const contract = new ethers.contract("add",abi.abi,provider);
contract.on("eventName",("parameters of the event") =>{
    // whatever you want to do with the parameters write the logic here
})


//sending ethers using metamask

const param = [{
    from: "address",
    to: "address",
    value: ethers.utils.parseUnits(ethers.utils.formatEthers(price),'ether').toHexString()
}];

const tx = await provider.send('eth_sendTransaction',param);


//usestate in react

import {useState} from 'react';

const [cid,setcid] = useState("");

<input type={text} onChange={(e) => {setcid(e.target.value)}} value={cid}/>