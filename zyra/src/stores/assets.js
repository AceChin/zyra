import { ref } from 'vue'
import { defineStore } from "pinia";
import { get, post } from '@/utils/request'
import moment from 'moment';

export const useAssetsStore = defineStore("assets", () => {

  const assetsList = ref([])
  const rechargeAddress = ref('')
  const nodeInfo = ref({})
  const walletConfig = ref([])

  // 购买节点
  const buyNode = async (data) => {
    await post('/api/v1/node/buy', data)
  }
  // 钱包账号
  const fetchAssetsAccounts = async () => {
    const data = await get('/api/v1/wallet/accounts')
    assetsList.value = data
  }
  // 资产记录
  const fetchAssetsRecord = async (data) => {
    return await get('/api/v1/wallet/transaction', data)
  }
  // 提现记录
  const fetchWidthDrawRecord = async (data) => {
    return await get('/api/v1/wallet/withdraw', data)
  }
  // 查询充值地址
  const fetchRechargeAddress = async () => {
    return await get('/api/v1/charge/address')
  }
  // 充值确认
  const confirmCharge = async (data) => {
    return await post('/api/v1/charge/confirm', data)
  }
  // 转账
  const walletTtansfer = async (data) => {
    return await post('/api/v1/wallet/transfer', data)
  }
  // 转账
  const walletWithdraw = async (data) => {
    return await post('/api/v1/wallet/withdraw', data)
  }
  // 获取钱包配置
  const fetchWalletConfigs = async (data) => {
    const config = await get('/api/v1/wallet/configs', data)
    walletConfig.value = config.find(i => i.token == 'USDT')
    console.log(walletConfig.value)
  }

  const dateRang = () => {
    const beginTime = nodeInfo.value.beginTime
    const endTime = nodeInfo.value.endTime
    if(!beginTime || !endTime)return ''
    else return `${moment(new Date(beginTime * 1000)).format('YYYY/MM/DD')} - ${moment(new Date(endTime * 1000)).format('YYYY/MM/DD')}`
  }
  

  return {
    assetsList,
    rechargeAddress,
    nodeInfo,
    walletConfig,
    dateRang,
    buyNode,
    fetchAssetsAccounts,
    fetchAssetsRecord,
    fetchWidthDrawRecord,
    fetchRechargeAddress,
    confirmCharge,
    walletTtansfer,
    walletWithdraw,
    fetchWalletConfigs
  };
});
