import { useEffect, useState } from 'react';

import { ethers } from 'ethers';
import Todo from './Todo';

const contractAddress = '0x2551441a4530B8291E46Da547993Fc9e6Ae7C0d1';
const abi =  [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "taskId",
        "type": "uint256"
      }
    ],
    "name": "AddTask",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "taskId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "completed",
        "type": "bool"
      }
    ],
    "name": "CompleteTask",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "body",
        "type": "string"
      }
    ],
    "name": "addTask",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_taskId",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "completed",
        "type": "bool"
      }
    ],
    "name": "completeTask",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_taskId",
        "type": "uint256"
      }
    ],
    "name": "deleteTask",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMyTasks",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "body",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "completed",
            "type": "bool"
          }
        ],
        "internalType": "struct todo.Task[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTaskCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "taskId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, abi, signer);


function Home() {

  const [totalTasks, setTotalTasks] = useState(0);
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const [balance, setBalance] = useState();
  const [account, setAccount] = useState();
    
    const getBalance = async () => {
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(account);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(account);
        setBalance(ethers.utils.formatEther(balance));
    };
  
  const onChangeBody = (e) => {
    setTask(e.target.value);
  };

  useEffect( () => {
    getBalance();
     getCount();
  }, []);

  const getCount = async () => {
    const count = await contract.getTaskCount();
    console.log(parseInt(count));
    setTotalTasks(parseInt(count));
  };


  const addTask = async () => {
    await contract.addTask(task);
    console.log("newtask " + task);
  };

  const showTasks = async () => {
    const data = await contract.getMyTasks()
    console.info('data', data)
    setTasks(data);
  }

  return (
    <div>
        <h5>Your Balance: {balance}</h5>
        <button onClick={() => showTasks()}>Show My Balance</button>
        <h2> Total task {totalTasks}</h2>

        { totalTasks && (
          tasks.map((item, index) => {
            return (<Todo key={index} id={item[0]} body={item[1]} completed={item[2]} />)
          })
        )}

        <textarea rows={4} value={task} onChange={onChangeBody} />
        <button className="addTaskBtn" onClick={addTask}>Add Task</button>

    </div>
  );
}

export default Home;