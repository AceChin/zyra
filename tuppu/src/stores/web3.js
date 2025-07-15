import { ref } from 'vue'
import { defineStore } from "pinia";
import Web3, { utils } from 'web3';
import { get, post } from '@/utils/request'
import { ERC20_ABI, contractAddress } from '@/utils/web3'
import { showToast } from "vant";
import { translate } from "../lang";


class Web3Signer {
  constructor(web3, account) {
    this.web3 = web3;
    this.account = account;
  }

  async getAddress() {
    return this.account;
  }

  async sendTransaction(tx) {
    return this.web3.eth.sendTransaction({
      ...tx,
      from: this.account
    });
  }

  async signMessage(message) {
    return this.web3.eth.personal.sign(message, this.account, '');
  }
}

export const useWeb3Store = defineStore("web3", () => {

  const chainId = ref('');
  const account = ref('');
  const accountMask = ref('')
  // const contract = ref('')
  const web3Info = ref(null)
  const signer = ref(null);
  const userInfo = ref(null)
  const balance = ref(0)
  const inviteCode = ref(null)

  const connectImTokenWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // provider.value = new ethers.providers.Web3Provider(window.ethereum);
        // signer.value = provider.value.getSigner();
        web3Info.value = web3
        account.value = accounts[0]
        signer.value = new Web3Signer(web3, account.value);
        // contract.value = new web3.eth.Contract(ERC20_ABI, contractAddress);
        // console.log(contract.value)
        console.log("连接成功，钱包地址为：", account.value);

      } catch (error) {
        console.error("连接失败：", error);
      }
    } else {
      alert("请在 imToken 或支持的 Web3 钱包浏览器中打开此页面");
    }
  }
  
  const fetchBalance = async () => {
    balance.value = await web3Info.value.eth.getBalance(account.value);
    console.log('余额为', balance.value)
  }

  const fetchChainId = async () => {
    chainId.value = await window.ethereum.request({ method: 'eth_chainId' });
    console.log('chainId', chainId.value)
    // return chainId.value == '0x38'
    return chainId.value == '0x7a69'
  }

  const changeChain = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x7a69' }],
      });
      chainId.value = '0x7a69'
    } catch (e) {
      if (e.code === 4902) {
        const networkParams = {
          chainId: '0x7a69',
          chainName: 'GoChain Testnet',
          nativeCurrency: {
            name: 'GO Coin',
            symbol: 'GO',
            decimals: 18,
          },
          rpcUrls: ['https://rpc.payezgo.com'],
          blockExplorerUrls: [],
        };
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [networkParams]
        });
      }
    }
    
  }

  const connectToBSC = async () => {
    const BSC_PARAMS = {
      // chainId: '0x38',
      chainId: '0x7a69',
      chainName: 'GoChain Testnet',
      nativeCurrency: {
        name: 'GO Coin',
        symbol: 'GO',
        decimals: 18,
      },
      rpcUrls: ['https://rpc.payezgo.com'],
      blockExplorerUrls: [],
    };
    // const BSC_PARAMS = {
    //   // chainId: '0x38',
    //   chainId: '0x7a69',
    //   chainName: 'Binance Smart Chain Mainnet',
    //   nativeCurrency: {
    //     name: 'Binance Coin',
    //     symbol: 'BNB',
    //     // decimals: 18,
    //     decimals: 31337,
    //   },
    //   rpcUrls: ['https://bsc-dataseed.binance.org/'],
    //   blockExplorerUrls: ['https://bscscan.com'],
    // };
  
    if (!window.ethereum) {
      alert('请安装 MetaMask 或使用 imToken 打开页面');
      return;
    }
  
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BSC_PARAMS.chainId }],
      });
    } catch (switchError) {
      // Step 2: 如果 BSC 没有添加过，自动添加
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [BSC_PARAMS],
          });
        } catch (addError) {
          console.error('添加 BSC 网络失败', addError);
          return;
        }
      } else {
        console.error('切换 BSC 网络失败', switchError);
        return;
      }
    }
  }

  const login = async () => {
    try {
      // 1. 获取 nonce
      const data = await get('/api/v1/auth/nonce', { address: account.value });
      const nonce = data.nonce;
  
      const message = `Login to dApp\nAddress: ${account.value}\nNonce: ${nonce}`;
      console.log('签名消息:', message);
      const signature = await signer.value.signMessage(message);
      console.log('签名结果:', signature);
  
      // 3. 发送登录请求
      const token = await post('/api/v1/auth/authorize', {
        address: account.value,
        signature,
        nonce,
        inviteCode: inviteCode.value
      });
  
      // 4. 保存 token
      sessionStorage.setItem('accessToken', token.accessToken);
      sessionStorage.setItem('refreshToken', token.refreshToken);
  
    } catch (error) {
      console.error('登录失败:', );
      // alert('登录失败');
      throw error
    }
  }

  // 调用合约
  const transferU = async (v, address) => {
    return new Promise(async (reslove, reject) => {

      console.log('gogogo')

        const contract = await new web3Info.value.eth.Contract(ERC20_ABI, contractAddress);
        console.log('sdfasdf', contractAddress)
        // 代币精度
        const decimals = await contract.methods.decimals().call();
        console.log(1)
        const amountInt = Math.floor(v * (10 ** Number(decimals)));
        console.log(2)
        
        const amountBN = utils.toBigInt(amountInt);
        console.log(3)
        
        // 调用转账
        console.log('12312313')
        const tx = contract.methods.transfer(address, amountBN).send({ from: account.value })
        console.log(tx)
        tx.catch(e => {
          console.log('cccccccccccccccccc')
          reject(new Error(e))
        })
        tx.on("transactionHash",async (hash) => {
            console.log("交易hash:", hash);
            reslove(hash)
          })
          .on("receipt", (receipt) => {
            console.log("完成:", receipt);
            // reslove(receipt.transactionHash)
            // return hash
          })
          .on("error", (err) => {
            console.error("出错:", err.code);
            reject()
          });

    })
  }

  const refresh = async () => {
    await post('/api/v1/auth/refresh', {
      accessToken: window.sessionStorage.getItem("accessToken"),
      refreshToken: window.sessionStorage.getItem("refreshToken")
    });

  }

  const fetchUserInfo = async () => {
    const data = await get('/api/v1/member/mine');
    userInfo.value = data
    accountMask.value = formatAddress(data.address)
    console.log(data)
  }

  const checkAddress = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0]
    console.log(userInfo.value.address)
    if(account !== userInfo.value.address) {
      return
    } else {
      showToast(translate('tips.addressError'))
      throw new Error()
    }
  }


  // 获取邀请信息
  const fetchInvitationInfo = async () => {
    return await get('/api/v1/invitation/info');
  }
  // 获取邀请人列表
  const fetchInvitationDirect = async (data) => {
    return await get('/api/v1/invitation/direct', data);
  }
  // 获取邀请人列表
  const fetchLevelInfo = async () => {
    return await get('/api/v1/level/info');
  }

  const setInviteCode = (v) => {
    inviteCode.value = v
  }

  const logout = () => {
    web3Info.value = null
    accountMask.value = null
    account.value = null
    chainId.value = null
    signer.value = null
    userInfo.value = null
  }

  const formatAddress = (address) => {
    if (typeof address !== 'string' || address.length <= 10) {
      return address;
    }
  
    const prefix = address.slice(0, 6);
    const suffix = address.slice(-4);
    return `${prefix}****${suffix}`;
  }

  return {
    chainId,
    account,
    accountMask,
    web3Info,
    balance,
    userInfo,
    inviteCode,
    refresh,
    checkAddress,
    connectImTokenWallet,
    login,
    fetchChainId,
    fetchBalance,
    connectToBSC,
    fetchUserInfo,
    transferU,
    setInviteCode,
    fetchInvitationDirect,
    fetchInvitationInfo,
    logout,
    changeChain,
    formatAddress,
    fetchLevelInfo
  };
});
