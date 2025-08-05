import Web3 from 'web3';

class web3Rpc {

  connectImTokenWallet = async () => {
    // if (typeof window.ethereum !== 'undefined') {
    //   try {
    //     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    //     const web3 = new Web3(window.ethereum);
  
    //     const account = accounts[0];
    //     console.log("连接成功，钱包地址为33：", account);
    //     const balance = await web3.eth.getBalance(account);
    //     console.log("余额（Wei）:", balance);
    //   } catch (error) {
    //     console.error("连接失败：", error);
    //   }
    // } else {
    //   alert("请在 imToken 或支持的 Web3 钱包浏览器中打开此页面");
    // }
  }

}

export const ERC20_ABI = [
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ name: "success", type: "bool" }],
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function"
  }
];

export const contractAddress = "0x977d8aFc1a0086Bcb03eD871DbCFeC99908A675C";

export default web3Rpc;
