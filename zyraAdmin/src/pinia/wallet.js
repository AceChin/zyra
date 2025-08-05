import { ref } from 'vue'
import { defineStore } from "pinia";

export const useWalletStore = defineStore("wallet", () => {

  const walletConnected = ref(false)
  const walletAccount = ref('')
  const walletNetwork = ref('')

  const setWallet = (connected, account, network) => {
    walletConnected.value = connected
    walletAccount.value = account
    walletNetwork.value = network
  }

  return {
    walletConnected,
    walletAccount,
    walletNetwork,
    setWallet,
  };
});
