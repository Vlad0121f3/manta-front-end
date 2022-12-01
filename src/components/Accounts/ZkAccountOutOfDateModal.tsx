//@ts-nocheck
import React from 'react';

const ZkAccountOutOfDateModal = () => {
  return (
    <div className="flex flex-col items-center w-80 h-56 mt-3 bg-primary rounded-lg p-4 absolute right-0 top-full z-50 border border-white border-opacity-20">
      <h1 className="text-center pt-3 pb-2 text-white font-medium text-xl">
        Signer Out of Date
      </h1>
      <p className="py-4 pl-8 pr-5 text-xss tighter-word-space text-white text-opacity-70">
        Your signer is out of date, please install the latest version to view
        zkAddress and zkAssets.
      </p>
      <a
        href="https://signer.manta.network/"
        target="_blank"
        className="my-1 text-white hover:cursor-pointer flex flex-row items-center gap-3"
        rel="noreferrer"
      >
        <button className="text-white text-sm mt-1 mb-2 h-10 w-28 bg-manta-button-light-blue rounded-lg">
          Install Now
        </button>
      </a>
    </div>
  );
};

export default ZkAccountOutOfDateModal;
