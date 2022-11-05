import { ethers } from "ethers";
import { getSigner } from "./ethers.service";

// lens contract info can all be found on the deployed
// contract address on polygon.
export const lensHub = async () =>
    new ethers.Contract(
        "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82",
        [
            {
                inputs: [
                    { internalType: "address", name: "_logic", type: "address" },
                    { internalType: "address", name: "admin_", type: "address" },
                    { internalType: "bytes", name: "_data", type: "bytes" },
                ],
                stateMutability: "payable",
                type: "constructor",
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: false, internalType: "address", name: "previousAdmin", type: "address" },
                    { indexed: false, internalType: "address", name: "newAdmin", type: "address" },
                ],
                name: "AdminChanged",
                type: "event",
            },
            {
                anonymous: false,
                inputs: [{ indexed: true, internalType: "address", name: "beacon", type: "address" }],
                name: "BeaconUpgraded",
                type: "event",
            },
            {
                anonymous: false,
                inputs: [{ indexed: true, internalType: "address", name: "implementation", type: "address" }],
                name: "Upgraded",
                type: "event",
            },
            { stateMutability: "payable", type: "fallback" },
            {
                inputs: [],
                name: "admin",
                outputs: [{ internalType: "address", name: "admin_", type: "address" }],
                stateMutability: "nonpayable",
                type: "function",
            },
            {
                inputs: [{ internalType: "address", name: "newAdmin", type: "address" }],
                name: "changeAdmin",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function",
            },
            {
                inputs: [],
                name: "implementation",
                outputs: [{ internalType: "address", name: "implementation_", type: "address" }],
                stateMutability: "nonpayable",
                type: "function",
            },
            {
                inputs: [{ internalType: "address", name: "newImplementation", type: "address" }],
                name: "upgradeTo",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function",
            },
            {
                inputs: [
                    { internalType: "address", name: "newImplementation", type: "address" },
                    { internalType: "bytes", name: "data", type: "bytes" },
                ],
                name: "upgradeToAndCall",
                outputs: [],
                stateMutability: "payable",
                type: "function",
            },
            { stateMutability: "payable", type: "receive" },
        ],
        await getSigner()
    );

export const lensPeriphery = async () =>
    new ethers.Contract(
        "0xD5037d72877808cdE7F669563e9389930AF404E8",
        [
            {
                inputs: [{ internalType: "contract ILensHub", name: "hub", type: "address" }],
                stateMutability: "nonpayable",
                type: "constructor",
            },
            { inputs: [], name: "ArrayMismatch", type: "error" },
            { inputs: [], name: "FollowInvalid", type: "error" },
            { inputs: [], name: "NotProfileOwnerOrDispatcher", type: "error" },
            { inputs: [], name: "SignatureExpired", type: "error" },
            { inputs: [], name: "SignatureInvalid", type: "error" },
            { inputs: [], name: "TokenDoesNotExist", type: "error" },
            {
                inputs: [],
                name: "HUB",
                outputs: [{ internalType: "contract ILensHub", name: "", type: "address" }],
                stateMutability: "view",
                type: "function",
            },
            {
                inputs: [],
                name: "NAME",
                outputs: [{ internalType: "string", name: "", type: "string" }],
                stateMutability: "view",
                type: "function",
            },
            {
                inputs: [{ internalType: "uint256", name: "profileId", type: "uint256" }],
                name: "getProfileMetadataURI",
                outputs: [{ internalType: "string", name: "", type: "string" }],
                stateMutability: "view",
                type: "function",
            },
            {
                inputs: [
                    { internalType: "uint256", name: "profileId", type: "uint256" },
                    { internalType: "string", name: "metadata", type: "string" },
                ],
                name: "setProfileMetadataURI",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function",
            },
            {
                inputs: [
                    {
                        components: [
                            { internalType: "uint256", name: "profileId", type: "uint256" },
                            { internalType: "string", name: "metadata", type: "string" },
                            {
                                components: [
                                    { internalType: "uint8", name: "v", type: "uint8" },
                                    { internalType: "bytes32", name: "r", type: "bytes32" },
                                    { internalType: "bytes32", name: "s", type: "bytes32" },
                                    { internalType: "uint256", name: "deadline", type: "uint256" },
                                ],
                                internalType: "struct DataTypes.EIP712Signature",
                                name: "sig",
                                type: "tuple",
                            },
                        ],
                        internalType: "struct DataTypes.SetProfileMetadataWithSigData",
                        name: "vars",
                        type: "tuple",
                    },
                ],
                name: "setProfileMetadataURIWithSig",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function",
            },
            {
                inputs: [{ internalType: "address", name: "", type: "address" }],
                name: "sigNonces",
                outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                stateMutability: "view",
                type: "function",
            },
            {
                inputs: [
                    { internalType: "uint256[]", name: "profileIds", type: "uint256[]" },
                    { internalType: "bool[]", name: "enables", type: "bool[]" },
                ],
                name: "toggleFollow",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function",
            },
            {
                inputs: [
                    {
                        components: [
                            { internalType: "address", name: "follower", type: "address" },
                            { internalType: "uint256[]", name: "profileIds", type: "uint256[]" },
                            { internalType: "bool[]", name: "enables", type: "bool[]" },
                            {
                                components: [
                                    { internalType: "uint8", name: "v", type: "uint8" },
                                    { internalType: "bytes32", name: "r", type: "bytes32" },
                                    { internalType: "bytes32", name: "s", type: "bytes32" },
                                    { internalType: "uint256", name: "deadline", type: "uint256" },
                                ],
                                internalType: "struct DataTypes.EIP712Signature",
                                name: "sig",
                                type: "tuple",
                            },
                        ],
                        internalType: "struct DataTypes.ToggleFollowWithSigData",
                        name: "vars",
                        type: "tuple",
                    },
                ],
                name: "toggleFollowWithSig",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function",
            },
        ],
        await getSigner()
    );
