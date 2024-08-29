import { BaseWallet, CalcTxHashParams, DerivePriKeyParams, GetDerivedPathParam, NewAddressParams, SignTxParams, ValidAddressParams, ValidPrivateKeyParams } from "@okxweb3/coin-base";
export type ValidateMnemonicParams = {
    mnemonicArray: string[];
    password: string;
};
export type SignTonProofParams = {
    privateKey: string;
    walletAddress: string;
    tonProofItem: string;
    messageAction: string;
    messageSalt: string;
    proof: ApiTonConnectProof;
};
export type GetWalletInformationParams = {
    workChain: number;
    publicKey?: string;
    privateKey?: string;
    walletVersion?: string;
};
export interface ApiTonConnectProof {
    timestamp: number;
    domain: string;
    payload: string;
}
export type TonTransferParam = {
    toAddress: string;
    amount: string;
    payload?: string;
    stateInit?: string;
    isBase64Payload?: boolean;
};
export type SignMultiTransactionParams = {
    messages: TonTransferParam[];
    seqno: number;
    expireAt?: number;
    workchain?: number;
};
export interface TransactionPayloadMessage {
    address: string;
    amount: string;
    payload?: string;
    stateInit?: string;
    isBase64Payload?: boolean;
}
export interface TransactionPayload {
    valid_until?: number;
    messages: TransactionPayloadMessage[];
    seqno: number;
    network?: string;
    from?: string;
    publicKey?: string;
}
export interface ApiNft {
    index: number;
    name?: string;
    address: string;
    thumbnail: string;
    image: string;
    description?: string;
    collectionName?: string;
    collectionAddress?: string;
    isOnSale: boolean;
    isHidden?: boolean;
    isOnFragment?: boolean;
    isScam?: boolean;
}
export type SignMultiTransactionForNFTParams = {
    fromNFTAddress: string;
    nftAddresses: string[];
    toAddress: string;
    comment?: string;
    nfts?: ApiNft[];
    seqno: number;
    expireAt?: number;
    workchain?: number;
};
export type BuildNotcoinVoucherExchangeParams = {
    fromNFTAddress: string;
    nftAddress: string;
    nftIndex: number;
};
export type BuildNftTransferPayloadParams = {
    fromNFTAddress: string;
    nftAddress: string;
    comment: string;
};
export declare class TonWallet extends BaseWallet {
    getRandomPrivateKey(): Promise<any>;
    getDerivedPath(param: GetDerivedPathParam): Promise<any>;
    getDerivedPrivateKey(param: DerivePriKeyParams): Promise<any>;
    getNewAddress(param: NewAddressParams & {
        walletVersion?: string;
    }): Promise<any>;
    validPrivateKey(param: ValidPrivateKeyParams): Promise<any>;
    validAddress(param: ValidAddressParams): Promise<any>;
    parseAddress(param: ValidAddressParams): Promise<any>;
    convertAddress(param: ValidAddressParams): Promise<any>;
    validateMnemonicOfTon(param: ValidateMnemonicParams): Promise<any>;
    signTransaction(param: SignTxParams): Promise<any>;
    signJettonTransaction(param: SignTxParams): Promise<any>;
    getWalletInformation(params: GetWalletInformationParams): Promise<{
        initCode: string | undefined;
        initData: string | undefined;
        walletStateInit: string;
        walletAddress: string;
    }>;
    getTransactionBodyForSimulate(param: SignTxParams): Promise<any>;
    calcTxHash(param: CalcTxHashParams): Promise<any>;
    signTonProof(param: SignTonProofParams): Promise<any>;
    signMultiTransaction(param: SignTxParams): Promise<{
        seqno: number;
        transaction: string;
        externalMessage: string;
    }>;
    simulateMultiTransaction(param: SignTxParams): Promise<{
        seqno: number;
        transaction: string;
        externalMessage: string;
    }>;
    signMultiTransactionForNFT(param: SignTxParams): Promise<{
        seqno: number;
        transaction: string;
        externalMessage: string;
    }>;
    buildNotcoinVoucherExchange(params: BuildNotcoinVoucherExchangeParams): Promise<string>;
    buildNftTransferPayload(params: BuildNftTransferPayloadParams): Promise<string>;
}
export declare class VenomWallet extends TonWallet {
    getNewAddress(param: NewAddressParams): Promise<any>;
    signTransaction(param: SignTxParams): Promise<any>;
}
export declare class JettonWallet extends TonWallet {
}
export declare class TestTonWallet extends TonWallet {
    getNewAddress(param: NewAddressParams & {
        walletVersion?: string;
    }): Promise<any>;
    getWalletInformation(params: GetWalletInformationParams): Promise<{
        initCode: string | undefined;
        initData: string | undefined;
        walletStateInit: string;
        walletAddress: string;
    }>;
}
