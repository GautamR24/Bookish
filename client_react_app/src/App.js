import { useState } from 'react';
import { ethers } from "ethers";
import abi from './artifacts/contracts/bookStore.sol/bookStore.json';
import './App.css';
import jsonRpsLink from './rpclink.js';//this file contains the important APIs requied for this project
import smartContractAddress from './sc.js'
import React from 'react';
//require('dotenv').config();
var ownerOfBook;// this will store the metamask account address with which the user will login
var database =  new Map(); // map DS for storing the user address and the books owned by them
var temp_array_storing_input = new Array();// this will store the input values given by the user while filling the book info

/**
 * initiating the front end interaction with the deployed smart contract using ether.js
 */
const { ethereum } = window;
const provider = new ethers.providers.Web3Provider(ethereum, "any");
const signer = provider.getSigner();
const addData = new ethers.Contract(
          smartContractAddress,// Deployed smart contract address
          abi.abi,// the abi of the smart contrat
          signer // the account address with which the user has logged in 
        );

console.log(process.env);

/**
 * From here the implementation of Dapp begins
 */
function App () {
  
  /**
   * using useState to store the input values
   */
    const [cid,setCid] = useState("");
    const [Name,setaName] = useState("");
    const [description,setDescription] = useState("");
    const [price,setPrice] = useState("");
    const [currentAccount, setCurrentAccount] = useState("");
    

    

  /**
   * following function will connect to the metamask of the user and fetch its account address
   */

  const handleMetamask = async() => {
  document.getElementById('connect-button').addEventListener('click',event =>{
    let account;
    const { ethereum } = window;
    ethereum.request({method: 'eth_requestAccounts'}).then(accounts =>{
      ownerOfBook = accounts[0];
      console.log("type",typeof(ownerOfBook));
      console.log("add",ownerOfBook);
      alert("Currently you are submitting your book using this address:\n"+"\n"+ownerOfBook+"\n"+"\nIf you want to change the address then select the right\naddress and connect metamask again");
      
    })
  
  })
}

/**
 * this funtion will be triggered when user submits the information
 */

const handleSubmit = async() => {
  // const { ethereum } = window;
  // const provider = new ethers.providers.Web3Provider(ethereum, "any");
  // const signer = provider.getSigner();
  // const addData = new ethers.Contract(
  //         "0x611a32b7421741F9f18e03D2b339BD1e0eA7b316",
  //         abi.abi,
  //         signer
  //       );
  console.log("dont step 1");
  //console.log("secong value",ownerOfBook);
  // const ethPrice = ethers.utils.formatEther(price);
  const additionTx = await addData.setBookData(ownerOfBook,Name,price,description,cid);
  console.log("dont step 2");
  await additionTx.wait();
 
  alert("Cool..!"+"\n"+"You have successfully added data to smart contract");
  //console.log("data is shared");

  /**
   * storing the input values in the array, after the tx is successful
   * will show the data in a table
   */
  
  temp_array_storing_input=[{"ownerOfBook":ownerOfBook,"Name":Name,"price":price,"description":description,"cid":cid}];
  
  console.log("This is the temp array",temp_array_storing_input);
  
  /**
   * this sectin will fetch the event data emitted by the solidity smart contract and store it in DB
   */

  
  const contractEventProvider = new ethers.providers.JsonRpcProvider(jsonRpsLink);
  console.log("inside the event");
  const contract = new ethers.Contract(smartContractAddress,abi.abi,contractEventProvider);
  console.log("inside the event1");
  contract.on("ownerData",(owner,bookname,bookprice,bookdescription,ipfslink,event) => {
    let info = {
      owner:owner,
      bookname:bookname,
      bookprice:bookprice,
      bookdescription:bookdescription,
      ipfslink:ipfslink,
      event:event,
    
    }
    console.log("inside the event3");
    console.log("the event information",info);
    if(!database.has(info.owner)){
      database.set(info.owner,[
        {bookname:info.bookname,
        description:info.bookdescription,
        price:info.bookprice,
        ipfs:info.ipfslink
    }]);  
    }else{
      var temp = database.get(info.owner);
      temp.push({
        bookname:info.bookname,
        description:info.bookdescription,
        price:info.bookprice,
        ipfs:info.ipfslink
    });
     database.set(info.owner,temp);
    }
    
    console.log("This is the database",database);
    console.log("this is the value ")
  
      handleData();
    
  });

}
const handleData =()=>{
 
  
  let list = document.getElementById('myList');
  list.style.width="1000px";
  temp_array_storing_input.forEach((item) => {
    let li1 = document.createElement("li");
    let lb1 = document.createElement("br");
    li1.innerText = [`Owner: ${item.ownerOfBook}
                      Name: ${Name}
                      Description: ${description}
                      Price: ${ethers.utils.formatEther(item.price)} ETH
                      CID: ${item.cid}`];
    // lp.innerText = ['Following info is added'];
    let btn = document.createElement("button");
    btn.innerText="Buy this book";
    btn.type = "submit";
    btn.id="connect-button1";
    btn.onclick= async function(){
      var val = prompt("You are confirming following things\n1. Book: "+item.Name+"\n"+"2. Price: "+ethers.utils.formatEther(item.price)+"ETH"+"\n"+"3. Seller: "+item.ownerOfBook+"\n"+"Please type I CONFIRM below to progress");
      if(val === "I CONFIRM"){
        alert("Metamask will direct you to pay"+"\n"+ethers.utils.formatEther(item.price)+"ETH"+"\n"+"to"+"\n"+item.ownerOfBook);
        //interacting with the smart contract to initiate the transfer

        const params = [{
          from: ownerOfBook,
          to: item.ownerOfBook,
          value: ethers.utils.parseUnits(ethers.utils.formatEther(item.price), 'ether').toHexString()
        }];

        const transactionHash = await provider.send('eth_sendTransaction', params);
        console.log(`money ${ethers.utils.formatEther(item.price)}is sent to ${item.ownerOfBook} from ${ownerOfBook} with tx ${transactionHash} `);

        const iniTransfer = await addData.sendMoney(
                                                    item.cid,
                                                    ownerOfBook,
                                                  );
        await iniTransfer.wait();
        console.log("in iniTransfer");

        const contractEventProvider = new ethers.providers.JsonRpcProvider(jsonRpsLink);
        console.log("inside the event");
        const contract = new ethers.Contract(smartContractAddress,abi.abi,contractEventProvider);
        await contract.on("cidevent",(cid,add,index) =>{
          console.log("Inside cidevert");
          var print = `the ${cid} is mapped to address ${add} and index ${index}`;
          console.log(print);
        });
        console.log("after cidevent");
        await contract.on("moneytransfer",(receiver,sender,money,newIpfsValue,newCidOwner) => {
          console.log(`the ${receiver} has sent ${sender} amount of ${money} to change the ${newIpfsValue} and change cid owner to ${newCidOwner}`);
        });
        console.log("after moneytransferevent");

        console.log(`Money is transferred to ${item.ownerOfBook} with cid ${item.cid} it is received by ${ownerOfBook}`);

      }
      else{
        alert("Please type the phrase correctly");
      }
    }
    let linkToIpfs = document.createElement("a");
    linkToIpfs.innerText = "Click to See the book";
    linkToIpfs.href = `https://ipfs.io/ipfs/${item.cid}`;
    linkToIpfs.target= '_blank';
    list.appendChild(linkToIpfs);
    list.appendChild(li1);
    list.appendChild(lb1);
    list.appendChild(lb1);
    list.appendChild(btn);
    list.appendChild(lb1);
    temp_array_storing_input.length = 0;
  });

}



  
  return (
    <div className="container">
      <header>
        <div className="row">
          <center>
            <button id="connect-button" type='submit' onClick={handleMetamask}> Connect MetaMask</button>  
          </center>
        </div>
        <div id="storedbook">
          <center>
          <p><b><i>Fill Your Details</i></b></p>
          </center>
        </div>
        <div className="row">
          <div className="col-25">
            <label>CID</label>
          </div>
          <div className="col-75">
              <input type="text" id="cidname" onChange={(e) =>{setCid(e.target.value)}} value={cid}  placeholder="Your CID.."/>
          </div>
        </div>
        <div className="row">
          <div className="col-25">
            <label>Book Name</label>
          </div>
          <div className="col-75">
              <input type="text" id="bookname" onChange={(e) =>{setaName(e.target.value)}} value={Name}  placeholder="Name of the book.."/>
          </div>
        </div>
        <div className="row">
          <div className="col-25">
            <label>Price(in Wei)</label>
          </div>
          <div className="col-75">
              <input type="text" id="bookprice" onChange={(e) =>{setPrice(e.target.value)}} value={price}  placeholder="Price of the book.."/>
          </div>
        </div>
        <div className="row">
          <div className="col-25">
            <label>Short description</label>
          </div>
          <div className="col-75">
              <textarea maxLength="100" type="text" id="bookdesc" onChange={(e) =>{setDescription(e.target.value)}} value={description}  placeholder="description of the book.." style={{height:"75px"}}/>
          </div>
        </div>
        <div className="row">
          <center>
          <input type="submit"  onClick={handleSubmit} value="Submit"/>
          </center>        
        </div>
        <br></br>
        <div id="storedbook">
          <center>
            <p>
              <b>All available books will be visible here.</b>
            </p>
          </center>
        </div>
        
        <div className="row">
        <div className='column'>
          <ul id="myList"></ul>
        </div>
        </div>
        <br></br>
      </header>
      
      
    </div>
    
  )
  
}

export default App
