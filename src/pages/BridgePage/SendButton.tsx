// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { useTxStatus } from 'contexts/txStatusContext';
import MantaLoading from 'components/Loading';
import ConnectWallet from 'components/Accounts/ConnectWallet';
import { useBridgeTx } from './BridgeContext/BridgeTxContext';
import { useBridgeData } from './BridgeContext/BridgeDataContext';
import { useExternalAccount } from 'contexts/externalAccountContext';

const ValidationButton = () => {
  const { externalAccount } = useExternalAccount();
  const {
    senderAssetType,
    minInput,
    originChain,
    destinationChain,
    destinationAddress,
    senderAssetTargetBalance
  } = useBridgeData();
  const { txIsOverMinAmount, userHasSufficientFunds, userCanPayOriginFee } =
    useBridgeTx();

    const isMoonriverEnabled =
      originChain?.xcmAdapter?.chain?.type === 'ethereum' ||
      destinationChain?.xcmAdapter?.chain?.type;

  let validationMsg = null;
  let isConnectWallet = false;
  let bgColor = 'filter brightness-50';
  if (!externalAccount) {
    isConnectWallet = true;
  } else if (!senderAssetTargetBalance) {
    validationMsg = 'Enter Amount';
  } else if (isMoonriverEnabled && !destinationAddress) {
    validationMsg = `Enter ${
      originChain?.xcmAdapter?.chain?.type === 'ethereum'
        ? 'Substrate'
        : 'Metamask'
    } Address`;
  } else if (userHasSufficientFunds() === false) {
    validationMsg = 'Insuffient balance';
  } else if (userCanPayOriginFee() === false) {
    validationMsg = `Insufficient ${originChain.nativeAsset.ticker} to pay origin fee`;
  } else if (txIsOverMinAmount() === false) {
    const MIN_INPUT_DIGITS = 6;
    validationMsg = `Minimum ${
      senderAssetType.ticker
    } transaction is ${minInput.toDisplayString(MIN_INPUT_DIGITS)}`;
  }

  const ValidationBlock = ({validationMsg}) => {
    return (
      <div
        className={classNames(
          `py-2 cursor-pointer text-xl unselectable-text cursor-not-allowed text-center text-white rounded-lg bg-manta-button-green w-full ${bgColor}`
        )}>
        {validationMsg}
      </div>
    );
  }

  return (
    <>
      {isConnectWallet && (
        <ConnectWallet
          isButtonShape={true}
          className={
            'bg-manta-button-green py-2 cursor-pointer text-white text-xl unselectable-text text-center rounded-lg w-full'
          }
        />
      )}
      {validationMsg && <ValidationBlock validationMsg={validationMsg} />}
      {!isConnectWallet && !validationMsg && <SendButton />}
    </>
  );
};

const SendButton = () => {
  const { txStatus } = useTxStatus();
  const disabled = txStatus?.isProcessing();
  const { send } = useBridgeTx();

  const onClick = () => {
    send();
  };

  return (
    <div>
      {disabled ? (
        <MantaLoading className="py-3" />
      ) : (
        <button
          onClick={onClick}
          className={classNames(
            'py-2 cursor-pointer text-xl btn-hover unselectable-text',
            'text-center rounded-lg btn-primary w-full'
          )}>
          Submit
        </button>
      )}
    </div>
  );
};

export default ValidationButton;
