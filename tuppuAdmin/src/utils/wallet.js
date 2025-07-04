import { ethers } from 'ethers'
import { ElMessage } from 'element-plus'

// 钱包连接状态
export const walletState = {
  connected: false,
  account: '',
  chainId: '',
  provider: null,
  signer: null
}

// 检查是否安装了MetaMask
export const checkMetaMaskInstalled = () => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
}

// 连接钱包
export const connectWallet = async () => {
  if (!checkMetaMaskInstalled()) {
    ElMessage.error('请先安装MetaMask钱包')
    window.open('https://metamask.io/download/', '_blank')
    return false
  }

  try {
    // 请求连接钱包
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    })

    if (accounts.length === 0) {
      ElMessage.error('未获取到钱包账户')
      return false
    }

    // 创建provider和signer
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const network = await provider.getNetwork()

    // 更新状态
    walletState.connected = true
    walletState.account = accounts[0]
    walletState.chainId = network.chainId.toString()
    walletState.provider = provider
    walletState.signer = signer

    // 保存到localStorage
    localStorage.setItem('walletConnected', 'true')
    localStorage.setItem('walletAccount', accounts[0])

    ElMessage.success(`钱包连接成功: ${formatAddress(accounts[0])}`)
    return true
  } catch (error) {
    console.error('连接钱包失败:', error)
    if (error.code === 4001) {
      ElMessage.error('用户拒绝连接钱包')
    } else {
      ElMessage.error('连接钱包失败: ' + error.message)
    }
    return false
  }
}

// 断开钱包连接
export const disconnectWallet = () => {
  walletState.connected = false
  walletState.account = ''
  walletState.chainId = ''
  walletState.provider = null
  walletState.signer = null

  localStorage.removeItem('walletConnected')
  localStorage.removeItem('walletAccount')

  ElMessage.success('钱包已断开连接')
}

// 检查钱包连接状态
export const checkWalletConnection = async () => {
  if (!checkMetaMaskInstalled()) {
    return false
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts'
    })

    if (accounts.length > 0) {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const network = await provider.getNetwork()

      walletState.connected = true
      walletState.account = accounts[0]
      walletState.chainId = network.chainId.toString()
      walletState.provider = provider
      walletState.signer = signer

      return true
    }
  } catch (error) {
    console.error('检查钱包连接失败:', error)
  }

  return false
}

// 签名消息
export const signMessage = async (message) => {
  if (!walletState.connected || !walletState.signer) {
    throw new Error('钱包未连接')
  }

  try {
    const signature = await walletState.signer.signMessage(message)
    return signature
  } catch (error) {
    console.error('签名失败:', error)
    if (error.code === 4001) {
      throw new Error('用户拒绝签名')
    } else {
      throw new Error('签名失败: ' + error.message)
    }
  }
}

// 签名审核数据
export const signApprovalData = async (message) => {
  if (!walletState.connected) {
    throw new Error('请先连接钱包')
  }


  try {
    const signature = await signMessage(message)
    
    return {
      message,
      signature,
      signer: walletState.account
    }
  } catch (error) {
    throw error
  }
}

// 格式化地址显示
export const formatAddress = (address) => {
  if (!address) return ''
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

// 获取网络名称
export const getNetworkName = (chainId) => {
  const networks = {
    '1': 'Ethereum Mainnet',
    '5': 'Goerli Testnet',
    '11155111': 'Sepolia Testnet',
    '56': 'BSC Mainnet',
    '97': 'BSC Testnet',
    '137': 'Polygon Mainnet',
    '80001': 'Mumbai Testnet'
  }
  return networks[chainId] || `Chain ID: ${chainId}`
}

// 设置钱包事件监听
export const setupWalletEvents = (onAccountChange, onChainChange, onDisconnect) => {
  if (!checkMetaMaskInstalled()) return

  // 账户变化
  window.ethereum.on('accountsChanged', (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet()
      onDisconnect && onDisconnect()
    } else {
      walletState.account = accounts[0]
      localStorage.setItem('walletAccount', accounts[0])
      onAccountChange && onAccountChange(accounts[0])
    }
  })

  // 网络变化
  window.ethereum.on('chainChanged', (chainId) => {
    walletState.chainId = chainId
    onChainChange && onChainChange(chainId)
  })

  // 连接状态变化
  window.ethereum.on('disconnect', () => {
    disconnectWallet()
    onDisconnect && onDisconnect()
  })
}

export default {
  walletState,
  checkMetaMaskInstalled,
  connectWallet,
  disconnectWallet,
  checkWalletConnection,
  signMessage,
  signApprovalData,
  formatAddress,
  getNetworkName,
  setupWalletEvents
} 