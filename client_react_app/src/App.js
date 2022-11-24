import { useState } from 'react';
import { ethers } from "ethers";
import abi from './artifacts/contracts/bookStore.sol/bookStore.json';
import './App.css';
//require('dotenv').config();
var ownerOfBook;
function App () {
  
    const [cid,setCid] = useState("");
    const [Name,setaName] = useState("");
    const [description,setDescription] = useState("");
    const [price,setPrice] = useState("");
    const [currentAccount, setCurrentAccount] = useState("");
    //var ownerOfBook;
  //This function will connect to metamask and get the connected account of the owner

  const handleMetamask = async() => {
  document.getElementById('connect-button').addEventListener('click',event =>{
    let account;
    const { ethereum } = window;
    ethereum.request({method: 'eth_requestAccounts'}).then(accounts =>{
      ownerOfBook = accounts[0];
      console.log("type",typeof(ownerOfBook));
      console.log("add",ownerOfBook);
      alert("Currently you are submitting your book using this address : "+ownerOfBook);
    })
  
  })
}
//This function will handle when the user submits the information

const handleSubmit = async() => {
  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(ethereum, "any");
  const signer = provider.getSigner();
  const addData = new ethers.Contract(
          "0xe1D37698dCc19b9dc495bb4747BA3a15b89e7DCA",
          abi.abi,
          signer
        );
  //console.log("dont step 1");
  //console.log("secong value",ownerOfBook);
  const additionTx = await addData.setBookData(ownerOfBook,Name,price,description,cid);
  //console.log("dont step 2");
  await additionTx.wait();
  //console.log("data is shared");
  

}

  

  
  return (
    <div>
      <header>
        <button id="connect-button" onClick={handleMetamask}> Connect MetaMask</button>
        <h1>test</h1>
        CID: <input placeholder='Enter you cid' type='text' onChange={(e) =>{setCid(e.target.value)}} value={cid}></input>
        Name of cid is :
        <input placeholder='Enter name of book' type='text' onChange={(e) =>{setaName(e.target.value)}} value={Name}></input>
        Describe your book: <input placeholder='Enter description' type='text' onChange={(e) =>{setDescription(e.target.value)}} value={description}></input>
        Enter the price of book:<input placeholder='Enter price' type='text' onChange={(e) =>{setPrice(e.target.value)}} value={price}></input> 
        <button type='submit' onClick={handleSubmit}>click to submit the data</button>
      </header>
    </div>
  )
  
}

export default App
