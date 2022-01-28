import React, { useState, useRef, useEffect, useCallback } from 'react';
import { base58Encode } from '@polkadot/util-crypto';
import FormInput from 'pages/SendPage/SendFromForm/SendAmountInput';
import Button from 'components/elements/Button';
import { useSubstrate } from 'contexts/substrateContext';
import Svgs from 'resources/icons';
import { useExternalAccount } from 'contexts/externalAccountContext';
import TxStatus from 'types/TxStatus';
import { makeTxResHandler } from 'utils/api/MakeTxResHandler';
import { base58Decode } from '@polkadot/util-crypto';
import MantaLoading from 'components/elements/Loading';
import { showError, showSuccess } from 'utils/ui/Notifications';
import { selectCoins } from 'coin-selection';
import { SignerInterface } from 'signer-interface';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import { useTxStatus } from 'contexts/txStatusContext';
import Decimal from 'decimal.js';
import getBalanceString from 'utils/ui/getBalanceString';
import Balance from 'types/Balance';
import { getTransferButtonIsDisabled } from 'utils/ui/formValidation';
import { useSelectedAssetType } from 'contexts/selectedAssetTypeContext';
import { useNativeTokenWallet } from 'contexts/nativeTokenWalletContext';
import signerInterfaceConfig from 'config/signerInterfaceConfig';

const PrivateSendTab = () => {
  const { api } = useSubstrate();
  const { externalAccountSigner } = useExternalAccount();
  const { getSpendableAssetsByAssetId, getSpendableBalance } =
    usePrivateWallet();
  const { txStatus, setTxStatus } = useTxStatus();
  const { selectedAssetType } = useSelectedAssetType();
  const { getUserCanPayFee } = useNativeTokenWallet();

  const [privateBalance, setPrivateBalance] = useState(null);
  const [sendAmountInput, setSendAmountInput] = useState(null);
  const [privateTransferAmount, setPrivateTransferAmount] = useState(null);
  const [receivingAddress, setReceivingAddress] = useState(null);
  const [addressInfoText, setAddressInfoText] = useState('Receiver');
  const coinSelection = useRef(null);
  const txResWasHandled = useRef(null);
  const signerInterface = useRef(null);

  useEffect(() => {
    const refreshAssetType = () => {
      onChangeSendAmountInput(sendAmountInput);
    };
    refreshAssetType();
  }, [selectedAssetType]);

  useEffect(() => {
    const displaySpendableBalance = async () => {
      if (!api) {
        return;
      }
      await api.isReady;
      selectedAssetType &&
        setPrivateBalance(getSpendableBalance(selectedAssetType));
    };
    displaySpendableBalance();
  }, [selectedAssetType, txStatus, getSpendableBalance, api]);

  const onPrivateTransferSuccess = async (block, extrinsic = '') => {
    // Every batched tx gets passed separately, only handle the first
    if (txResWasHandled.current === true) {
      return;
    }
    signerInterface.current.cleanupTxSuccess();
    txResWasHandled.current = true;
    showSuccess('Transfer successful', extrinsic);
    setTxStatus(TxStatus.finalized(block));
  };

  const onPrivateTransferFailure = (block, error) => {
    // Every batched tx gets passed separately, only handle the first
    if (txResWasHandled.current === true) {
      return;
    }
    console.error(error);
    signerInterface.current.cleanupTxFailure();
    txResWasHandled.current = true;
    setTxStatus(TxStatus.failed(block, error));
    showError('Transfer failed');
  };

  const onPrivateTransferUpdate = (message) => {
    setTxStatus(TxStatus.processing(message));
  };

  const handleUserCannotPayFee = () => {
    setTxStatus(TxStatus.failed());
    showError('Transfer failed: cannot pay fee');
  };

  const onClickSend = async () => {
    txResWasHandled.current = false;

    signerInterface.current = new SignerInterface(api, signerInterfaceConfig);
    const signerIsConnected = await signerInterface.current.signerIsConnected();
    if (!signerIsConnected) {
      showError('Open Manta Signer desktop app and sign in to continue');
      return;
    }

    setTxStatus(TxStatus.processing());

    coinSelection.current = selectCoins(
      privateTransferAmount.valueAtomicUnits,
      getSpendableAssetsByAssetId(selectedAssetType.assetId),
      selectedAssetType.assetId
    );

    try {
      const transactions =
        await signerInterface.current.buildExternalPrivateTransferTxs(
          receivingAddress,
          coinSelection.current
        );
      const txResHandler = makeTxResHandler(
        api,
        onPrivateTransferSuccess,
        onPrivateTransferFailure,
        onPrivateTransferUpdate
      );
      const batchTx = await api.tx.utility.batch(transactions);
      const userCanPayFee = await getUserCanPayFee(batchTx);
      if (!userCanPayFee) {
        handleUserCannotPayFee();
        return;
      }
      await api.tx.utility
        .batch(transactions)
        .signAndSend(externalAccountSigner, txResHandler);
    } catch (error) {
      onPrivateTransferFailure();
    }
  };

  const buttonIsDisabled = getTransferButtonIsDisabled(
    privateTransferAmount,
    privateBalance,
    receivingAddress,
    txStatus
  );

  const onChangeSendAmountInput = (amountStr) => {
    setSendAmountInput(amountStr);
    try {
      setPrivateTransferAmount(
        Balance.fromBaseUnits(selectedAssetType, new Decimal(amountStr))
      );
    } catch (error) {
      setPrivateTransferAmount(null);
    }
  };

  const onClickMax = useCallback(() => {
    privateBalance && onChangeSendAmountInput(privateBalance.toString(false));
  });

  const onChangeReceivingAddress = (address) => {
    if (!address) {
      setAddressInfoText('Receiver');
      setReceivingAddress(null);
      return;
    }

    try {
      setReceivingAddress(
        base58Encode(
          api
            .createType('MantaAssetShieldedAddress', base58Decode(address))
            .toU8a()
        )
      );
      setAddressInfoText('Receiver');
    } catch (e) {
      setAddressInfoText('Invalid address');
      setReceivingAddress(null);
    }
  };

  return (
    <div className="send-content">
      <div className="py-2">
        <FormInput
          value={sendAmountInput}
          onChange={(e) => onChangeSendAmountInput(e.target.value)}
          onClickMax={onClickMax}
          type="number"
        >
          {getBalanceString(privateBalance)}
        </FormInput>
      </div>
      <img className="mx-auto" src={Svgs.ArrowDownIcon} alt="switch-icon" />
      <div className="py-2">
        <FormInput
          onChange={(e) => onChangeReceivingAddress(e.target.value)}
          prefixIcon={Svgs.WalletIcon}
          isMax={false}
          type="text"
        >
          {addressInfoText}
        </FormInput>
      </div>
      {txStatus?.isProcessing() ? (
        <MantaLoading className="py-4" />
      ) : (
        <Button
          onClick={onClickSend}
          disabled={buttonIsDisabled}
          className="btn-primary btn-hover w-full text-lg py-3"
        >
          Send
        </Button>
      )}
    </div>
  );
};

export default PrivateSendTab;
