// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useTxStatus } from 'contexts/txStatusContext';
import GradientText from 'components/GradientText';
import BalanceDisplay from 'components/Balance/BalanceDisplay';


const BalanceInput = ({
  onChangeAmountInput,
  inputValue,
  onClickMax,
  balanceText,
  shouldShowLoader
}) => {
  const { txStatus } = useTxStatus();
  const disabled = txStatus?.isProcessing();

  return (
    <div
      className={classNames(
        'flex flex-col w-full rounded-lg manta-bg-gray content-around justify-center h-20',
        { disabled: disabled }
      )}
    >
      <div className="flex flex-col justify-items-center">
        <input
          id="amountInput"
          onChange={(e) => onChangeAmountInput(e.target.value)}
          className={classNames(
            'w-1/2 absolute left-4 bottom-7 p-2 text-xl font-bold placeholder-gray-500 dark:placeholder-gray-500 text-black dark:text-white manta-bg-gray bg-opacity-0 outline-none rounded-lg',
            { disabled: disabled }
          )}
          value={inputValue}
          placeholder={'0.00'}
          disabled={disabled}
        />
        <MaxButton
          id="maxAmount"
          isDisabled={disabled}
          onClickMax={onClickMax}
        />
      </div>
      <BalanceDisplay
        balance={balanceText}
        className="text-xs text-white mt-2.5 absolute right-11 bottom-3"
        loader={shouldShowLoader}
      />
    </div>
  );
};

BalanceInput.propTypes = {
  onChangeAmountInput: PropTypes.func,
  inputValue: PropTypes.string,
  onClickMax: PropTypes.func,
  balanceText: PropTypes.string,
  shouldShowLoader: PropTypes.bool
};

const MaxButton = ({ onClickMax, isDisabled }) => {
  const onClick = () => {
    !isDisabled && onClickMax();
  };
  return (
    <span
      onClick={onClick}
      className={classNames(
        'cursor-pointer',
        'text-center rounded-lg unselectable-text absolute left-6 bottom-3 flex items-center text-xss font-semibold manta-gray',
        { disabled: isDisabled }
      )}
    >
      <GradientText text="Select Max" />
    </span>
  );
};

MaxButton.propTypes = {
  onClickMax: PropTypes.func,
  disabled: PropTypes.bool
};


export default BalanceInput;