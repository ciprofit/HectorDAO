import { ethers, BigNumber } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20ABI } from "../abi/IERC20.json";
import { abi as wsHEC } from "../abi/wsHec.json";
import { clearPendingTxn, fetchPendingTxns, getWrappingTypeText } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { error, info } from "../slices/MessagesSlice";
import { IActionValueAsyncThunk, IChangeApprovalAsyncThunk, IJsonRPCError } from "./interfaces";
import { segmentUA } from "../helpers/userAnalyticHelpers";

interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string | null;
}

function alreadyApprovedToken(token: string, wrapAllowance: BigNumber, unwrapAllowance: BigNumber) {
  // set defaults
  let bigZero = BigNumber.from("0");
  let applicableAllowance = bigZero;

  // determine which allowance to check
  if (token === "shec") {
    applicableAllowance = wrapAllowance;
  } else if (token === "wshec") {
    applicableAllowance = unwrapAllowance;
  }

  // check if allowance exists
  if (applicableAllowance.gt(bigZero)) return true;

  return false;
}

export const changeApproval = createAsyncThunk(
  "wrap/changeApproval",
  async ({ token, provider, address, networkID }: IChangeApprovalAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const shecContract = new ethers.Contract(addresses[networkID].SHEC_ADDRESS as string, ierc20ABI, signer);
    const wshecContract = new ethers.Contract(addresses[networkID].WSHEC_ADDRESS as string, wsHEC, signer);
    let approveTx;
    let wrapAllowance = await shecContract.allowance(address, addresses[networkID].WSHEC_ADDRESS);
    let unwrapAllowance = await wshecContract.allowance(address, addresses[networkID].WSHEC_ADDRESS);
    console.log("debug", "change", wrapAllowance.toString(), unwrapAllowance.toString());

    // return early if approval has already happened
    if (alreadyApprovedToken(token, wrapAllowance, unwrapAllowance)) {
      dispatch(info("Approval completed."));
      return dispatch(
        fetchAccountSuccess({
          wrapping: {
            hecWrap: +wrapAllowance,
            hecUnwrap: +unwrapAllowance,
          },
        }),
      );
    }

    try {
      if (token === "shec") {
        // won't run if wrapAllowance > 0
        approveTx = await shecContract.approve(
          addresses[networkID].WSHEC_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      } else if (token === "wshec") {
        approveTx = await wshecContract.approve(
          addresses[networkID].WSHEC_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      }

      const text = "Approve " + (token === "shec" ? "Wrapping" : "Unwrapping");
      const pendingTxnType = token === "shec" ? "approve_wrapping" : "approve_unwrapping";
      if (approveTx) {
        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));

        await approveTx.wait();
      }
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    // go get fresh allowances
    wrapAllowance = await shecContract.allowance(address, addresses[networkID].WSHEC_ADDRESS);
    unwrapAllowance = await wshecContract.allowance(address, addresses[networkID].WSHEC_ADDRESS);

    return dispatch(
      fetchAccountSuccess({
        wrapping: {
          hecWrap: +wrapAllowance,
          hecUnwrap: +unwrapAllowance,
        },
      }),
    );
  },
);

export const changeWrap = createAsyncThunk(
  "wrap/changeWrap",
  async ({ action, value, provider, address, networkID }: IActionValueAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const wshecContract = new ethers.Contract(addresses[networkID].WSHEC_ADDRESS as string, wsHEC, signer);

    let wrapTx;
    let uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: null,
    };
    try {
      if (action === "wrap") {
        uaData.type = "wrap";
        wrapTx = await wshecContract.wrap(ethers.utils.parseUnits(value, "gwei"));
      } else {
        uaData.type = "unwrap";
        wrapTx = await wshecContract.unwrap(ethers.utils.parseUnits(value));
      }
      const pendingTxnType = action === "wrap" ? "wrapping" : "unwrapping";
      uaData.txHash = wrapTx.hash;
      dispatch(fetchPendingTxns({ txnHash: wrapTx.hash, text: getWrappingTypeText(action), type: pendingTxnType }));
      await wrapTx.wait();
    } catch (e: unknown) {
      uaData.approved = false;
      const rpcError = e as IJsonRPCError;
      if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error("You may be trying to wrap more than your balance! Error code: 32603. Message: ds-math-sub-underflow"),
        );
      } else {
        dispatch(error(rpcError.message));
      }
      return;
    } finally {
      if (wrapTx) {
        segmentUA(uaData);

        dispatch(clearPendingTxn(wrapTx.hash));
      }
    }
    dispatch(getBalances({ address, networkID, provider }));
  },
);
