// @ts-nocheck
import React, { useState } from 'react';
import classNames from 'classnames';
import MantaLoading from 'components/Loading';
import ConnectWallet from 'components/Accounts/ConnectWallet';
import { ZkAccountConnect } from 'components/Navbar/ZkAccountButton';
import { useTxStatus } from 'contexts/txStatusContext';
import Balance from 'types/Balance';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import { useExternalAccount } from 'contexts/externalAccountContext';
import { useSend } from './SendContext';
import { useConfig } from 'contexts/configContext';
import signerIsOutOfDate from 'utils/validation/signerIsOutOfDate';

const SendButton = () => {
  const { send, isToPrivate, isToPublic, isPublicTransfer, isPrivateTransfer } =
    useSend();
  const { txStatus } = useTxStatus();
  const disabled = txStatus?.isProcessing();

  let buttonLabel;
  if (isToPrivate()) {
    buttonLabel = 'To Private';
  } else if (isToPublic()) {
    buttonLabel = 'To Public';
  } else if (isPublicTransfer()) {
    buttonLabel = 'Public Transfer';
  } else if (isPrivateTransfer()) {
    buttonLabel = 'Private Transfer';
  }
  const onClickHandler = () => {
    if (!disabled) {
      send();
    }
  };

  return (
    <button
      id="sendButton"
      onClick={onClickHandler}
      className={classNames(
        'py-2 cursor-pointer unselectable-text',
        'text-center text-white rounded-lg gradient-button w-full',
        { disabled: disabled }
      )}>
      {buttonLabel}
    </button>
  );
};

const ValidationButton = () => {
  const config = useConfig();
  const {
    isPublicTransfer,
    isPrivateTransfer,
    receiverAddress,
    userCanPayFee,
    userHasSufficientFunds,
    receiverAssetType,
    receiverAmountIsOverExistentialBalance,
    senderAssetTargetBalance,
    senderNativeTokenPublicBalance
  } = useSend();
  const { signerIsConnected, signerVersion } = usePrivateWallet();
  const { externalAccount } = useExternalAccount();

  let validationMsg = null;
  let isConnectWallet = false;
  let isConnectSigner = false;
  let bgColor = 'gradient-button filter brightness-50';
  if (!signerIsConnected && !isPublicTransfer() && !externalAccount) {
    validationMsg = 'Connect Wallet and Signer';
    bgColor = 'gradient-button';
  } else if (!signerIsConnected && !isPublicTransfer()) {
    isConnectSigner = true;
  } else if (signerIsOutOfDate(config, signerVersion)) {
    validationMsg = 'Signer Out of Date';
  } else if (!externalAccount) {
    isConnectWallet = true;
  } else if (!senderAssetTargetBalance) {
    validationMsg = 'Enter Amount';
  } else if (userHasSufficientFunds() === false) {
    validationMsg = 'Insuffient balance';
  } else if (
    receiverAddress === null &&
    (isPrivateTransfer() || isPublicTransfer())
  ) {
    validationMsg = `Enter Recipient ${
      isPrivateTransfer() ? 'zkAddress' : 'Substrate address'
    }`;
  } else if (
    receiverAddress === false &&
    (isPrivateTransfer() || isPublicTransfer())
  ) {
    validationMsg = `Invalid ${
      isPrivateTransfer() ? 'zkAddress' : 'Substrate address'
    }`;
  } else if (receiverAmountIsOverExistentialBalance() === false) {
    const existentialDeposit = new Balance(
      receiverAssetType,
      receiverAssetType.existentialDeposit
    );
    validationMsg = `min > ${existentialDeposit.toDisplayString(12, false)}`;
  } else if (userCanPayFee() === false) {
    validationMsg = `Cannot pay ${senderNativeTokenPublicBalance?.assetType?.baseTicker} fee`;
  }

  const ValidationBlock = ({ validationMsg }) => {
    return (
      <div
        className={classNames(
          `py-2 unselectable-text text-center text-white rounded-lg w-full ${bgColor}`
        )}>
        {validationMsg}
      </div>
    );
  };

  return (
    <>
      {isConnectSigner && (
        <ZkAccountConnect
          className={
            'bg-connect-signer-button py-2 unselectable-text text-center text-white rounded-lg w-full'
          }
        />
      )}
      {isConnectWallet && (
        <ConnectWallet
          isButtonShape={true}
          className={
            'bg-connect-wallet-button py-2 unselectable-text text-center text-white rounded-lg w-full'
          }
        />
      )}
      {validationMsg && <ValidationBlock validationMsg={validationMsg} />}
      {!isConnectSigner && !isConnectWallet && !validationMsg && <SendButton />}
    </>
  );
};

const DisplayButton = () => {
  const { txStatus } = useTxStatus();

  if (txStatus?.isProcessing()) {
    return <MantaLoading className="ml-6 py-4 place-self-center" />;
  } else {
    return <ValidationButton />;
  }
};

export default DisplayButton;
