import React, { useState } from 'react';
import './TabSwitcher.css';
import { Flex } from '@mantine/core';

const TabSwitcher = ({ tabs, activeTab, setActiveTab }) => {

  return (
    <div className="tab-container" style={{width: "100%"}}>
      <Flex style={{ borderBottom: '1px solid #484848'}} w={'100%'}>
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`tab-item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </Flex>
    </div>
  );
};

export default TabSwitcher;
