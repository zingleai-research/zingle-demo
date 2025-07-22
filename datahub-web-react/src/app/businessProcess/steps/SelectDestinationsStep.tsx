import { 
    DatabaseOutlined, 
    CloudOutlined, 
    ApiOutlined, 
    FileTextOutlined,
    DownOutlined,
    RightOutlined
} from '@ant-design/icons';
import { Typography, Card } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';

import { BusinessProcessBuilderStep } from '../steps';
import { BusinessProcessBuilderState, DataDestination, StepProps } from '../types';
import { Button } from '@src/alchemy-components';

const { Title, Text } = Typography;

const Container = styled.div`
    max-height: 82vh;
    display: flex;
    flex-direction: column;
    padding: 0 20px;
`;

// Add a scrollable content wrapper for the main section
const ScrollableSection = styled.div`
    flex: 1 1 auto;
    overflow-y: auto;
    min-height: 0;
    margin-bottom: 0;
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 32px;
`;

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
`;

const DestinationCard = styled(Card)<{ selected?: boolean }>`
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid ${props => props.selected ? '#52c41a' : '#f0f0f0'};
    border-radius: 8px;
    
    &:hover {
        border-color: #52c41a;
        box-shadow: 0 4px 12px rgba(82, 196, 26, 0.15);
    }
`;

const IconContainer = styled.div<{ color: string }>`
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: ${props => props.color};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    color: white;
    font-size: 18px;
`;

const CardHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 8px;
`;

const CardTitle = styled(Title)`
    margin: 0 !important;
    font-size: 16px !important;
    font-weight: 600 !important;
`;

const CardDescription = styled(Text)`
    color: #666;
    font-size: 14px;
    line-height: 1.4;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0;
    padding-top: 24px;
    border-top: 1px solid #f0f0f0;
    position: sticky;
    bottom: 0;
    background: #fff;
    z-index: 2;
`;

// Add a new styled component for the right-side button group
const RightButtonGroup = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
`;

// Add a styled component for the scrollable columns list
const ColumnsScrollContainer = styled.div`
    margin-left: 24px;
    margin-top: 8px;
    max-height: 180px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

// Mock data destinations
const availableDestinations: DataDestination[] = [
    {
        id: 'data-warehouse',
        name: 'Data Warehouse',
        type: 'warehouse',
        description: 'Centralized repository for business intelligence',
        icon: 'database'
    },
    {
        id: 'data-lake',
        name: 'Data Lake',
        type: 'lake',
        description: 'Raw data storage for analytics and ML',
        icon: 'cloud'
    },
    {
        id: 'analytics-dashboard',
        name: 'Analytics Dashboard',
        type: 'dashboard',
        description: 'Visual analytics and reporting platform',
        icon: 'api'
    },
    {
        id: 'ml-pipeline',
        name: 'ML Pipeline',
        type: 'ml',
        description: 'Machine learning model training pipeline',
        icon: 'database'
    },
    {
        id: 'reporting-system',
        name: 'Reporting System',
        type: 'reporting',
        description: 'Automated report generation and distribution',
        icon: 'file'
    },
    {
        id: 'data-mart',
        name: 'Data Mart',
        type: 'mart',
        description: 'Specialized data store for specific business areas',
        icon: 'database'
    }
];

const getIconComponent = (iconName: string) => {
    switch (iconName) {
        case 'database':
            return <DatabaseOutlined />;
        case 'cloud':
            return <CloudOutlined />;
        case 'api':
            return <ApiOutlined />;
        case 'file':
            return <FileTextOutlined />;
        default:
            return <DatabaseOutlined />;
    }
};

const getIconColor = (type: string) => {
    switch (type) {
        case 'database':
            return '#1890ff';
        case 'storage':
        case 'warehouse':
            return '#52c41a';
        case 'api':
            return '#722ed1';
        case 'file':
            return '#fa8c16';
        case 'lake':
            return '#13c2c2';
        case 'dashboard':
            return '#eb2f96';
        case 'ml':
            return '#faad14';
        case 'reporting':
            return '#fa8c16';
        case 'mart':
            return '#1890ff';
        default:
            return '#666';
    }
};

// Mock tables and columns data
const mockTables = [
    {
        name: 'Driver_Information',
        columns: [
            'driver_id', 'first_name', 'last_name', 'license_number', 'license_expiry',
            'date_of_birth', 'address', 'phone_number', 'email', 'vehicle_assigned',
        ],
    },
    {
        name: 'Person',
        columns: [
            'person_id', 'first_name', 'last_name', 'gender', 'date_of_birth',
            'address', 'phone_number', 'email', 'national_id', 'occupation',
        ],
    },
];

export const SelectDestinationsStep = ({ state, updateState, goTo, prev, cancel }: StepProps) => {
    // selectedTables: { [tableName]: Set of selected columns }
    const [selectedTables, setSelectedTables] = useState<{ [key: string]: Set<string> }>({});
    // expandedTables: Set of expanded table names
    const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());

    const isTableSelected = (tableName: string) =>
        selectedTables[tableName] && selectedTables[tableName].size === mockTables.find(t => t.name === tableName)?.columns.length;
    const isColumnSelected = (tableName: string, column: string) =>
        selectedTables[tableName]?.has(column);

    const handleTableCheckbox = (tableName: string, checked: boolean) => {
        const table = mockTables.find(t => t.name === tableName);
        if (!table) return;
        setSelectedTables(prev => ({
            ...prev,
            [tableName]: checked ? new Set(table.columns) : new Set(),
        }));
    };

    const handleColumnCheckbox = (tableName: string, column: string, checked: boolean) => {
        setSelectedTables(prev => {
            const prevSet = prev[tableName] ? new Set(prev[tableName]) : new Set();
            if (checked) {
                prevSet.add(column);
            } else {
                prevSet.delete(column);
            }
            return { ...prev, [tableName]: prevSet };
        });
    };

    const toggleExpand = (tableName: string) => {
        setExpandedTables(prev => {
            const newSet = new Set(prev);
            if (newSet.has(tableName)) {
                newSet.delete(tableName);
            } else {
                newSet.add(tableName);
            }
            return newSet;
        });
    };

    const onNext = () => {
        // Save selected tables/columns to parent state
        updateState({
            ...state,
            selectedTables: Object.fromEntries(
                Object.entries(selectedTables).map(([table, cols]) => [table, Array.from(cols)])
            ),
        });
        goTo(BusinessProcessBuilderStep.METADATA_GENERATION);
    };

    return (
        <Container>
            <ScrollableSection>
                <Section>
                    <Title level={4}>Select Tables</Title>
                    <Text type="secondary" style={{ marginBottom: 16 }}>
                        Choose tables and columns to include in your process
                    </Text>
                    <div>
                        {mockTables.map(table => (
                            <div key={table.name} style={{ marginBottom: 20, border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span
                                        style={{ cursor: 'pointer', marginRight: 8, fontSize: 16 }}
                                        onClick={() => toggleExpand(table.name)}
                                    >
                                        {expandedTables.has(table.name) ? <DownOutlined /> : <RightOutlined />}
                                    </span>
                                    <label style={{ fontWeight: 600, fontSize: 16, marginBottom: 0 }}>
                                        <input
                                            type="checkbox"
                                            checked={isTableSelected(table.name)}
                                            onChange={e => handleTableCheckbox(table.name, e.target.checked)}
                                            style={{ marginRight: 8 }}
                                        />
                                        {table.name}
                                    </label>
                                </div>
                                {expandedTables.has(table.name) && (
                                    <ColumnsScrollContainer>
                                        {table.columns.map(col => (
                                            <label key={col} style={{ fontSize: 15 }}>
                                                <input
                                                    type="checkbox"
                                                    checked={isColumnSelected(table.name, col)}
                                                    onChange={e => handleColumnCheckbox(table.name, col, e.target.checked)}
                                                    style={{ marginRight: 6 }}
                                                />
                                                {col}
                                            </label>
                                        ))}
                                    </ColumnsScrollContainer>
                                )}
                            </div>
                        ))}
                    </div>
                </Section>
            </ScrollableSection>
            <ButtonContainer>
                <Button variant="text" color="gray" onClick={cancel}>
                    Cancel
                </Button>
                <RightButtonGroup>
                    {prev && (
                        <Button variant="text" color="gray" onClick={prev}>
                            Previous
                        </Button>
                    )}
                    <Button onClick={onNext}>
                        Next
                    </Button>
                </RightButtonGroup>
            </ButtonContainer>
        </Container>
    );
}; 