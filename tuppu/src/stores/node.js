import { ref } from 'vue'
import { defineStore } from "pinia";
import { get, post } from '@/utils/request'
import moment from 'moment';

export const useNodeStore = defineStore("node", () => {

  const nodeList = ref([])
  const nodeInfo = ref({})


  const buyNode = async (data) => {
    console.log(data)
    await post('/api/v1/node/buy', data)
  }

  const fetchNodeTypes = async () => {
    const data = await get('/api/v1/node/types')
    nodeList.value = data
  }

  const fetchNodeDetail = async () => {
    const data = await get('/api/v1/node/sales')
    nodeInfo.value = data[0]
  }

  const dateRang = () => {
    const beginTime = nodeInfo.value.beginTime
    const endTime = nodeInfo.value.endTime
    if(!beginTime || !endTime)return ''
    else return `${moment(new Date(beginTime * 1000)).format('YYYY/MM/DD')} - ${moment(new Date(endTime * 1000)).format('YYYY/MM/DD')}`
  }

  
  

  return {
    nodeList,
    nodeInfo,
    dateRang,
    buyNode,
    fetchNodeTypes,
    fetchNodeDetail
  };
});
