import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import { default as uiKeyring } from '@polkadot/ui-keyring';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import config from 'config';

const KeyringContext = createContext();

export const KeyringContextProvider = (props) => {
  const [keyring, setKeyring] = useState(null);

  useEffect(() => {
    const polkadotJsIsInjected = () => !!window.injectedWeb3['polkadot-js'];

    const initKeyring = async () => {
      await web3Enable(config.APP_NAME);
      let allAccounts = await web3Accounts();
      allAccounts = allAccounts.map(({ address, meta }) => ({
        address,
        meta: { ...meta, name: meta.name },
      }));
      uiKeyring.loadAll(
        {
          ss58Format: config.SS58_FORMAT,
          isDevelopment: config.DEVELOPMENT_KEYRING
        },
        allAccounts,
      );
      setKeyring(uiKeyring);
    };

    const initKeyringWhenInjected = async () => {
      if (polkadotJsIsInjected()) {
        await initKeyring();
      } else {
        setTimeout(async () => {
          if (!polkadotJsIsInjected()) {
            setKeyring(false);
          } else if (!keyring) {
            await initKeyring();
          }
        }, 500);
      }
    };
    if (keyring) return;
    initKeyringWhenInjected();
  }, [keyring]);



  const value = {
    keyring: keyring
  };

  return (
    <KeyringContext.Provider value={value}>
      {props.children}
    </KeyringContext.Provider>
  );
};

KeyringContextProvider.propTypes = {
  children: PropTypes.any
};

export const useKeyring = () => ({ ...useContext(KeyringContext) });