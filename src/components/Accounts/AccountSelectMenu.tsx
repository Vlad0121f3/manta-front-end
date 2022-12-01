// @ts-nocheck
import classNames from 'classnames';
import { useExternalAccount } from 'contexts/externalAccountContext';
import { useKeyring } from 'contexts/keyringContext';
import { useTxStatus } from 'contexts/txStatusContext';
import { useMetamask } from 'contexts/metamaskContext';
import React, { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import Svgs from 'resources/icons';
import WalletSelectBar from './WalletSelectIconBar';
import ConnectWallet from './ConnectWallet';
import AccountSelectDropdown from './AccountSelectDropdown';

const DisplayAccountsButton = () => {
  const { txStatus } = useTxStatus();
  const { ethAddress } = useMetamask();
  const disabled = txStatus?.isProcessing();
  const { selectedWallet } = useKeyring();
  const { externalAccount } = useExternalAccount();
  const [showAccountList, setShowAccountList] = useState(false);
  const [isMetamaskSelected, setIsMetamaskSelected] = useState(false);

  const onClickAccountSelect = () => {
    !disabled && setShowAccountList(!showAccountList);
  };

  const isMetamaskEnabled =
    !!ethAddress && window?.location?.pathname?.includes('dolphin/bridge');

  const ExternalAccountBlock = ({text}) => {
    return (
      <>
        <img
          className="w-6 h-6"
          src={selectedWallet.logo.src}
          alt={selectedWallet.logo.alt}
        />
        {isMetamaskEnabled && (
          <img className="w-6 h-6" src={Svgs.Metamask} alt={'metamask'} />
        )}
        {text}
      </>
    );
  }

  return (
    <div className="relative">
      <OutsideClickHandler onOutsideClick={() => setShowAccountList(false)}>
        <div
          className={classNames(
            'flex gap-3 py-3 p-6 border border-white border-opacity-20 bg-fifth dark:text-black dark:text-white',
            'font-medium cursor-pointer rounded-lg items-center',
            { disabled: disabled }
          )}
          onClick={onClickAccountSelect}>
          <ExternalAccountBlock
            text={isMetamaskEnabled ? 'Connected' : externalAccount?.meta.name}
          />
        </div>
        {showAccountList && (
          <div className="w-80 flex flex-col mt-3 absolute right-0 top-full border border-white border-opacity-20 rounded-lg text-black dark:text-white">
            <div className="flex flex-row items-center justify-between bg-fourth rounded-t-lg">
              <div className="flex flex-row items-center">
                <WalletSelectBar
                  isMetamaskSelected={isMetamaskSelected}
                  setIsMetamaskSelected={setIsMetamaskSelected}
                />
              </div>
              <div className="relative top-1">
                <ConnectWallet
                  isButtonShape={false}
                  setIsMetamaskSelected={setIsMetamaskSelected}
                />
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto bg-primary px-5 py-5 rounded-b-lg">
              <AccountSelectDropdown isMetamaskSelected={isMetamaskSelected} />
            </div>
          </div>
        )}
      </OutsideClickHandler>
    </div>
  );
};

const AccountSelectMenu = () => {
  const { externalAccount } = useExternalAccount();

  return externalAccount ? (
    <DisplayAccountsButton />
  ) : (
    <ConnectWallet
      isButtonShape={true}
      className={
        'bg-manta-button-green text-white py-3 px-4 font-medium cursor-pointer rounded-lg z-10'
      }
    />
  );
};

export default AccountSelectMenu;
