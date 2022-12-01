// @ts-nocheck
import classNames from 'classnames';
import { useModal } from 'hooks';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ConnectWalletModal from 'components/Modal/connectWalletModal';

const ConnectWallet = ({ isButtonShape, setIsMetamaskSelected, className='' }) => {
  const { ModalWrapper, showModal } = useModal();
  const handleOnClick = () => showModal();
  return (
    <>
      {isButtonShape ? (
        <button className={classNames(className)} onClick={handleOnClick}>
          Connect Wallet
        </button>
      ) : (
        <FontAwesomeIcon
          className="w-6 h-6 px-5 py-4 cursor-pointer z-10 text-secondary"
          icon={faPlusCircle}
          onClick={handleOnClick}
        />
      )}
      <ModalWrapper>
        <ConnectWalletModal setIsMetamaskSelected={setIsMetamaskSelected} />
      </ModalWrapper>
    </>
  );
};


export default ConnectWallet;
