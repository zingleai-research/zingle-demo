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
    max-height: 250px;
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

// Replace mockTables with 30 ride-hailing app related tables
const mockTables = [
    { name: 'Driver_Information', columns: ['driver_id', 'first_name', 'last_name', 'license_number', 'license_expiry', 'date_of_birth', 'address', 'phone_number', 'email', 'vehicle_assigned'] },
    { name: 'Person', columns: ['person_id', 'first_name', 'last_name', 'gender', 'date_of_birth', 'address', 'phone_number', 'email', 'national_id', 'occupation'] },
    { name: 'Vehicle', columns: ['vehicle_id', 'make', 'model', 'year', 'license_plate', 'color', 'type', 'status'] },
    { name: 'Trip', columns: ['trip_id', 'driver_id', 'rider_id', 'start_time', 'end_time', 'start_location', 'end_location', 'distance', 'fare', 'status'] },
    { name: 'Payment', columns: ['payment_id', 'trip_id', 'amount', 'method', 'status', 'timestamp'] },
    { name: 'Feedback', columns: ['feedback_id', 'trip_id', 'rider_id', 'driver_id', 'rating', 'comments', 'timestamp'] },
    { name: 'Support_Ticket', columns: ['ticket_id', 'user_id', 'issue_type', 'description', 'status', 'created_at', 'resolved_at'] },
    { name: 'Subscription', columns: ['subscription_id', 'user_id', 'plan', 'start_date', 'end_date', 'status'] },
    { name: 'Promotion', columns: ['promo_id', 'code', 'discount', 'start_date', 'end_date', 'usage_limit', 'status'] },
    { name: 'Incident', columns: ['incident_id', 'trip_id', 'reported_by', 'description', 'severity', 'status', 'timestamp'] },
    { name: 'Rider', columns: ['rider_id', 'first_name', 'last_name', 'email', 'phone_number', 'rating'] },
    { name: 'Driver_License', columns: ['license_id', 'driver_id', 'number', 'expiry_date', 'issued_by'] },
    { name: 'Insurance', columns: ['insurance_id', 'vehicle_id', 'provider', 'policy_number', 'expiry_date'] },
    { name: 'Location', columns: ['location_id', 'latitude', 'longitude', 'address', 'type'] },
    { name: 'Route', columns: ['route_id', 'start_location', 'end_location', 'distance', 'estimated_time'] },
    { name: 'Fare', columns: ['fare_id', 'trip_id', 'base_fare', 'distance_fare', 'time_fare', 'total'] },
    { name: 'Payment_Method', columns: ['method_id', 'user_id', 'type', 'details', 'is_default'] },
    { name: 'Notification', columns: ['notification_id', 'user_id', 'type', 'message', 'sent_at', 'status'] },
    { name: 'Admin', columns: ['admin_id', 'first_name', 'last_name', 'email', 'role', 'status'] },
    { name: 'City', columns: ['city_id', 'name', 'state', 'country', 'active'] },
    { name: 'Zone', columns: ['zone_id', 'city_id', 'name', 'type', 'active'] },
    { name: 'Driver_Document', columns: ['document_id', 'driver_id', 'type', 'file_url', 'status', 'uploaded_at'] },
    { name: 'Rider_Payment', columns: ['payment_id', 'rider_id', 'method', 'details', 'is_default'] },
    { name: 'Driver_Payment', columns: ['payment_id', 'driver_id', 'method', 'details', 'is_default'] },
    { name: 'Rating', columns: ['rating_id', 'trip_id', 'rider_id', 'driver_id', 'score', 'comments'] },
    { name: 'Waitlist', columns: ['waitlist_id', 'user_id', 'created_at', 'status'] },
    { name: 'Driver_Schedule', columns: ['schedule_id', 'driver_id', 'day', 'start_time', 'end_time'] },
    { name: 'Maintenance', columns: ['maintenance_id', 'vehicle_id', 'type', 'date', 'cost', 'status'] },
    { name: 'Lost_and_Found', columns: ['item_id', 'trip_id', 'description', 'reported_by', 'status', 'found_at'] },
    { name: 'Coupon', columns: ['coupon_id', 'code', 'discount', 'expiry_date', 'status'] },
];

export const SelectDestinationsStep = ({ state, updateState, goTo, prev, cancel }: StepProps) => {
    // selectedTables: { [tableName]: Set of selected columns }
    const [selectedTables, setSelectedTables] = useState<{ [key: string]: Set<string> }>({});
    // expandedTables: Set of expanded table names
    const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
    // Add a search bar above the table list
    const [search, setSearch] = useState('');
    const filteredTables = mockTables.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

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
                    <Text type="secondary" style={{ marginBottom: 16 }}>
                        Choose tables and columns to include in your process
                    </Text>
                    <input
                        type="text"
                        placeholder="Search tables..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            maxWidth: 400,
                            marginBottom: 20,
                            padding: '8px 12px',
                            borderRadius: 6,
                            border: '1px solid #e0e0e0',
                            fontSize: 15,
                        }}
                    />
                    <div>
                        {filteredTables.map(table => (
                            <div key={table.name} style={{ marginBottom: 10, border: '1px solid #eee', borderRadius: 6, padding: 8, minHeight: 28 }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span
                                        style={{ cursor: 'pointer', marginRight: 6, fontSize: 13 }}
                                        onClick={() => toggleExpand(table.name)}
                                    >
                                        {expandedTables.has(table.name) ? <DownOutlined /> : <RightOutlined />}
                                    </span>
                                    <label style={{ fontWeight: 500, fontSize: 13, marginBottom: 0 }}>
                                        <input
                                            type="checkbox"
                                            checked={isTableSelected(table.name)}
                                            onChange={e => handleTableCheckbox(table.name, e.target.checked)}
                                            style={{ marginRight: 6 }}
                                        />
                                        {table.name}
                                    </label>
                                </div>
                                {expandedTables.has(table.name) && (
                                    <ColumnsScrollContainer style={{ maxHeight: 90 }}>
                                        {table.columns.map(column => (
                                            <label key={column} style={{ fontWeight: 400, fontSize: 11, marginBottom: 0 }}>
                                                <input
                                                    type="checkbox"
                                                    checked={isColumnSelected(table.name, column)}
                                                    onChange={e => handleColumnCheckbox(table.name, column, e.target.checked)}
                                                    style={{ marginRight: 6 }}
                                                />
                                                {column}
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