pragma solidity ^0.8.15;
import "@openzeppelin/contracts/utils/Counters.sol";

contract bookStore {
    // //declaring counters for index of bookData array

    // using Counters for Counters.Counter;
    // Counters.Counter private _bookIds;

    //creating the structure for storing the information about books

    struct bookData {
        string bookName;
        uint256 bookPrice;
        string bookDescription;
        string ipfsLink;
       // uint256 index;
    }

    //a particular owner can own multiple books therefore map of struct array is creating

    mapping(address => bookData[]) public ownerToBook;

    //creating a hashtable like structure for every owner, for every owner 1 will be marked to its address

    mapping(address => uint32) public ownerPresent;

    //function for new Owners
    function setBookData(
        address _owner,
        string memory _bookName,
        uint256 _bookPrice,
        string memory _bookDescription,
        string memory _ipfsLink
    ) public {
            ownerToBook[_owner].push(bookData(_bookName,_bookPrice,_bookDescription,_ipfsLink));
    }
}
