import React, { useState } from 'react';
import MantaIcon from 'resources/images/manta.png';
import OutsideClickHandler from 'react-outside-click-handler';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import { useModal } from 'hooks';
import ConnectSignerModal from 'components/Modal/connectSigner';
import ZkAccountModal from '../Accounts/ZkAccountModal';
import ZkAccountOutOfDateModal from '../Accounts/ZkAccountOutOfDateModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import signerIsOutOfDate from 'utils/validation/signerIsOutOfDate';
import { useConfig } from 'contexts/configContext';

const ZkAccountDisplay = () => {
  const [showZkModal, setShowZkModal] = useState(false);
  return (
    <div className="relative">
      <OutsideClickHandler onOutsideClick={() => setShowZkModal(false)}>
        <div
          className="flex gap-3 py-3 px-4 text-white font-medium cursor-pointer bg-fifth border border-white border-opacity-20 rounded-lg"
          onClick={() => setShowZkModal(!showZkModal)}>
          <img className="w-6 h-6" src={MantaIcon} alt="Manta" />
          zkAddress
        </div>
        {showZkModal && <ZkAccountModal />}
      </OutsideClickHandler>
    </div>
  );
};

const ZkAccountSignerOutOfDate = () => {
  const [showZkModal, setShowZkModal] = useState(false);
  return (
    <div className="relative">
      <OutsideClickHandler onOutsideClick={() => setShowZkModal(false)}>
        <FontAwesomeIcon
          icon={faCircleExclamation}
          className="absolute top-0 right-0 w-5 h-5"
          color="#FFFFFF"
        />
        <div
          className="flex gap-3 py-3 px-4 text-white font-medium cursor-pointer bg-fifth border border-white border-opacity-20 rounded-lg"
          onClick={() => setShowZkModal(!showZkModal)}>
          <img className="w-6 h-6" src={MantaIcon} alt="Manta" />
          zkAddress
        </div>
        {showZkModal && <ZkAccountOutOfDateModal />}
      </OutsideClickHandler>
    </div>
  );
};

const ZkAccountConnect = () => {
  const { ModalWrapper, showModal } = useModal();
  return (
    <>
      <button
        className="bg-manta-button-blue text-white py-3 px-4 font-medium cursor-pointer rounded-lg"
        onClick={showModal}>
        Connect Signer
      </button>
      <ModalWrapper>
        <ConnectSignerModal />
      </ModalWrapper>
    </>
  );
};

const ZkAccountButton = () => {
  const { privateAddress, signerVersion } = usePrivateWallet();
  const config = useConfig();

  if (privateAddress) {
    return <ZkAccountDisplay />;
  } else if (signerIsOutOfDate(config, signerVersion)) {
    return <ZkAccountSignerOutOfDate />;
  } else {
    return <ZkAccountConnect />;
  }
};

export default ZkAccountButton;
