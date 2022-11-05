import { ethers, TypedDataDomain, utils } from "ethers";
import { omit } from "./helpers";

const ethereum = (window as any).ethereum;

export const getSigner = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    await ethereum.request({ method: "eth_requestAccounts" });
    return provider.getSigner();
};

export const getAddressFromSigner = async () => {
    return (await getSigner()).getAddress();
};

export const signText = async (text: string) => {
    return (await getSigner()).signMessage(text);
};

export const signedTypeData = async (
    domain: TypedDataDomain,
    types: Record<string, any>,
    value: Record<string, any>
) => {
    const signer = await getSigner();
    // remove the __typedname from the signature!
    return signer._signTypedData(omit(domain, "__typename"), omit(types, "__typename"), omit(value, "__typename"));
};
export const splitSignature = (signature: string) => {
    return utils.splitSignature(signature);
};
