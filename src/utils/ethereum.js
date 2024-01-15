// check wether the metamask is install or not
export const _isMetaMaskInstalled = () =>{
    if(typeof window === 'undefined') return;
    const {ethereum} = window;
    return Boolean(ethereum && ethereum.isMetaMask);
};

// connect metamask 
export const connectMetaMask = async () =>{
    if(!_isMetaMaskInstalled()) return false;
    try {
       let account = await window.ethereum.request({ method: "eth_requestAccounts"});
        return account;
    } catch (e) {
        console.log(e);
        return false
    }
}