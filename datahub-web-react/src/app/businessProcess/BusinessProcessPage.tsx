import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Typography } from 'antd';
import { useHistory } from 'react-router';
import { PageRoutes } from '@conf/Global';
import { CreateBusinessProcessModal } from './CreateBusinessProcessModal';
import { BusinessProcessBuilderState } from './types';
import { 
    PlusOutlined,
    DatabaseOutlined,
    CloudOutlined,
    ApiOutlined,
    FileTextOutlined,
    BarChartOutlined,
    SettingOutlined,
    TeamOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    SyncOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const BusinessProcessContainer = styled.div`
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
    min-height: 100vh;
    background-color: #f5f5f5;
`;

const Header = styled.div`
    margin-bottom: 32px;
`;

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-top: 24px;
    max-height: calc(100vh - 200px);
    overflow-y: auto;
    padding-right: 16px;
`;

const BusinessProcessCard = styled(Card)<{ isNew?: boolean }>`
    height: 200px;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 1;
    
    ${props => props.isNew && `
        animation: slideInFromTop 0.8s ease-out, glowPulse 2s ease-in-out;
        border: 2px solid #52c41a;
        box-shadow: 0 4px 20px rgba(82, 196, 26, 0.3);
    `}

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .ant-card-body {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 20px;
        pointer-events: auto;
    }

    @keyframes slideInFromTop {
        0% {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
        }
        100% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @keyframes glowPulse {
        0%, 100% {
            box-shadow: 0 4px 20px rgba(82, 196, 26, 0.3);
        }
        50% {
            box-shadow: 0 8px 30px rgba(82, 196, 26, 0.6);
        }
    }

    @keyframes pulse {
        0%, 100% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 0.8;
            transform: scale(1.05);
        }
    }
`;

const CardHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 12px;
`;

const IconContainer = styled.div<{ color: string }>`
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: ${props => props.color};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    color: white;
    font-size: 24px;
`;

const CardContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const CardTitle = styled(Title)`
    margin: 0 0 8px 0 !important;
    font-size: 18px !important;
    font-weight: 600 !important;
`;

const CardDescription = styled(Text)`
    color: #666;
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 16px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

const StatusTag = styled.span<{ status: string }>`
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    background-color: ${props => {
        switch (props.status) {
            case 'active': return '#f6ffed';
            case 'pending': return '#fff7e6';
            case 'completed': return '#f0f8ff';
            case 'error': return '#fff2f0';
            default: return '#f5f5f5';
        }
    }};
    color: ${props => {
        switch (props.status) {
            case 'active': return '#52c41a';
            case 'pending': return '#fa8c16';
            case 'completed': return '#1890ff';
            case 'error': return '#ff4d4f';
            default: return '#666';
        }
    }};
`;

const CreateCard = styled(BusinessProcessCard)`
    border: 2px dashed #d9d9d9;
    background: #fafafa;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: 16px;
    font-weight: 500;

    &:hover {
        border-color: #1890ff;
        color: #1890ff;
        background: #f0f8ff;
    }
`;



const BusinessProcessPage: React.FC = () => {
    const history = useHistory();
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [businessProcesses, setBusinessProcesses] = useState([
        {
            id: 'driver-onboarding',
            name: 'Driver Onboarding Process',
            description: 'Multi-step procedure for driver registration, verification, document collection, and platform activation.',
            icon: <TeamOutlined />,
            iconColor: '#52c41a',
            status: 'active',
            hidden: true // Initially hidden
        },
        {
            id: 'ride-hailing-service',
            name: 'Ride Hailing Service',
            description: 'End-to-end process for ride booking, driver assignment, and payment processing.',
            icon: <DatabaseOutlined />,
            iconColor: '#1890ff',
            status: 'active'
        },
        {
            id: 'food-delivery',
            name: 'Food Delivery Process',
            description: 'Complete workflow from order placement to delivery confirmation and customer feedback.',
            icon: <CloudOutlined />,
            iconColor: '#52c41a',
            status: 'active'
        },
        {
            id: 'payment-processing',
            name: 'Payment Processing',
            description: 'Secure payment handling, fraud detection, and transaction reconciliation.',
            icon: <ApiOutlined />,
            iconColor: '#722ed1',
            status: 'completed'
        },
        {
            id: 'customer-support',
            name: 'Customer Support',
            description: 'Multi-channel support system with ticket management and resolution tracking.',
            icon: <TeamOutlined />,
            iconColor: '#fa8c16',
            status: 'active'
        },
        {
            id: 'inventory-management',
            name: 'Inventory Management',
            description: 'Real-time inventory tracking, reorder automation, and supplier management.',
            icon: <BarChartOutlined />,
            iconColor: '#13c2c2',
            status: 'pending'
        },
        {
            id: 'quality-assurance',
            name: 'Quality Assurance',
            description: 'Automated testing, performance monitoring, and quality metrics tracking.',
            icon: <CheckCircleOutlined />,
            iconColor: '#52c41a',
            status: 'active'
        },
        {
            id: 'data-analytics',
            name: 'Data Analytics Pipeline',
            description: 'Data collection, processing, analysis, and reporting workflow.',
            icon: <FileTextOutlined />,
            iconColor: '#eb2f96',
            status: 'completed'
        },
        {
            id: 'system-maintenance',
            name: 'System Maintenance',
            description: 'Scheduled maintenance, updates, and system health monitoring.',
            icon: <SettingOutlined />,
            iconColor: '#faad14',
            status: 'active'
        },
        {
            id: 'compliance-monitoring',
            name: 'Compliance Monitoring',
            description: 'Regulatory compliance tracking, audit trails, and reporting automation.',
            icon: <ExclamationCircleOutlined />,
            iconColor: '#ff4d4f',
            status: 'pending'
        },
        {
            id: 'performance-optimization',
            name: 'Performance Optimization',
            description: 'System performance analysis, bottleneck identification, and optimization.',
            icon: <SyncOutlined />,
            iconColor: '#722ed1',
            status: 'active'
        },
        {
            id: 'backup-recovery',
            name: 'Backup & Recovery',
            description: 'Automated backup processes, disaster recovery planning, and data restoration.',
            icon: <ClockCircleOutlined />,
            iconColor: '#13c2c2',
            status: 'completed'
        }
    ]);
    
    const handleProcessSelect = (processId: string) => {
        console.log('handleProcessSelect called with:', processId);
        if (processId === 'driver-onboarding') {
            console.log('Navigating to driver onboarding page');
            history.push(`${PageRoutes.BUSINESS_PROCESS}/driver-onboarding`);
        } else {
            console.log(`Selected business process: ${processId}`);
            // Add navigation to process details page or modal
        }
    };

    const handleCreateNew = () => {
        console.log('Create new business process');
        setIsCreateModalVisible(true);
    };

    const handleCreateModalCancel = () => {
        setIsCreateModalVisible(false);
    };

    const handleCreateModalSubmit = (state: BusinessProcessBuilderState) => {
        console.log('Creating business process with state:', state);
        
        // Reveal the hidden Driver Onboarding Process with animation
        setBusinessProcesses(prev => 
            prev.map(process => 
                process.id === 'driver-onboarding'
                    ? { 
                        ...process, 
                        hidden: false,
                        isNew: true,
                        name: state.processName || process.name,
                        description: state.processDescription || process.description
                    }
                    : process
            )
        );
        
        // Close the modal
        setIsCreateModalVisible(false);
        
        // Remove the animation flag after animation completes
        setTimeout(() => {
            setBusinessProcesses(prev => 
                prev.map(process => 
                    process.id === 'driver-onboarding'
                        ? { ...process, isNew: false }
                        : process
                )
            );
        }, 2000);
    };

    return (
        <BusinessProcessContainer>
            <Header>
                <Title level={2} style={{ marginBottom: 8 }}>
                    Business Processes
                </Title>
                <Text type="secondary">
                    Manage and monitor your business processes and workflows
                </Text>
            </Header>

            <GridContainer>
                <CreateCard onClick={handleCreateNew}>
                    <div style={{ textAlign: 'center' }}>
                        <PlusOutlined style={{ fontSize: 32, marginBottom: 8 }} />
                        <div>Create New Process</div>
                    </div>
                </CreateCard>
                
                {businessProcesses
                    .filter(process => !process.hidden)
                    .map((process) => (
                    <BusinessProcessCard
                        key={process.id}
                        isNew={process.isNew}
                        onClick={(e) => {
                            console.log('Card clicked:', process.id);
                            e.preventDefault();
                            e.stopPropagation();
                            try {
                                handleProcessSelect(process.id);
                            } catch (error) {
                                console.error('Navigation error:', error);
                            }
                        }}
                        hoverable
                    >
                        <CardHeader>
                            <IconContainer color={process.iconColor}>
                                {process.icon}
                            </IconContainer>
                            <div>
                                <CardTitle level={4}>{process.name}</CardTitle>
                            </div>
                        </CardHeader>
                        
                        <CardContent>
                            <CardDescription>
                                {process.description}
                            </CardDescription>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <StatusTag status={process.status}>
                                    {process.status.charAt(0).toUpperCase() + process.status.slice(1)}
                                </StatusTag>
                                {process.isNew && (
                                    <span style={{
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        fontSize: '10px',
                                        fontWeight: 'bold',
                                        backgroundColor: '#52c41a',
                                        color: 'white',
                                        animation: 'pulse 1s ease-in-out infinite'
                                    }}>
                                        NEW
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </BusinessProcessCard>
                ))}
            </GridContainer>
            
            <CreateBusinessProcessModal
                key={isCreateModalVisible ? 'open' : 'closed'}
                open={isCreateModalVisible}
                onCancel={handleCreateModalCancel}
                onSubmit={handleCreateModalSubmit}
            />
        </BusinessProcessContainer>
    );
};

export { BusinessProcessPage }; 