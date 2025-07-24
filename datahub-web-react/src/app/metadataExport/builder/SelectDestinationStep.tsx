import { FormOutlined, SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';

import { ANTD_GRAY } from '@app/entity/shared/constants';
import { ExportDestinationBuilderStep } from './ExportDestinationBuilderModal';
import { DestinationConfig, StepProps } from './types';
import { Button } from '@src/alchemy-components';

const Container = styled.div`
    max-height: 82vh;
    display: flex;
    flex-direction: column;
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
    padding-bottom: 12px;
    overflow: hidden;
`;

const SearchBarContainer = styled.div`
    display: flex;
    justify-content: end;
    width: auto;
    padding-right: 12px;
`;

const StyledSearchBar = styled(Input)`
    background-color: white;
    border-radius: 8px;
    box-shadow: 0px 0px 30px 0px rgb(239 239 239);
    border: 1px solid #e0e0e0;
    margin: 0 0 15px 0px;
    max-width: 300px;
    font-size: 16px;
`;

const StyledSearchOutlined = styled(SearchOutlined)`
    color: #a9adbd;
`;

const PlatformListContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 31%), 1fr));
    gap: 10px;
    height: 100%;
    overflow-y: auto;
    padding-right: 12px;
`;

interface DestinationOptionProps {
    destination: DestinationConfig;
    onClick: () => void;
}

function DestinationOption({ destination, onClick }: DestinationOptionProps) {
    const { name, displayName, description } = destination;

    // For now, we'll use a placeholder icon. In a real implementation, you'd have proper icons
    const logoComponent = <FormOutlined style={{ color: ANTD_GRAY[8], fontSize: 28 }} />;

    return (
        <DataPlatformCard
            onClick={onClick}
            name={displayName}
            logoUrl={undefined}
            description={description}
            logoComponent={logoComponent}
        />
    );
}

const DataPlatformCard = (props: any) => <div style={{border: '1px solid #ccc', padding: 16, borderRadius: 8, margin: 8}}>{props.children || 'Data Platform Card'}</div>;

/**
 * Component responsible for selecting the export destination type
 */
export const SelectDestinationStep = ({ state, updateState, goTo, cancel, exportDestinations }: StepProps) => {
    const [searchFilter, setSearchFilter] = useState('');

    const onSelectDestination = (type: string) => {
        const newState = {
            ...state,
            config: undefined,
            type,
        };
        updateState(newState);
        goTo(ExportDestinationBuilderStep.DEFINE_CONFIGURATION);
    };

    const filteredDestinations = exportDestinations.filter(
        (destination) =>
            destination.displayName.toLocaleLowerCase().includes(searchFilter.toLocaleLowerCase()) ||
            destination.name.toLocaleLowerCase().includes(searchFilter.toLocaleLowerCase()),
    );

    filteredDestinations.sort((a, b) => {
        return a.displayName.localeCompare(b.displayName);
    });

    return (
        <Container>
            <Section>
                <SearchBarContainer>
                    <StyledSearchBar
                        placeholder="Search export destinations..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        allowClear
                        prefix={<StyledSearchOutlined />}
                    />
                </SearchBarContainer>
                <PlatformListContainer data-testid="export-destination-options">
                    {filteredDestinations.map((destination) => (
                        <DestinationOption 
                            key={destination.urn} 
                            destination={destination} 
                            onClick={() => onSelectDestination(destination.name)} 
                        />
                    ))}
                </PlatformListContainer>
            </Section>
            <Button variant="text" color="gray" onClick={cancel}>
                Cancel
            </Button>
        </Container>
    );
}; 