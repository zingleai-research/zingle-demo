import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Typography, Card, Steps, Tag, Button, Divider, Badge, Tabs, PlusOutlined, Modal } from 'antd';
import ReactFlow, { 
    Background, 
    BackgroundVariant, 
    Edge, 
    EdgeTypes, 
    MiniMap, 
    NodeTypes, 
    useReactFlow,
    Handle,
    Position,
    NodeProps,
    ReactFlowProvider,
    Controls
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
    ArrowLeftOutlined, 
    TeamOutlined, 
    CheckCircleOutlined, 
    ClockCircleOutlined, 
    ExclamationCircleOutlined,
    UserOutlined,
    MobileOutlined,
    IdcardOutlined,
    FileTextOutlined,
    SettingOutlined,
    CreditCardOutlined,
    CrownOutlined,
    CheckCircleFilled,
    FileTextOutlined as FileTextIcon,
    BarChartOutlined,
    ExportOutlined,
    HomeOutlined,
    FilterOutlined,
    ArrowsAltOutlined,
    ShrinkOutlined,
    EditOutlined,
    SaveOutlined,
    CloseOutlined,
    InfoCircleOutlined,
    UserOutlined as UserIcon,
    CheckCircleTwoTone,
    WarningTwoTone,
} from '@ant-design/icons';
import { Input, Tooltip, Alert } from 'antd';

// Import actual platform logos
import databricksLogo from '@images/databrickslogo.png';
import snowflakeLogo from '@images/snowflakelogo.png';
import bigqueryLogo from '@images/bigquerylogo.png';
import postgresLogo from '@images/postgreslogo.png';
import mysqlLogo from '@images/mysqllogo-2.png';
import redshiftLogo from '@images/redshiftlogo.png';
import tableauLogo from '@images/tableaulogo.png';
import powerbiLogo from '@images/powerbilogo.png';
import { useHistory } from 'react-router';

// Import actual lineage components
import LineageEntityNode, { LINEAGE_ENTITY_NODE_NAME } from '@app/lineageV2/LineageEntityNode/LineageEntityNode';
import LineageTransformationNode, { LINEAGE_TRANSFORMATION_NODE_NAME } from '@app/lineageV2/LineageTransformationNode/LineageTransformationNode';
import { LineageTableEdge, LINEAGE_TABLE_EDGE_NAME } from '@app/lineageV2/LineageEdge/LineageTableEdge';
import { LineageEntity } from '@app/lineageV2/common';
import { EntityType, LineageDirection } from '@types';


const { Title, Text, Paragraph } = Typography;

const PageContainer = styled.div`
    padding: 24px;
    width: 100%;
    max-width: none;
    margin: 0;
    background: #f5f5f5;
    min-height: 100vh;
    overflow-y: auto;
    height: 100vh;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 32px;
    background: white;
    padding: 32px;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 10;
`;

const BackButton = styled(Button)`
    margin-right: 24px;
    border-radius: 8px;
    height: 40px;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
`;

const HeaderContent = styled.div`
    flex: 1;
`;

const IconContainer = styled.div`
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 24px;
    color: white;
    font-size: 28px;
    box-shadow: 0 4px 16px rgba(82, 196, 26, 0.3);
`;

const ContentCard = styled(Card)`
    margin-bottom: 32px;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    background: white;
    
    .ant-card-body {
        padding: 32px;
    }
`;

const StepCard = styled(Card)`
    margin-bottom: 16px;
    border-left: 4px solid #1890ff;
`;

const DocumentList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 16px 0;
`;

const DocumentItem = styled.li`
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    
    &:last-child {
        border-bottom: none;
    }
`;

const StatusTag = styled(Tag)`
    margin-left: auto;
`;

const TableContainer = styled.div`
    margin: 16px 0;
    overflow-x: auto;
`;

const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
    background: #fafafa;
    padding: 12px;
    text-align: left;
    font-weight: 600;
    border-bottom: 1px solid #f0f0f0;
`;

const TableCell = styled.td`
    padding: 12px;
    border-bottom: 1px solid #f0f0f0;
`;

const StepsContainer = styled.div`
    display: flex;
    gap: 40px;
    margin-top: 32px;
`;

const StepsList = styled.div`
    flex: 1;
    max-width: 450px;
`;

const StepDetails = styled.div`
    flex: 2;
    background: white;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    min-height: 500px;
`;

const StepItem = styled.div<{ isActive: boolean }>`
    padding: 20px;
    margin-bottom: 12px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: ${props => props.isActive ? '#e6f7ff' : 'white'};
    border: 2px solid ${props => props.isActive ? '#1890ff' : '#f0f0f0'};
    box-shadow: ${props => props.isActive ? '0 8px 24px rgba(24, 144, 255, 0.2)' : '0 4px 16px rgba(0, 0, 0, 0.1)'};
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: ${props => props.isActive ? '0 12px 32px rgba(24, 144, 255, 0.3)' : '0 8px 24px rgba(0, 0, 0, 0.15)'};
        border-color: #1890ff;
    }
`;

const StepTitle = styled.div`
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 6px;
    color: #262626;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const StepDescription = styled.div`
    font-size: 14px;
    color: #666;
    margin-left: 24px;
`;

const StyledTabs = styled(Tabs)`
    width: 100%;
    
    .ant-tabs-tab {
        font-size: 16px;
        font-weight: 500;
        padding: 12px 24px;
    }
    
    .ant-tabs-tab-active {
        font-weight: 600;
    }
    
    .ant-tabs-content-holder {
        padding-top: 24px;
        min-height: 500px;
        width: 100%;
    }
    
    .ant-tabs-nav {
        margin-bottom: 24px;
        background: white;
        padding: 0 16px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .ant-tabs-content {
        width: 100%;
    }
    
    .ant-tabs-tabpane {
        width: 100%;
        min-width: 100%;
    }
`;

const EmptyTabContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    width: 100%;
    min-width: 100%;
    color: #999;
    font-size: 16px;
`;

const TabsContainer = styled.div`
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    width: 100%;
    min-width: 100%;
    flex: 1;
`;

// Process Flow Diagram Components
const ProcessFlowContainer = styled.div`
    height: 800px;
    width: 100%;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
`;

const StyledReactFlow = styled(ReactFlow)`
    width: 100%;
    height: 100%;
    
    .react-flow__node {
        transition: all 0.3s ease;
    }
    
    .react-flow__node:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
`;

const DriverOnboardingPage: React.FC = () => {
    const history = useHistory();
    const [selectedStep, setSelectedStep] = useState(0);

    // Custom process step node that mimics lineage appearance
    const ProcessStepNode = ({ data }: NodeProps<any>) => {
        const { title, description, icon, status } = data;
        
        const getStatusColor = (status: string) => {
            switch (status) {
                case 'completed': return '#52c41a';
                case 'active': return '#1890ff';
                case 'pending': return '#faad14';
                case 'error': return '#ff4d4f';
                default: return '#d9d9d9';
            }
        };

        return (
            <div className="react-flow__node">
                <Handle type="target" position={Position.Top} />
                <div
                    className="react-flow__node-default"
                    style={{
                        background: 'white',
                        border: '2px solid #1890ff',
                        borderRadius: '8px',
                        padding: '16px',
                        width: '250px',
                        height: 'auto',
                        minHeight: '100px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        cursor: 'grab',
                        transition: 'all 0.3s ease',
                        userSelect: 'none',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseDown={(e) => {
                        e.currentTarget.style.cursor = 'grabbing';
                    }}
                    onMouseUp={(e) => {
                        e.currentTarget.style.cursor = 'grab';
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', gap: '8px' }}>
                        <div
                            style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                background: getStatusColor(status),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '14px',
                            }}
                        >
                            {icon}
                        </div>
                        <div style={{ 
                            fontWeight: 600, 
                            fontSize: '14px', 
                            color: '#262626',
                            flex: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {title}
                        </div>
                    </div>
                    <div style={{ 
                        fontSize: '12px', 
                        color: '#666', 
                        lineHeight: 1.4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                    }}>
                        {description}
                    </div>
                </div>
                <Handle type="source" position={Position.Bottom} />
            </div>
        );
    };

    const nodeTypes: NodeTypes = {
        'process-step': ProcessStepNode,
    };

    const processFlowNodes = [
        {
            id: '1',
            type: 'process-step',
            position: { x: 100, y: 100 },
            data: {
                title: 'Registration Initiation',
                description: 'Driver downloads app or is registered by admin',
                icon: <UserOutlined />,
                status: 'completed'
            }
        },
        {
            id: '2',
            type: 'process-step',
            position: { x: 300, y: 100 },
            data: {
                title: 'Mobile Number Verification',
                description: 'OTP verification process',
                icon: <MobileOutlined />,
                status: 'completed'
            }
        },
        {
            id: '3',
            type: 'process-step',
            position: { x: 500, y: 100 },
            data: {
                title: 'Personal Information Collection',
                description: 'Basic personal details collection',
                icon: <IdcardOutlined />,
                status: 'completed'
            }
        },
        {
            id: '4',
            type: 'process-step',
            position: { x: 700, y: 100 },
            data: {
                title: 'Document Upload & Verification',
                description: 'Mandatory document collection and verification',
                icon: <FileTextOutlined />,
                status: 'active'
            }
        },
        {
            id: '5',
            type: 'process-step',
            position: { x: 100, y: 300 },
            data: {
                title: 'Service Eligibility & Preferences',
                description: 'Vehicle and service preferences setup',
                icon: <SettingOutlined />,
                status: 'pending'
            }
        },
        {
            id: '6',
            type: 'process-step',
            position: { x: 300, y: 300 },
            data: {
                title: 'Payment Setup',
                description: 'UPI and bank account configuration',
                icon: <CreditCardOutlined />,
                status: 'pending'
            }
        },
        {
            id: '7',
            type: 'process-step',
            position: { x: 500, y: 300 },
            data: {
                title: 'Subscription Plan Selection',
                description: 'Plan selection and activation',
                icon: <CrownOutlined />,
                status: 'pending'
            }
        },
        {
            id: '8',
            type: 'process-step',
            position: { x: 700, y: 300 },
            data: {
                title: 'Final Review & Activation',
                description: 'Final verification and platform activation',
                icon: <CheckCircleFilled />,
                status: 'pending'
            }
        }
    ];

    const processFlowEdges = [
        { id: 'e1-2', source: '1', target: '2', type: 'default' },
        { id: 'e2-3', source: '2', target: '3', type: 'default' },
        { id: 'e3-4', source: '3', target: '4', type: 'default' },
        { id: 'e4-5', source: '4', target: '5', type: 'default' },
        { id: 'e5-6', source: '5', target: '6', type: 'default' },
        { id: 'e6-7', source: '6', target: '7', type: 'default' },
        { id: 'e7-8', source: '7', target: '8', type: 'default' }
    ];
    const handleBack = () => {
        history.push('/business-process');
    };

    const DocumentContent = () => {
        const steps = [
            {
                title: 'Registration Initiation',
                description: 'Driver downloads app or is registered by admin',
                content: (
                    <>
                        <Paragraph><strong>Trigger:</strong> Driver downloads the app or is registered by an admin/operator.</Paragraph>
                        <Paragraph><strong>Data Collected:</strong></Paragraph>
                        <ul>
                            <li>Mobile number (with country code)</li>
                            <li>Optionally email</li>
                            <li>Referral code (if any)</li>
                        </ul>
                        <Paragraph><strong>System Actions:</strong></Paragraph>
                        <ul>
                            <li>Create a new person record with role DRIVER</li>
                            <li>Generate a unique driver ID</li>
                            <li>Send OTP for mobile number verification</li>
                            <li>If a referral code is provided, validate it and link the referrer</li>
                        </ul>
                    </>
                )
            },
            {
                title: 'Mobile Number Verification',
                description: 'OTP verification process',
                content: (
                    <>
                        <Paragraph><strong>Action:</strong> Driver enters OTP received on their mobile.</Paragraph>
                        <Paragraph><strong>System Actions:</strong></Paragraph>
                        <ul>
                            <li>Verify OTP</li>
                            <li>Mark mobile number as verified</li>
                            <li>Update is_new flag to false</li>
                            <li>Assign a unique referral code to the new driver</li>
                        </ul>
                    </>
                )
            },
            {
                title: 'Personal Information Collection',
                description: 'Basic personal details collection',
                content: (
                    <>
                        <Paragraph><strong>Data Collected:</strong> First name, last name, date of birth, gender, profile photo.</Paragraph>
                        <Paragraph><strong>System Actions:</strong></Paragraph>
                        <ul>
                            <li>Store personal details in the person and driver_information tables</li>
                            <li>Extract date of birth from Aadhaar if available</li>
                        </ul>
                    </>
                )
            },
            {
                title: 'Document Upload & Verification',
                description: 'Mandatory document collection and verification',
                content: (
                    <>
                        <Paragraph><strong>4.1. Mandatory Documents</strong></Paragraph>
                        <Paragraph><strong>Documents Required:</strong></Paragraph>
                        <ul>
                            <li>Aadhaar Card (front and back)</li>
                            <li>Driving License</li>
                            <li>PAN Card</li>
                            <li>Vehicle Registration Certificate (RC)</li>
                            <li>Vehicle Insurance</li>
                            <li>Vehicle Permit</li>
                            <li>Fitness Certificate</li>
                            <li>Pollution Under Control (PUC) Certificate</li>
                            <li>Bank Account/UPI details for payouts</li>
                        </ul>
                        <Paragraph><strong>Process:</strong></Paragraph>
                        <ul>
                            <li>Driver uploads images of each document via the app</li>
                            <li>For Aadhaar, an OTP-based verification is performed with UIDAI</li>
                            <li>For Driving License and PAN, verification is done via third-party APIs (e.g., HyperVerge, Idfy)</li>
                            <li>System checks for document validity, expiry, and uniqueness</li>
                            <li>If any document fails verification, the driver is notified to re-upload or correct the document</li>
                        </ul>
                        <Paragraph><strong>4.2. Background Verification (if required)</strong></Paragraph>
                        <Paragraph><strong>Trigger:</strong> Based on city/merchant configuration.</Paragraph>
                        <Paragraph><strong>Process:</strong></Paragraph>
                        <ul>
                            <li>Initiate background verification via a third-party service</li>
                            <li>Track status (pending, completed, failed)</li>
                            <li>Only eligible drivers (as per report) proceed</li>
                        </ul>
                    </>
                )
            },
            {
                title: 'Service Eligibility & Preferences',
                description: 'Vehicle and service preferences setup',
                content: (
                    <>
                        <Paragraph><strong>Data Collected:</strong></Paragraph>
                        <ul>
                            <li>Vehicle category (Hatchback, Sedan, SUV, etc.)</li>
                            <li>Service preferences (intra-city, inter-city, rental, special location warrior, etc.)</li>
                            <li>Consent for downgrade to lower service tiers if applicable</li>
                        </ul>
                        <Paragraph><strong>System Actions:</strong></Paragraph>
                        <ul>
                            <li>Store preferences in driver_information</li>
                            <li>Set flags for eligibility (e.g., can_switch_to_rental, can_switch_to_inter_city)</li>
                        </ul>
                    </>
                )
            },
            {
                title: 'Payment Setup',
                description: 'UPI and bank account configuration',
                content: (
                    <>
                        <Paragraph><strong>Data Collected:</strong> UPI VPA, bank account details.</Paragraph>
                        <Paragraph><strong>System Actions:</strong></Paragraph>
                        <ul>
                            <li>Verify VPA via webhook or manual review</li>
                            <li>Set up auto-pay mandates for subscription plans if required</li>
                            <li>Track payment status (auto_pay_status, payment_pending)</li>
                        </ul>
                    </>
                )
            },
            {
                title: 'Subscription Plan Selection',
                description: 'Plan selection and activation',
                content: (
                    <>
                        <Paragraph><strong>Action:</strong> Driver selects a subscription plan (if applicable).</Paragraph>
                        <Paragraph><strong>System Actions:</strong></Paragraph>
                        <ul>
                            <li>Check eligibility and outstanding dues</li>
                            <li>Activate subscription and update subscribed status</li>
                        </ul>
                    </>
                )
            },
            {
                title: 'Final Review & Activation',
                description: 'Final verification and platform activation',
                content: (
                    <>
                        <Paragraph><strong>System Checks:</strong></Paragraph>
                        <ul>
                            <li>All mandatory documents are verified and valid</li>
                            <li>No outstanding payments or blocks</li>
                            <li>Background verification (if required) is complete</li>
                            <li>Driver is not already active or blocked</li>
                        </ul>
                        <Paragraph><strong>Actions:</strong></Paragraph>
                        <ul>
                            <li>Set enabled and active flags to true</li>
                            <li>Record enabled_at timestamp</li>
                            <li>Send welcome message (SMS/WhatsApp) to the driver</li>
                            <li>Driver is now eligible to receive ride requests</li>
                        </ul>
                    </>
                )
            }
        ];
        const [selectedStep, setSelectedStep] = useState(0);
        // Editable state for each section
        const [editing, setEditing] = useState({
            overview: false,
            step: false,
            dataflow: false,
            exception: false,
            comms: false,
            post: false,
            refs: false,
        });
        // Section content state
        const [overview, setOverview] = useState(`The driver onboarding process is a multi-step procedure designed to ensure that only qualified, verified, and compliant drivers are allowed to operate on the platform. The process involves identity verification, document collection and validation, eligibility checks, payment setup, and final activation.`);
        const [overviewInput, setOverviewInput] = useState(overview);
        const [stepContent, setStepContent] = useState(steps);
        const [dataflow, setDataflow] = useState(`<strong>Tables Involved:</strong> person, driver_information, driver_license, driver_pan_card, vehicle, vehicle_documents, bank_account, etc.<br/><strong>Key Status Flags:</strong> aadhaar_verified, verified, enabled, active, blocked, subscribed, payment_pending<br/><strong>Audit & Compliance:</strong> All actions are timestamped (created_at, updated_at, enabled_at). Block/unblock actions are tracked with reasons and expiry times.`);
        const [dataflowInput, setDataflowInput] = useState(dataflow);
        // Sections that need annotation
        const needsAttention = {
            overview: true,
            step: false,
            dataflow: true,
            exception: false,
            comms: false,
            post: false,
            refs: false,
        };
        // Edit handlers for Overview
        const startEditOverview = () => { setOverviewInput(overview); setEditing(e => ({ ...e, overview: true })); };
        const saveOverview = () => { setOverview(overviewInput); setEditing(e => ({ ...e, overview: false })); };
        const cancelOverview = () => { setEditing(e => ({ ...e, overview: false })); };
        // Edit handlers for Dataflow
        const startEditDataflow = () => { setDataflowInput(dataflow); setEditing(e => ({ ...e, dataflow: true })); };
        const saveDataflow = () => { setDataflow(dataflowInput); setEditing(e => ({ ...e, dataflow: false })); };
        const cancelDataflow = () => { setEditing(e => ({ ...e, dataflow: false })); };

        // Mock stats
        const documentOwner = 'John Doe';
        const lastEdited = '2024-06-01 14:32';
        const sectionsNeedingAttention = Object.values(needsAttention).filter(Boolean).length;
        const sectionsVerified = 3; // Example: 3 sections verified
        const [showNewSectionModal, setShowNewSectionModal] = useState(false);
        const handleAddSection = () => {
            setShowNewSectionModal(true);
        };
        const handleCloseModal = () => {
            setShowNewSectionModal(false);
        };
        return (
            <div style={{ position: 'relative' }}>
                <ContentCard style={{ marginBottom: 24, background: '#f6faff', border: '1px solid #e6f7ff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <UserOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                            <span style={{ fontWeight: 500 }}>Owner:</span>
                            <span>{documentOwner}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <ClockCircleOutlined style={{ fontSize: 20, color: '#faad14' }} />
                            <span style={{ fontWeight: 500 }}>Last Edited:</span>
                            <span>{lastEdited}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <WarningTwoTone twoToneColor="#faad14" style={{ fontSize: 20 }} />
                            <span style={{ fontWeight: 500 }}>Sections Needing Attention:</span>
                            <span>{sectionsNeedingAttention}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 20 }} />
                            <span style={{ fontWeight: 500 }}>Sections Verified:</span>
                            <span>{sectionsVerified}</span>
                        </div>
                    </div>
                </ContentCard>
                <ContentCard>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                        <Title level={3} style={{ margin: 0, flex: 1 }}>Overview</Title>
                        {needsAttention.overview && (
                            <Tooltip title="This section requires additional information.">
                                <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: 20, marginRight: 8 }} />
                            </Tooltip>
                        )}
                        <Tooltip title="Edit Overview">
                            <Button
                                icon={<EditOutlined />}
                                shape="circle"
                                size="small"
                                onClick={startEditOverview}
                                style={{ marginLeft: 8 }}
                            />
                        </Tooltip>
                    </div>
                    {needsAttention.overview && (
                        <Alert type="info" showIcon icon={<InfoCircleOutlined />} message="This section requires additional information. Please review and update as needed." style={{ marginBottom: 12 }} />
                    )}
                    {editing.overview ? (
                        <div style={{ marginBottom: 8 }}>
                            <Input.TextArea
                                value={overviewInput}
                                onChange={e => setOverviewInput(e.target.value)}
                                autoSize={{ minRows: 3, maxRows: 8 }}
                            />
                            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                                <Button type="primary" icon={<SaveOutlined />} onClick={saveOverview} size="small">Save</Button>
                                <Button icon={<CloseOutlined />} onClick={cancelOverview} size="small">Cancel</Button>
                            </div>
                        </div>
                    ) : (
                        <Paragraph>{overview}</Paragraph>
                    )}
                </ContentCard>

                <ContentCard>
                    <Title level={3}>Step-by-Step Procedure</Title>
                    <StepsContainer>
                        <StepsList>
                            {stepContent.map((step, index) => (
                                <StepItem
                                    key={index}
                                    isActive={selectedStep === index}
                                    onClick={() => setSelectedStep(index)}
                                >
                                    <StepTitle>{`${index + 1}. ${step.title}`}</StepTitle>
                                    <StepDescription>{step.description}</StepDescription>
                                </StepItem>
                            ))}
                        </StepsList>
                        <StepDetails>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                <Title level={4} style={{ margin: 0, flex: 1 }}>{stepContent[selectedStep].title}</Title>
                                {needsAttention.step && (
                                    <Tooltip title="This section requires additional information.">
                                        <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: 20, marginRight: 8 }} />
                                    </Tooltip>
                                )}
                                <Tooltip title="Edit Step">
                                    <Button
                                        icon={<EditOutlined />}
                                        shape="circle"
                                        size="small"
                                        onClick={() => {
                                            // For demo, just alert. You can implement per-step editing as needed.
                                            alert('Editing this step is supported!');
                                        }}
                                        style={{ marginLeft: 8 }}
                                    />
                                </Tooltip>
                            </div>
                            {stepContent[selectedStep].content}
                        </StepDetails>
                    </StepsContainer>
                </ContentCard>

                <ContentCard>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                        <Title level={3} style={{ margin: 0, flex: 1 }}>System Data Flow & Key Fields</Title>
                        {needsAttention.dataflow && (
                            <Tooltip title="This section requires additional information.">
                                <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: 20, marginRight: 8 }} />
                            </Tooltip>
                        )}
                        <Tooltip title="Edit System Data Flow & Key Fields">
                            <Button
                                icon={<EditOutlined />}
                                shape="circle"
                                size="small"
                                onClick={startEditDataflow}
                                style={{ marginLeft: 8 }}
                            />
                        </Tooltip>
                    </div>
                    {needsAttention.dataflow && (
                        <Alert type="info" showIcon icon={<InfoCircleOutlined />} message="This section requires additional information. Please review and update as needed." style={{ marginBottom: 12 }} />
                    )}
                    {editing.dataflow ? (
                        <div style={{ marginBottom: 8 }}>
                            <Input.TextArea
                                value={dataflowInput}
                                onChange={e => setDataflowInput(e.target.value)}
                                autoSize={{ minRows: 3, maxRows: 8 }}
                            />
                            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                                <Button type="primary" icon={<SaveOutlined />} onClick={saveDataflow} size="small">Save</Button>
                                <Button icon={<CloseOutlined />} onClick={cancelDataflow} size="small">Cancel</Button>
                            </div>
                        </div>
                    ) : (
                        <Paragraph>
                            <span dangerouslySetInnerHTML={{ __html: dataflow }} />
                        </Paragraph>
                    )}
                </ContentCard>

                <ContentCard>
                    <Title level={3}>Exception Handling</Title>
                    <Paragraph><strong>Document Rejection:</strong> Driver is notified with the reason and can re-upload</Paragraph>
                    <Paragraph><strong>Duplicate/Invalid Documents:</strong> System prevents linking the same document to multiple drivers</Paragraph>
                    <Paragraph><strong>Payment Failure:</strong> Driver is prompted to resolve outstanding dues before activation</Paragraph>
                    <Paragraph><strong>Background Verification Failure:</strong> Driver is marked as ineligible and not activated</Paragraph>
                </ContentCard>

                <ContentCard>
                    <Title level={3}>Communication & Notifications</Title>
                    <Paragraph><strong>Automated Messages:</strong> Welcome, document status, payment reminders, and onboarding completion are sent via SMS/WhatsApp</Paragraph>
                    <Paragraph><strong>Dashboard Alerts:</strong> Admins can view onboarding status, block/unblock drivers, and review document issues</Paragraph>
                </ContentCard>

                <ContentCard>
                    <Title level={3}>Post-Onboarding</Title>
                    <Paragraph>Driver can update profile and documents as needed (subject to re-verification)</Paragraph>
                    <Paragraph>Ongoing compliance checks (e.g., document expiry, behavior monitoring) may trigger re-verification or blocking</Paragraph>
                </ContentCard>

                <ContentCard>
                    <Title level={3}>References</Title>
                    <Paragraph><strong>CSV Documentation:</strong> .codebase2docs/output/driver_information_documentation.csv, .codebase2docs/output/person_documentation.csv</Paragraph>
                    <Paragraph><strong>Backend APIs:</strong> DriverOnboarding.hs, DriverOnboarding/Status.hs, DriverOnboardingV2.hs</Paragraph>
                    <Paragraph><strong>Frontend Flows:</strong> onBoardingFlow in Flow.purs, RegistrationScreen/Controller.purs</Paragraph>
                    <Paragraph><strong>API Specs:</strong> Onboarding.yaml</Paragraph>
                </ContentCard>
                {/* Floating plus button */}
                <Button
                    type="primary"
                    shape="circle"
                    icon={<PlusOutlined />}
                    size="large"
                    style={{
                        position: 'fixed',
                        bottom: 48,
                        right: 48,
                        zIndex: 1000,
                        boxShadow: '0 4px 16px rgba(24,144,255,0.15)'
                    }}
                    onClick={handleAddSection}
                />
                <Modal
                    title="Add New Section"
                    open={showNewSectionModal}
                    onCancel={handleCloseModal}
                    footer={null}
                >
                    <p>TODO: Section creation UI goes here.</p>
                </Modal>
            </div>
        );
    };

    // Add Data Assets tab content
    const DataAssetsContent = () => {
        const tables = [
            {
                name: 'driver_information',
                description: 'Stores driver profile, license, and vehicle assignment details.',
                columns: [
                    { name: 'driver_id', description: 'Unique identifier for the driver.' },
                    { name: 'first_name', description: 'Driver’s first name.' },
                    { name: 'last_name', description: 'Driver’s last name.' },
                    { name: 'license_number', description: 'Driver’s license number.' },
                    { name: 'license_expiry', description: 'License expiry date.' },
                    { name: 'date_of_birth', description: 'Date of birth of the driver.' },
                    { name: 'address', description: 'Residential address.' },
                    { name: 'phone_number', description: 'Contact phone number.' },
                    { name: 'email', description: 'Email address.' },
                    { name: 'vehicle_assigned', description: 'Assigned vehicle identifier.' },
                ],
            },
            {
                name: 'person',
                description: 'Stores personal information for all users (drivers, admins, etc.).',
                columns: [
                    { name: 'person_id', description: 'Unique identifier for the person.' },
                    { name: 'first_name', description: 'Person’s first name.' },
                    { name: 'last_name', description: 'Person’s last name.' },
                    { name: 'gender', description: 'Gender of the person.' },
                    { name: 'date_of_birth', description: 'Date of birth.' },
                    { name: 'address', description: 'Residential address.' },
                    { name: 'phone_number', description: 'Contact phone number.' },
                    { name: 'email', description: 'Email address.' },
                    { name: 'national_id', description: 'National identification number.' },
                    { name: 'occupation', description: 'Occupation or job title.' },
                ],
            },
        ];
        const events = [
            {
                name: 'registration_initiated',
                description: 'Triggered when a driver starts the onboarding process.'
            },
            {
                name: 'mobile_verified',
                description: 'After successful OTP verification.'
            },
            {
                name: 'document_uploaded',
                description: 'When required documents are uploaded.'
            },
            {
                name: 'eligibility_checked',
                description: 'After eligibility and preferences are set.'
            },
            {
                name: 'payment_setup',
                description: 'When payment details are configured.'
            },
            {
                name: 'subscription_selected',
                description: 'When a subscription plan is chosen.'
            },
            {
                name: 'activated',
                description: 'When the driver is fully onboarded and activated.'
            },
        ];
        const [selectedType, setSelectedType] = useState<'table' | 'events'>('table');
        const [selectedTable, setSelectedTable] = useState(tables[0].name);
        const [search, setSearch] = useState('');
        const filteredTables = tables.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
        const currentTable = tables.find(t => t.name === selectedTable) || tables[0];

        return (
            <div style={{ display: 'flex', gap: 32, minHeight: 400 }}>
                {/* Left: Table & Events List */}
                <div style={{ minWidth: 260, maxWidth: 320, background: '#fafbfc', borderRadius: 12, boxShadow: '0 2px 8px rgba(24,144,255,0.04)', padding: 20, display: 'flex', flexDirection: 'column', height: 'fit-content', maxHeight: 520, overflowY: 'auto' }}>
                    <input
                        type="text"
                        placeholder="Search tables..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            marginBottom: 16,
                            padding: '8px 12px',
                            borderRadius: 6,
                            border: '1px solid #e0e0e0',
                            fontSize: 15
                        }}
                    />
                    <div style={{ marginBottom: 18 }}>
                        <div style={{ fontWeight: 700, fontSize: 15, color: '#888', marginBottom: 6, position: 'sticky', top: 0, background: '#fafbfc', zIndex: 1 }}>Tables</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 180, overflowY: 'auto' }}>
                            {filteredTables.map(table => (
                                <div
                                    key={table.name}
                                    onClick={() => { setSelectedType('table'); setSelectedTable(table.name); }}
                                    style={{
                                        padding: '10px 14px',
                                        borderRadius: 8,
                                        background: selectedType === 'table' && selectedTable === table.name ? '#e6f7ff' : 'transparent',
                                        fontWeight: selectedType === 'table' && selectedTable === table.name ? 600 : 500,
                                        color: selectedType === 'table' && selectedTable === table.name ? '#1890ff' : '#222',
                                        cursor: 'pointer',
                                        border: selectedType === 'table' && selectedTable === table.name ? '2px solid #1890ff' : '2px solid transparent',
                                        transition: 'all 0.2s',
                                        marginBottom: 2
                                    }}
                                >
                                    {table.name}
                                </div>
                            ))}
                            {filteredTables.length === 0 && (
                                <div style={{ color: '#aaa', padding: '12px 0', textAlign: 'center' }}>No tables found</div>
                            )}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: '#888', marginBottom: 6, marginTop: 10, position: 'sticky', top: 200, background: '#fafbfc', zIndex: 1 }}>Events</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <div
                                onClick={() => setSelectedType('events')}
                                style={{
                                    padding: '10px 14px',
                                    borderRadius: 8,
                                    background: selectedType === 'events' ? '#e6f7ff' : 'transparent',
                                    fontWeight: selectedType === 'events' ? 600 : 500,
                                    color: selectedType === 'events' ? '#1890ff' : '#222',
                                    cursor: 'pointer',
                                    border: selectedType === 'events' ? '2px solid #1890ff' : '2px solid transparent',
                                    transition: 'all 0.2s',
                                    marginBottom: 2
                                }}
                            >
                                All Events
                            </div>
                        </div>
                    </div>
                </div>
                {/* Right: Table or Events Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {selectedType === 'table' ? (
                        <ContentCard style={{ minHeight: 340 }}>
                            <Title level={3} style={{ marginBottom: 8 }}>{currentTable.name}</Title>
                            <Text type="secondary" style={{ fontSize: 15 }}>{currentTable.description}</Text>
                            <Divider style={{ margin: '18px 0 12px 0' }} />
                            <Title level={5} style={{ marginBottom: 8 }}>Columns</Title>
                            <div style={{ maxHeight: 260, overflowY: 'auto', border: '1px solid #f0f0f0', borderRadius: 8, boxShadow: '0 1px 4px rgba(24,144,255,0.03)', marginBottom: 18 }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ position: 'sticky', top: 0, background: '#f5f5f5', zIndex: 2, boxShadow: '0 2px 4px rgba(24,144,255,0.04)' }}>
                                        <tr>
                                            <th style={{ textAlign: 'left', padding: '8px 12px', background: '#f5f5f5', fontWeight: 600, fontSize: 15, borderBottom: '1px solid #eee' }}>Column Name</th>
                                            <th style={{ textAlign: 'left', padding: '8px 12px', background: '#f5f5f5', fontWeight: 600, fontSize: 15, borderBottom: '1px solid #eee' }}>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentTable.columns.map(col => (
                                            <tr key={col.name}>
                                                <td style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0', fontWeight: 500 }}>{col.name}</td>
                                                <td style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0', color: '#555' }}>{col.description}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </ContentCard>
                    ) : (
                        <ContentCard style={{ minHeight: 200 }}>
                            <Title level={3} style={{ marginBottom: 8 }}>Events</Title>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 18 }}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'left', padding: '8px 12px', background: '#f5f5f5', fontWeight: 600, fontSize: 15, borderBottom: '1px solid #eee' }}>Event Name</th>
                                        <th style={{ textAlign: 'left', padding: '8px 12px', background: '#f5f5f5', fontWeight: 600, fontSize: 15, borderBottom: '1px solid #eee' }}>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map(event => (
                                        <tr key={event.name}>
                                            <td style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0', fontWeight: 500 }}>{event.name}</td>
                                            <td style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0', color: '#555' }}>{event.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </ContentCard>
                    )}
                </div>
            </div>
        );
    };

    // Add ExportContent component back
    const ExportContent = () => {
        const [syncOption, setSyncOption] = useState('hourly');
        const [destination, setDestination] = useState('databricks');
        const [lastSync, setLastSync] = useState('Never');
        const [syncing, setSyncing] = useState(false);

        const [docSyncOption, setDocSyncOption] = useState('hourly');
        const [docDestination, setDocDestination] = useState('word');
        const [docLastSync, setDocLastSync] = useState('Never');
        const [docSyncing, setDocSyncing] = useState(false);

        const handleSync = () => {
            setSyncing(true);
            setTimeout(() => {
                setLastSync(new Date().toLocaleString());
                setSyncing(false);
            }, 1500);
        };
        const handleDocSync = () => {
            setDocSyncing(true);
            setTimeout(() => {
                setDocLastSync(new Date().toLocaleString());
                setDocSyncing(false);
            }, 1500);
        };

        return (
            <div style={{ padding: '40px', minHeight: '400px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
                {/* Data Platform Sync Card */}
                <Card style={{ minWidth: 420, borderRadius: 12, boxShadow: '0 2px 8px rgba(24,144,255,0.08)', width: 480, flex: 1 }}>
                    <Title level={4}>Sync Business Process</Title>
                    <Paragraph type="secondary">
                        Sync your generated business process documentation to your data platform (e.g., Databricks, Snowflake). Choose your sync frequency and destination below.
                    </Paragraph>
                    <Divider />
                    <div style={{ marginBottom: 24 }}>
                        <Title level={5} style={{ marginBottom: 8 }}>Sync Frequency</Title>
                        <div style={{ display: 'flex', gap: 16 }}>
                            <Button type={syncOption === 'hourly' ? 'primary' : 'default'} onClick={() => setSyncOption('hourly')}>Every Hour</Button>
                            <Button type={syncOption === 'daily' ? 'primary' : 'default'} onClick={() => setSyncOption('daily')}>Daily</Button>
                            <Button type={syncOption === 'manual' ? 'primary' : 'default'} onClick={() => setSyncOption('manual')}>Manual</Button>
                        </div>
                    </div>
                    <div style={{ marginBottom: 24 }}>
                        <Title level={5} style={{ marginBottom: 8 }}>Destination</Title>
                        <div style={{ display: 'flex', gap: 16 }}>
                            <Button type={destination === 'databricks' ? 'primary' : 'default'} onClick={() => setDestination('databricks')}>Databricks</Button>
                            <Button type={destination === 'snowflake' ? 'primary' : 'default'} onClick={() => setDestination('snowflake')}>Snowflake</Button>
                            <Button type={destination === 'bigquery' ? 'primary' : 'default'} onClick={() => setDestination('bigquery')}>BigQuery</Button>
                        </div>
                    </div>
                    <div style={{ marginBottom: 24 }}>
                        <Title level={5} style={{ marginBottom: 8 }}>Sync Actions</Title>
                        <Button type="primary" loading={syncing} onClick={handleSync} disabled={syncing}>
                            {syncing ? 'Syncing...' : 'Sync Now'}
                        </Button>
                        <div style={{ marginTop: 12, color: '#888', fontSize: 14 }}>
                            Last Sync: <span style={{ fontWeight: 500 }}>{lastSync}</span>
                        </div>
                    </div>
                </Card>
                {/* Documentation Platform Sync Card */}
                <Card style={{ minWidth: 420, borderRadius: 12, boxShadow: '0 2px 8px rgba(24,144,255,0.08)', width: 480, flex: 1 }}>
                    <Title level={4}>Sync Column Descriptions</Title>
                    <Paragraph type="secondary">
                        Keep your column descriptions in sync with platforms like Word or Confluence. Choose your sync frequency and destination below.
                    </Paragraph>
                    <Divider />
                    <div style={{ marginBottom: 24 }}>
                        <Title level={5} style={{ marginBottom: 8 }}>Sync Frequency</Title>
                        <div style={{ display: 'flex', gap: 16 }}>
                            <Button type={docSyncOption === 'hourly' ? 'primary' : 'default'} onClick={() => setDocSyncOption('hourly')}>Every Hour</Button>
                            <Button type={docSyncOption === 'daily' ? 'primary' : 'default'} onClick={() => setDocSyncOption('daily')}>Daily</Button>
                            <Button type={docSyncOption === 'manual' ? 'primary' : 'default'} onClick={() => setDocSyncOption('manual')}>Manual</Button>
                        </div>
                    </div>
                    <div style={{ marginBottom: 24 }}>
                        <Title level={5} style={{ marginBottom: 8 }}>Destination</Title>
                        <div style={{ display: 'flex', gap: 16 }}>
                            <Button type={docDestination === 'word' ? 'primary' : 'default'} onClick={() => setDocDestination('word')}>Word</Button>
                            <Button type={docDestination === 'confluence' ? 'primary' : 'default'} onClick={() => setDocDestination('confluence')}>Confluence</Button>
                        </div>
                    </div>
                    <div style={{ marginBottom: 24 }}>
                        <Title level={5} style={{ marginBottom: 8 }}>Sync Actions</Title>
                        <Button type="primary" loading={docSyncing} onClick={handleDocSync} disabled={docSyncing}>
                            {docSyncing ? 'Syncing...' : 'Sync Now'}
                        </Button>
                        <div style={{ marginTop: 12, color: '#888', fontSize: 14 }}>
                            Last Sync: <span style={{ fontWeight: 500 }}>{docLastSync}</span>
                        </div>
                    </div>
                </Card>
            </div>
        );
    };

    const tabItems = [
        {
            key: 'document',
            label: (
                <span>
                    <FileTextIcon style={{ marginRight: 8 }} />
                    Document
                </span>
            ),
            children: <DocumentContent />
        },
        {
            key: 'dataassets',
            label: (
                <span>
                    <BarChartOutlined style={{ marginRight: 8 }} />
                    Data Assets
                </span>
            ),
            children: <DataAssetsContent />
        },
        {
            key: 'export',
            label: (
                <span>
                    <ExportOutlined style={{ marginRight: 8 }} />
                    Export
                </span>
            ),
            children: <ExportContent />
        }
    ];

    return (
        <PageContainer>
            <Header>
                <BackButton icon={<ArrowLeftOutlined />} onClick={handleBack}>
                    Back to Business Processes
                </BackButton>
                <IconContainer>
                    <TeamOutlined />
                </IconContainer>
                <HeaderContent>
                    <Title level={2} style={{ margin: 0 }}>
                        Driver Onboarding Process
                    </Title>
                    <Text type="secondary">
                        Multi-step procedure for driver registration, verification, document collection, and platform activation
                    </Text>
                </HeaderContent>
            </Header>

            <TabsContainer>
                <StyledTabs 
                    defaultActiveKey="document" 
                    items={tabItems}
                    size="large"
                />
            </TabsContainer>
        </PageContainer>
    );
};

export { DriverOnboardingPage }; 