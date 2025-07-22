import { PlusOutlined } from '@ant-design/icons';
import { Button, PageTitle } from '@components';
import { Tabs } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';

import { useShowNavBarRedesign } from '@app/useShowNavBarRedesign';
import { ExportDestinationList } from './ExportDestinationList';
import { ExportDestinationBuilderModal } from './builder/ExportDestinationBuilderModal';

const PageContainer = styled.div<{ $isShowNavBarRedesign?: boolean }>`
    padding-top: 16px;
    padding-right: 16px;
    background-color: white;
    height: 100%;
    display: flex;
    flex-direction: column;
    border-radius: ${(props) =>
        props.$isShowNavBarRedesign ? props.theme.styles['border-radius-navbar-redesign'] : '8px'};
    ${(props) =>
        props.$isShowNavBarRedesign &&
        `
        margin: 5px;
        box-shadow: ${props.theme.styles['box-shadow-navbar-redesign']};
    `}
`;

const PageHeaderContainer = styled.div`
    && {
        padding-left: 20px;
        padding-right: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    }
`;

const TitleContainer = styled.div`
    flex: 1;
`;

const HeaderActionsContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const StyledTabs = styled(Tabs)`
    &&& .ant-tabs-nav {
        margin-bottom: 0;
        padding-left: 20px;
    }
`;

const Tab = styled(Tabs.TabPane)`
    font-size: 14px;
    line-height: 22px;
`;

const ListContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

export enum TabType {
    Destinations = 'Destinations',
    RunHistory = 'Run History',
}

export const MetadataExportPage = () => {
    const [selectedTab, setSelectedTab] = useState<TabType>(TabType.Destinations);
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [destinations, setDestinations] = useState<any[]>([]);
    const isShowNavBarRedesign = useShowNavBarRedesign();

    const handleCreateDestination = () => {
        setShowCreateModal(true);
    };

    const onSwitchTab = (newTab: string) => {
        setSelectedTab(newTab as TabType);
    };

    const handleSubmit = (input: any, resetState: () => void, shouldRun?: boolean) => {
        console.log('Creating export destination:', input);
        
        // Create a new destination object
        const newDestination = {
            urn: `urn:li:exportDestination:${Date.now()}`,
            name: input.name || `${input.type} Export`,
            type: input.type,
            status: 'ACTIVE',
            lastRun: new Date().toISOString(),
            schedule: input.schedule?.interval || '0 0 * * *',
        };
        
        // Add to destinations list
        setDestinations(prev => [...prev, newDestination]);
        setShowCreateModal(false);
        resetState();
    };

    const handleCancel = () => {
        setShowCreateModal(false);
    };

    const TabTypeToListComponent = {
        [TabType.Destinations]: (
            <ExportDestinationList
                showCreateModal={showCreateModal}
                setShowCreateModal={setShowCreateModal}
                destinations={destinations}
                setDestinations={setDestinations}
            />
        ),
        [TabType.RunHistory]: (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                Export run history will be displayed here
            </div>
        ),
    };

    return (
        <PageContainer $isShowNavBarRedesign={isShowNavBarRedesign}>
            <PageHeaderContainer>
                <TitleContainer>
                    <PageTitle
                        title="Export Destination"
                        subTitle="Configure and schedule exports to send metadata to your destinations"
                    />
                </TitleContainer>
                <HeaderActionsContainer>
                    {selectedTab === TabType.Destinations && (
                        <Button
                            variant="filled"
                            onClick={handleCreateDestination}
                            data-testid="create-export-destination-button"
                        >
                            <PlusOutlined style={{ marginRight: '4px' }} /> Create new destination
                        </Button>
                    )}
                </HeaderActionsContainer>
            </PageHeaderContainer>
            <StyledTabs
                activeKey={selectedTab}
                size="large"
                onTabClick={(tab) => onSwitchTab(tab)}
            >
                <Tab key={TabType.Destinations} tab={TabType.Destinations} />
                <Tab key={TabType.RunHistory} tab={TabType.RunHistory} />
            </StyledTabs>
            <ListContainer>{TabTypeToListComponent[selectedTab]}</ListContainer>
            <ExportDestinationBuilderModal
                open={showCreateModal}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={false}
            />
        </PageContainer>
    );
}; 