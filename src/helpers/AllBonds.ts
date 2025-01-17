import { StableBond, LPBond, NetworkID, CustomBond, BondType } from "src/lib/Bond";
import { addresses } from "src/constants";

import { ReactComponent as DaiImg } from "src/assets/tokens/DAI.svg";
import { ReactComponent as HecDaiimg } from "src/assets/tokens/HEC-DAI.svg";
import { ReactComponent as wFTMImg } from "src/assets/tokens/wFTM.svg";
import { ReactComponent as UsdcImg } from "src/assets/tokens/USDC.svg";
import { ReactComponent as MimImg } from "src/assets/tokens/MIM.svg";
import { ReactComponent as FraxImg } from "src/assets/tokens/FRAX.svg";
import { ReactComponent as HecUsdcImg } from "src/assets/tokens/HEC-USDC.svg";

import { abi as BondHecDaiContract } from "src/abi/bonds/HecDaiContract.json";
import { abi as HecUsdcContract } from "src/abi/bonds/HecUsdcContract.json";

import { abi as DaiBondContract } from "src/abi/bonds/DaiContract.json";
import { abi as MimBondContract } from "src/abi/bonds/MimContract.json";
import { abi as ReserveHecDaiContract } from "src/abi/reserves/HecDai.json";
import { abi as ReserveHecUsdcContract } from "src/abi/reserves/HecUsdc.json";

import { abi as EthBondContract } from "src/abi/bonds/FtmContract.json";

import { abi as ierc20Abi } from "src/abi/IERC20.json";

// TODO(zx): Further modularize by splitting up reserveAssets into vendor token definitions
//   and include that in the definition of a bond
export const dai = new StableBond({
  name: "dai",
  displayName: "DAI",
  bondToken: "DAI",
  bondIconSvg: DaiImg,
  bondContractABI: DaiBondContract,
  fourAddress: "0x23337B675375507CE218df5F92f1a71252DAB3E5",
  oldfourAddress: "0xe8fd4630800bA4335801D1b104B07328Ae415605",
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x4099EB0e82Ffa0048E4BF037a9743ca05Ec561D7",
      reserveAddress: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
});

export const dai4 = new StableBond({
  name: "dai4",
  displayName: "DAI",
  bondToken: "DAI",
  bondIconSvg: DaiImg,
  isFour: true,
  isTotal: true,
  bondContractABI: MimBondContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xe8fd4630800bA4335801D1b104B07328Ae415605",
      reserveAddress: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
});

export const dai4_v2 = new StableBond({
  name: "dai4_v2",
  displayName: "DAI v2",
  bondToken: "DAI",
  bondIconSvg: DaiImg,
  isFour: true,
  isTotal: true,
  oldfourAddress: "0xe8fd4630800bA4335801D1b104B07328Ae415605",
  bondContractABI: MimBondContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x23337B675375507CE218df5F92f1a71252DAB3E5",
      reserveAddress: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
});
export const ftm = new CustomBond({
  name: "ftm",
  displayName: "wFTM",
  lpUrl: "",
  bondType: BondType.StableAsset,
  bondToken: "WFTM",
  bondIconSvg: wFTMImg,
  bondContractABI: EthBondContract,
  reserveContract: ierc20Abi, // The Standard ierc20Abi since they're normal tokens
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x72De9F0e51cA520379a341318870836FdCaf03B9",
      reserveAddress: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
  customTreasuryBalanceFunc: async function (this: CustomBond, networkID, provider) {
    const ethBondContract = this.getContractForBond(networkID, provider);
    let ethPrice = await ethBondContract.assetPrice();
    ethPrice = ethPrice / Math.pow(10, 8);
    const token = this.getContractForReserve(networkID, provider);
    let ftmAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
    ftmAmount = ftmAmount / Math.pow(10, 18);
    return ftmAmount * ethPrice;
  },
});

export const usdc = new StableBond({
  name: "usdc",
  displayName: "USDC",
  bondToken: "USDC",
  decimals: 6,
  bondIconSvg: UsdcImg,
  fourAddress: "0xD0373F236Be04EcF08F51fc4E3AdE7159D7cDe65",
  oldfourAddress: "0x605c31dD24c71f0b732Ef33aC12CDce77fAC09B6",
  bondContractABI: DaiBondContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x5d05EF2654B9055895F21D7057095e2D7575f5A2",
      reserveAddress: "0x04068da6c83afcfa0e13ba15a6696662335d5b75",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
});

export const usdc4 = new StableBond({
  name: "usdc4",
  displayName: "USDC",
  bondToken: "USDC",
  bondIconSvg: UsdcImg,
  bondContractABI: MimBondContract,
  isFour: true,
  decimals: 6,
  isTotal: true,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x605c31dD24c71f0b732Ef33aC12CDce77fAC09B6",
      reserveAddress: "0x04068da6c83afcfa0e13ba15a6696662335d5b75",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
});

export const usdc4_v2 = new StableBond({
  name: "usdc4_v2",
  displayName: "USDC v2",
  bondToken: "USDC",
  bondIconSvg: UsdcImg,
  bondContractABI: MimBondContract,
  oldfourAddress: "0x605c31dD24c71f0b732Ef33aC12CDce77fAC09B6",
  isFour: true,
  decimals: 6,
  isTotal: true,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xD0373F236Be04EcF08F51fc4E3AdE7159D7cDe65",
      reserveAddress: "0x04068da6c83afcfa0e13ba15a6696662335d5b75",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
});

export const mim4 = new StableBond({
  name: "mim4",
  displayName: "MIM",
  bondToken: "MIM",
  bondIconSvg: MimImg,
  bondContractABI: DaiBondContract,
  isFour: true,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xb26be27f6f980efb07ae757d0a6a372671eacf7f",
      reserveAddress: "0x82f0B8B456c1A451378467398982d4834b6829c1",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
});

export const mim4_v2 = new StableBond({
  name: "mim4_v2",
  displayName: "MIM v2",
  bondToken: "MIM",
  bondIconSvg: MimImg,
  bondContractABI: MimBondContract,
  isFour: true,
  isTotal: true,
  oldfourAddress: "0xb26be27f6f980efb07ae757d0a6a372671eacf7f",
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x8565f642180fE388F942460B66ABa9c2ca7F02Ed",
      reserveAddress: "0x82f0B8B456c1A451378467398982d4834b6829c1",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
});

export const mim = new StableBond({
  name: "mim",
  displayName: "MIM",
  bondToken: "MIM",
  bondIconSvg: MimImg,
  bondContractABI: MimBondContract,
  isTotal: true,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xa695750b8439AB2AfBd88310946C99747C5B3A2E",
      reserveAddress: "0x82f0B8B456c1A451378467398982d4834b6829c1",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
});

export const frax = new StableBond({
  name: "frax",
  displayName: "FRAX",
  bondToken: "FRAX",
  bondIconSvg: FraxImg,
  bondContractABI: MimBondContract,
  isTotal: true,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xA4E87A25bC9058e4eC193151558c3c5D02cebE31",
      reserveAddress: "0xdc301622e621166bd8e82f2ca0a26c13ad0be355",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
});

export const frax4 = new StableBond({
  name: "frax4",
  displayName: "FRAX",
  bondToken: "FRAX",
  bondIconSvg: FraxImg,
  bondContractABI: MimBondContract,
  isTotal: true,
  isFour: true,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xC798e6A22996C554739Df607B7eF1d6d435FDBd9",
      reserveAddress: "0xdc301622e621166bd8e82f2ca0a26c13ad0be355",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
});
export const hec_dai = new LPBond({
  name: "hec_dai_lp_v1",
  displayName: "HEC-DAI LP v1",
  bondToken: "DAI",
  bondIconSvg: HecDaiimg,
  bondContractABI: BondHecDaiContract,
  reserveContract: ReserveHecDaiContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xA1224c353cdCB03eB70FbA44dADC137F39E5EF7d",
      reserveAddress: "0xbc0eecdA2d8141e3a26D2535C57cadcb1095bca9",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
  lpUrl:
    "https://spookyswap.finance/add/0x5C4FDfc5233f935f20D2aDbA572F770c2E377Ab0/0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
});

export const hec_dai_v2 = new LPBond({
  name: "hec_dai_lp",
  displayName: "HEC-DAI LP v2",
  bondToken: "DAI",
  bondIconSvg: HecDaiimg,
  bondContractABI: BondHecDaiContract,
  reserveContract: ReserveHecDaiContract,
  fourAddress: "0xfF40F40E376030394B154dadcB4173277633b405",
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x6c9b3a47a28a39fea65e99d97895e717df1706d0",
      reserveAddress: "0xbc0eecdA2d8141e3a26D2535C57cadcb1095bca9",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
  lpUrl:
    "https://spookyswap.finance/add/0x5C4FDfc5233f935f20D2aDbA572F770c2E377Ab0/0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
});

export const hec_dai_4 = new LPBond({
  name: "dai_lp4",
  displayName: "HEC-DAI LP",
  bondToken: "DAI",
  bondIconSvg: HecDaiimg,
  isFour: true,
  isTotal: true,
  bondContractABI: MimBondContract,
  reserveContract: ReserveHecDaiContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xfF40F40E376030394B154dadcB4173277633b405",
      reserveAddress: "0xbc0eecdA2d8141e3a26D2535C57cadcb1095bca9",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
  lpUrl:
    "https://spookyswap.finance/add/0x5C4FDfc5233f935f20D2aDbA572F770c2E377Ab0/0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
});

export const hec_usdc = new LPBond({
  name: "hec_usdc_lp",
  displayName: "HEC-USDC LP",
  bondToken: "USDC",
  decimals: 6,
  fourAddress: "0xff6508aba1DAd81AACf3894374F291f82Dc024A8",
  bondIconSvg: HecUsdcImg,
  bondContractABI: HecUsdcContract,
  reserveContract: ReserveHecUsdcContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x3C57481f373Be0196A26A7d0a8E29E8CedC63ba1",
      reserveAddress: "0xd661952749f05acc40503404938a91af9ac1473b",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
  lpUrl:
    "https://swap.spiritswap.finance/#/add/0x04068DA6C83AFCFA0e13ba15A6696662335D5B75/0x5C4FDfc5233f935f20D2aDbA572F770c2E377Ab0",
});

export const hec_usdc_4 = new LPBond({
  name: "usdc_lp_4",
  displayName: "HEC-USDC LP",
  bondToken: "USDC",
  decimals: 6,
  isFour: true,
  isTotal: true,
  bondIconSvg: HecUsdcImg,
  bondContractABI: MimBondContract,
  reserveContract: ReserveHecUsdcContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xff6508aba1DAd81AACf3894374F291f82Dc024A8",
      reserveAddress: "0xd661952749f05acc40503404938a91af9ac1473b",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
  lpUrl:
    "https://swap.spiritswap.finance/#/add/0x04068DA6C83AFCFA0e13ba15A6696662335D5B75/0x5C4FDfc5233f935f20D2aDbA572F770c2E377Ab0",
});

// HOW TO ADD A NEW BOND:
// Is it a stableCoin bond? use `new StableBond`
// Is it an LP Bond? use `new LPBond`
// Add new bonds to this array!!
// export const allBonds = [hec_dai_v2, hec_usdc, ftm, dai, usdc, mim, mim4_v2, usdc4_v2, dai4_v2];
export const allBonds = [
  hec_dai_v2,
  hec_usdc,
  ftm,
  dai,
  usdc,
  mim4_v2,
  mim,
  usdc4_v2,
  dai4_v2,
  hec_dai_4,
  hec_usdc_4,
  frax,
  frax4,
];
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

// Debug Log
export default allBonds;
