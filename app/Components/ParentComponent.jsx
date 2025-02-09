import React from 'react';
import DownReceipt from './pdf/DownReceipt';

const ParentComponent = () => {
  const data = '677a3567fb5f5a6cf40e997e'; // Ensure this is the correct data

  return (
    <div>
      <DownReceipt data={data} />
    </div>
  );
};

export default ParentComponent;
