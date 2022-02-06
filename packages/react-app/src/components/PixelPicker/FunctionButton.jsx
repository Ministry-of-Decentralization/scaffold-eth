import { Button, Col, Divider, Input, Row, Tooltip } from "antd";
import React, { useState } from "react";
import Blockies from "react-blockies";
import { Transactor } from "../../helpers";
import { tryToDisplay, tryToDisplayAsText } from "../Contract/utils";

const { utils, BigNumber } = require("ethers");

const getFunctionInputKey = (functionInfo, input, inputIndex) => {
  const name = input?.name ? input.name : "input_" + inputIndex + "_";
  return functionInfo.name + "_" + name + "_" + input.type;
};

const defaultTxState = {
  pending: null,
  success: null
}
export default function FunctionButton({ contractFunction, provider, args, gasPrice, txValue, onSuccess, isDisabled}) {

  const [txState, setTxState] = useState({...defaultTxState});

  const tx = Transactor(provider, gasPrice);



  const sendTransaction = async () => {    
      const overrides = {};
      if (txValue) {
        overrides.value = txValue; // ethers.utils.parseEther()
      }
      if (gasPrice) {
        overrides.gasPrice = gasPrice;
      }
      // Uncomment this if you want to skip the gas estimation for each transaction
      // overrides.gasLimit = hexlify(1200000);

      // console.log("Running with extras",extras)
      setTxState({...txState, pending: true})
      const returned = await tx(contractFunction(...args, overrides));
    

    console.log("SETTING RESULT:", returned);
    setTxState({...txState, pending: false})

  }

  const buttonLabel = txState.pending ? 'Pending' : 'Update Bricks'
    
  return (
    <div>
      <Button disabled={isDisabled || txState.pending} onClick={sendTransaction}>{buttonLabel}</Button>
    </div>
  )

}
