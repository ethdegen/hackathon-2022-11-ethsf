import { ethers } from 'ethers';

export const getSigner = async () => {
    const ethereum = (window as any).ethereum
    await ethereum.request({ method: 'eth_requestAccounts' })
    const provider = new ethers.providers.Web3Provider(ethereum);
    return provider.getSigner();
};

export const getAddressFromSigner = async () => {
  return (await getSigner()).getAddress();
};

export const signText = async (text: string) => {
  return (await getSigner()).signMessage(text);
}