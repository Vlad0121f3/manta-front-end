// @ts-nocheck
import React from 'react';
import { SendContextProvider } from './SendContext';
import PageContent from 'components/PageContent';
import SendForm from './SendForm';

const SendPage = () => {
  return (
    <SendContextProvider>
      <PageContent>
        <SendForm />
      </PageContent>
    </SendContextProvider>
  );
};

export default SendPage;
