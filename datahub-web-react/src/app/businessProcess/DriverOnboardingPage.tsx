import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Typography, Card, Steps, Tag, Button, Divider, Badge, Tabs, Modal } from 'antd';
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
    PlusOutlined,
    SyncOutlined,
    LoadingOutlined,
    SmileTwoTone,
    DownloadOutlined,
} from '@ant-design/icons';
import { Input, Tooltip, Alert } from 'antd';
import ReactMarkdown from 'react-markdown';

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
    padding: 32px;
    width: 100%;
    max-width: none;
    margin: 0;
    background: #f8fafc;
    min-height: 100vh;
    overflow-y: auto;
    height: 100vh;
    position: relative;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 32px;
    background: white;
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    position: relative;
    z-index: 10;
    border: 1px solid #e2e8f0;
`;

const BackButton = styled(Button)`
    margin-right: 32px;
    border-radius: 8px;
    height: 40px;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background: #1890ff;
    border: none;
    color: white;
    font-size: 14px;
    transition: all 0.3s ease;
    
    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
        background: #40a9ff;
    }
    
    &:active {
        transform: translateY(0);
    }
`;

const HeaderContent = styled.div`
    flex: 1;
`;

const IconContainer = styled.div`
    width: 64px;
    height: 64px;
    border-radius: 12px;
    background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 24px;
    color: white;
    font-size: 28px;
    box-shadow: 0 4px 16px rgba(82, 196, 26, 0.2);
`;

const ContentCard = styled(Card)`
    margin-bottom: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    background: white;
    border: 1px solid #e2e8f0;
    overflow: hidden;
    
    .ant-card-body {
        padding: 24px;
    }
`;

const SectionCard = styled.div`
    background: white;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e2e8f0;
    position: relative;
    transition: all 0.3s ease;
    
    &:hover {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
        transform: translateY(-1px);
    }
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
`;

const SectionTitle = styled.h3`
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #262626;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const EditButton = styled(Button)`
    border-radius: 6px;
    height: 32px;
    padding: 0 12px;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
    background: #f0f0f0;
    border: 1px solid #d9d9d9;
    color: #666;
    transition: all 0.3s ease;
    
    &:hover {
        background: #e6f7ff;
        border-color: #1890ff;
        color: #1890ff;
        transform: translateY(-1px);
    }
`;

const MetadataCard = styled.div`
    background: white;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e2e8f0;
    position: relative;
`;

const MetadataGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 16px;
`;

const MetadataItem = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: #f8fafc;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;
    
    &:hover {
        background: #f1f5f9;
        transform: translateY(-1px);
    }
`;

const MetadataIcon = styled.div<{ color: string }>`
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background: ${props => props.color};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 14px;
    box-shadow: 0 2px 8px ${props => props.color}30;
`;

const MetadataContent = styled.div`
    flex: 1;
`;

const MetadataLabel = styled.div`
    font-size: 11px;
    color: #666;
    font-weight: 500;
    margin-bottom: 2px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const MetadataValue = styled.div`
    font-size: 13px;
    color: #262626;
    font-weight: 600;
`;

const DocumentContainer = styled.div`
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e2e8f0;
    max-height: 600px;
    overflow-y: auto;
    position: relative;
    
    &::-webkit-scrollbar {
        width: 6px;
    }
    
    &::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
    }
`;

const SuggestionBox = styled.div`
    background: #fef7ff;
    border: 1px solid #e9d5ff;
    border-radius: 8px;
    padding: 12px 16px;
    margin: 12px 0;
    position: relative;
    box-shadow: 0 2px 8px rgba(168, 85, 247, 0.1);
    
    &::before {
        content: '💡';
        position: absolute;
        top: -6px;
        left: 16px;
        background: white;
        padding: 2px 6px;
        border-radius: 6px;
        font-size: 10px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    }
`;

const SuggestionText = styled.div`
    color: #7c3aed;
    font-style: italic;
    font-weight: 500;
    line-height: 1.5;
    margin-left: 8px;
    font-size: 14px;
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
    console.log("DriverOnboardingPage loaded");
    const history = useHistory();
    const [selectedStep, setSelectedStep] = useState(0);
    const [selectedTables, setSelectedTables] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

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

    const documentMarkdown = `
# Driver Onboarding Process: Business Process Document

## 1. Overview

The driver onboarding process is a multi-step procedure designed to ensure that only qualified, verified, and compliant drivers are allowed to operate on the platform. The process involves identity verification, document collection and validation, eligibility checks, payment setup, and final activation.

---

// Please add a summary of how drivers are discovering about our business. Create a BPD.

## 2. Step-by-Step Procedure

### Step 1: Registration Initiation

- **Trigger:** Driver downloads the app or is registered by an admin/operator.
- **Data Collected:** Mobile number (with country code), optionally email, and referral code (if any).
- **System Actions:**
  - Generate a unique driver ID.
  - Send OTP for mobile number verification.
  - If a referral code is provided, validate it and link the referrer.

// Clarify if registration through admin/operator follows a different verification path

### Step 2: Mobile Number Verification

- **Action:** Driver enters OTP received on their mobile.
- **System Actions:**
  - Verify OTP.
  - Mark mobile number as verified.
  - Assign a unique referral code to the new driver.

### Step 3: Personal Information Collection

- **Data Collected:** First name, last name, date of birth, gender, profile photo.
- **System Actions:**
  - Extract date of birth from Aadhaar if available.
  
// Mention if personal information can be edited later and the associated re-verification process

### Step 4: Document Upload & Verification

#### 4.1. Mandatory Documents

- **Documents Required:**
  - Aadhaar Card (front and back)
  - Driving License
  - PAN Card
  - Vehicle Registration Certificate (RC)
  - Vehicle Insurance
  - Vehicle Permit
  - Fitness Certificate
  - Pollution Under Control (PUC) Certificate
  - Bank Account/UPI details for payouts

- **Process:**
  - Driver uploads images of each document via the app.
  - For Aadhaar, an OTP-based verification is performed with UIDAI.
  - For Driving License and PAN, verification is done via third-party APIs (e.g., HyperVerge, Idfy).
  // Please add details about third party systems for driving license and PAN verification.
  - System checks for document validity, expiry, and uniqueness (e.g., PAN not linked to another driver).
  - If any document fails verification, the driver is notified to re-upload or correct the document. // What is the process of re-upload? How do driver gets notified?
  
// Explain how frequently third-party APIs (HyperVerge, Idfy) return false positives or failures
// Provide information on how expired documents are handled

#### 4.2. Background Verification (if required)
- **Trigger:** Based on city/merchant configuration.
// Add some details about these configurations and how to change that.
- **Process:**
  - Initiate background verification via a third-party service.
  - Track status (pending, completed, failed).
  - Only eligible drivers (as per report) proceed.

### Step 5: Service Eligibility & Preferences

- **Data Collected:**
  - Vehicle category (Hatchback, Sedan, SUV, etc.)
  - Service preferences (intra-city, inter-city, rental, special location warrior, etc.)
  - Consent for downgrade to lower service tiers if applicable.

- **System Actions:**
  - Set flags for eligibility (e.g., \`can_switch_to_rental\`, \`can_switch_to_inter_city\`).

### Step 6: Payment Setup

- **Data Collected:** UPI VPA, bank account details.
- **System Actions:**
  - Verify VPA via webhook or manual review. 
  // Clarify criteria determining whether VPA verification is manual or automated
  - Set up auto-pay mandates for subscription plans if required.
  - Track payment status (\`auto_pay_status\`, \`payment_pending\`).

### Step 7: Subscription Plan Selection

- **Action:** Driver selects a subscription plan (if applicable).
- **System Actions:**
  - Check eligibility and outstanding dues.
  - Activate subscription and update \`subscribed\` status.
  // Explain subscription plans available, their differences, and their impact on driver earnings

### Step 8: Final Review & Activation

- **System Checks:**
  - All mandatory documents are verified and valid.
  - No outstanding payments or blocks. // How do we identify outstanding blocks and payments
  - Background verification (if required) is complete.
  - Driver is not already active or blocked.

- **Actions:**
  - Send welcome message (SMS/WhatsApp) to the driver.
  - Driver is now eligible to receive ride requests.
  
// Specify how frequently blocks or outstanding payments occur and typical reasons behind these

---

// Please add a summary of business processes which follows after this step. Link (Generate Now)

## 4. Exception Handling

- **Document Rejection:** Driver is notified with the reason and can re-upload.
- **Duplicate/Invalid Documents:** System prevents linking the same document to multiple drivers.

// Explain how duplicate document scenarios are handled by the ops team
- **Payment Failure:** Driver is prompted to resolve outstanding dues before activation.
- **Background Verification Failure:** Driver is marked as ineligible and not activated.

---

// Specify common reasons for onboarding delays or abandonment at each stage

## 5. Communication & Notifications

- **Automated Messages:** Welcome, document status, payment reminders, and onboarding completion are sent via SMS/WhatsApp.
- **Dashboard Alerts:** Admins can view onboarding status, block/unblock drivers, and review document issues.

// Clarify if notifications are customizable per driver or city
---

## 6. Post-Onboarding

- **Driver can update profile and documents as needed (subject to re-verification).**
- **Ongoing compliance checks (e.g., document expiry, behavior monitoring) may trigger re-verification or blocking.**

// Provide examples of driver behaviors that commonly trigger re-verification or blocking
`;

    function renderMarkdownWithSuggestions(markdown: string) {
        const lines = markdown.split('\n');
        return lines.map((line, idx) => {
            if (line.trim().startsWith('//')) {
                return (
                    <SuggestionBox key={idx}>
                        <SuggestionText>
                            {line.replace('//', '').trim()}
                        </SuggestionText>
                    </SuggestionBox>
                );
            }
            return <ReactMarkdown key={idx}>{line}</ReactMarkdown>;
        });
    }

    const handleTableSelection = (tableName: string) => {
        setSelectedTables(prev => 
            prev.includes(tableName) 
                ? prev.filter(name => name !== tableName)
                : [...prev, tableName]
        );
    };

    const handleSelectAll = () => {
        const allTables = [
            'person', 'driver_information', 'vehicle_registrations', 'driver_documents', 'payment_methods',
            'subscription_plans', 'driver_earnings', 'ride_history', 'driver_ratings',
            'vehicle_maintenance', 'driver_schedules', 'commission_rates', 'driver_blocks',
            'background_checks', 'document_verifications', 'driver_preferences', 'service_areas',
            'driver_licenses', 'vehicle_insurance', 'driver_bank_details', 'subscription_payments',
            'driver_notifications', 'support_tickets', 'driver_analytics', 'performance_metrics',
            'driver_referrals', 'bonus_calculations', 'tax_deductions', 'driver_equipment',
            'training_records', 'compliance_checks'
        ];
        setSelectedTables(selectedTables.length === allTables.length ? [] : allTables);
    };

    const handleCreateDocumentation = () => {
        console.log('Creating documentation for tables:', selectedTables);
        // Here you would typically make an API call to generate documentation
        Modal.success({
            title: 'Documentation Generation Started',
            content: `Documentation will be generated for ${selectedTables.length} selected tables. You will be notified when it's ready.`,
        });
    };

    const filteredTables = [
        'person', 'driver_information', 'vehicle_registrations', 'driver_documents', 'payment_methods',
        'subscription_plans', 'driver_earnings', 'ride_history', 'driver_ratings',
        'vehicle_maintenance', 'driver_schedules', 'commission_rates', 'driver_blocks',
        'background_checks', 'document_verifications', 'driver_preferences', 'service_areas',
        'driver_licenses', 'vehicle_insurance', 'driver_bank_details', 'subscription_payments',
        'driver_notifications', 'support_tickets', 'driver_analytics', 'performance_metrics',
        'driver_referrals', 'bonus_calculations', 'tax_deductions', 'driver_equipment',
        'training_records', 'compliance_checks'
    ].filter(table => 
        table.replace(/_/g, ' ').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <PageContainer>
            <BackButton icon={<ArrowLeftOutlined />} onClick={handleBack}>
                Back to Business Processes
            </BackButton>
            
            <SectionCard>
                <SectionHeader>
                    <SectionTitle>
                        <UserOutlined style={{ color: '#1890ff' }} />
                        Document Metadata
                    </SectionTitle>
                    <EditButton icon={<EditOutlined />}>
                        Edit
                    </EditButton>
                </SectionHeader>
                <MetadataGrid>
                    <MetadataItem>
                        <MetadataIcon color="#1890ff">
                            <UserOutlined />
                        </MetadataIcon>
                        <MetadataContent>
                            <MetadataLabel>Owner</MetadataLabel>
                            <MetadataValue>John Doe</MetadataValue>
                        </MetadataContent>
                    </MetadataItem>
                    
                    <MetadataItem>
                        <MetadataIcon color="#faad14">
                            <ClockCircleOutlined />
                        </MetadataIcon>
                        <MetadataContent>
                            <MetadataLabel>Last Edited</MetadataLabel>
                            <MetadataValue>2024-06-01 14:32</MetadataValue>
                        </MetadataContent>
                    </MetadataItem>
                    
                    <MetadataItem>
                        <MetadataIcon color="#ff4d4f">
                            <WarningTwoTone twoToneColor="#faad14" />
                        </MetadataIcon>
                        <MetadataContent>
                            <MetadataLabel>Sections Needing Attention</MetadataLabel>
                            <MetadataValue>2</MetadataValue>
                        </MetadataContent>
                    </MetadataItem>
                    
                    <MetadataItem>
                        <MetadataIcon color="#52c41a">
                            <CheckCircleTwoTone twoToneColor="#52c41a" />
                        </MetadataIcon>
                        <MetadataContent>
                            <MetadataLabel>Sections Verified</MetadataLabel>
                            <MetadataValue>3</MetadataValue>
                        </MetadataContent>
                    </MetadataItem>
                </MetadataGrid>
            </SectionCard>
            
            <SectionCard>
                <SectionHeader>
                    <SectionTitle>
                        <FileTextOutlined style={{ color: '#1890ff' }} />
                        Process Documentation
                    </SectionTitle>
                    <EditButton icon={<EditOutlined />}>
                        Edit
                    </EditButton>
                </SectionHeader>
                <StyledTabs defaultActiveKey="document" type="card">
                    <Tabs.TabPane tab="Document" key="document">
                        <DocumentContainer>
                            {renderMarkdownWithSuggestions(documentMarkdown)}
                        </DocumentContainer>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Data Assets" key="data-assets">
                        <div style={{ padding: '24px 0' }}>
                            <div style={{ marginBottom: '24px' }}>
                                <Title level={4}>Select Tables for Documentation</Title>
                                <Text type="secondary">Choose the tables you want to generate documentation for</Text>
                            </div>
                            
                            <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <Input.Search
                                    placeholder="Search tables..."
                                    style={{ width: 300 }}
                                    allowClear
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Button 
                                    type={selectedTables.length === filteredTables.length && selectedTables.length > 0 ? "primary" : "default"}
                                    onClick={handleSelectAll}
                                    size="small"
                                >
                                    {selectedTables.length === filteredTables.length && selectedTables.length > 0 ? 'Deselect All' : 'Select All'}
                                </Button>
                                <Text type="secondary" style={{ marginLeft: 'auto' }}>
                                    {selectedTables.length} of {filteredTables.length} selected
                                </Text>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                                {filteredTables.map((table, index) => {
                                    const isSelected = selectedTables.includes(table);
                                    return (
                                        <Card
                                            key={table}
                                            size="small"
                                            style={{
                                                cursor: 'pointer',
                                                border: isSelected ? '2px solid #1890ff' : '1px solid #e2e8f0',
                                                borderRadius: '8px',
                                                transition: 'all 0.3s ease',
                                                background: isSelected ? '#f0f8ff' : 'white',
                                                transform: isSelected ? 'translateY(-2px)' : 'none',
                                                boxShadow: isSelected ? '0 4px 12px rgba(24, 144, 255, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.08)'
                                            }}
                                            bodyStyle={{ padding: '12px 16px' }}
                                            onClick={() => handleTableSelection(table)}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#262626' }}>
                                                        {table.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                    </div>
                                                                                                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                                    {table === 'person' ? '29' : table === 'driver_information' ? '80' : Math.floor(Math.random() * 50) + 10} columns
                                                </div>
                                                </div>
                                                {isSelected ? (
                                                    <CheckCircleFilled style={{ color: '#52c41a', fontSize: '18px' }} />
                                                ) : (
                                                    <div style={{ 
                                                        width: '18px', 
                                                        height: '18px', 
                                                        border: '2px solid #d9d9d9', 
                                                        borderRadius: '50%',
                                                        background: 'white'
                                                    }} />
                                                )}
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                            
                            <div style={{ 
                                position: 'sticky', 
                                bottom: 0, 
                                background: 'white', 
                                padding: '16px 0', 
                                borderTop: '1px solid #e2e8f0',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <Text strong>{selectedTables.length} tables selected</Text>
                                    {selectedTables.length > 0 && (
                                        <Text type="secondary" style={{ marginLeft: '8px' }}>
                                            Ready to generate documentation
                                        </Text>
                                    )}
                                </div>
                                <Button 
                                    type="primary" 
                                    size="large"
                                    icon={<FileTextOutlined />}
                                    onClick={handleCreateDocumentation}
                                    disabled={selectedTables.length === 0}
                                    style={{
                                        background: selectedTables.length > 0 ? '#1890ff' : '#f0f0f0',
                                        borderColor: selectedTables.length > 0 ? '#1890ff' : '#d9d9d9',
                                        color: selectedTables.length > 0 ? 'white' : '#bfbfbf'
                                    }}
                                >
                                    Create Documentation
                                </Button>
                            </div>
                        </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Sync" key="sync">
                        <div style={{ padding: '24px 0' }}>
                            <div style={{ marginBottom: '24px' }}>
                                <Title level={4}>Sync & Export Documentation</Title>
                                <Text type="secondary">Synchronize and export your documentation to external platforms</Text>
                            </div>
                            
                            {/* Business Document Sync Section */}
                            <div style={{ marginBottom: '32px' }}>
                                <Title level={5} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FileTextOutlined style={{ color: '#1890ff' }} />
                                    Business Document Sync
                                </Title>
                                <Text type="secondary" style={{ marginBottom: '16px', display: 'block' }}>
                                    Sync business process documents to Confluence or download locally
                                </Text>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                                    <Card
                                        title={
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ 
                                                    width: '20px', 
                                                    height: '20px', 
                                                    background: '#0052CC', 
                                                    borderRadius: '4px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    C
                                                </div>
                                                <span>Confluence</span>
                                            </div>
                                        }
                                        extra={<Tag color="green">Connected</Tag>}
                                        style={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}
                                    >
                                        <p>Last synced: 1 hour ago</p>
                                        <Button type="primary" size="small" style={{ marginRight: '8px' }}>
                                            <SyncOutlined /> Sync Now
                                        </Button>
                                        <Button size="small">View History</Button>
                                    </Card>
                                    
                                    <Card
                                        title={
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <DownloadOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
                                                <span>Download</span>
                                            </div>
                                        }
                                        extra={<Tag color="blue">Available</Tag>}
                                        style={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}
                                    >
                                        <p>Last downloaded: 2 days ago</p>
                                        <Button type="primary" size="small" style={{ marginRight: '8px' }}>
                                            <DownloadOutlined /> Download Now
                                        </Button>
                                        <Button size="small">View History</Button>
                                    </Card>
                                </div>
                            </div>
                            
                            {/* Column Documentation Sync Section */}
                            <div style={{ marginBottom: '32px' }}>
                                <Title level={5} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <BarChartOutlined style={{ color: '#1890ff' }} />
                                    Column Documentation Sync
                                </Title>
                                <Text type="secondary" style={{ marginBottom: '16px', display: 'block' }}>
                                    Sync column-level documentation to data platforms
                                </Text>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                                    <Card
                                        title={
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <img src={snowflakeLogo} alt="Snowflake" style={{ width: '20px', height: '20px' }} />
                                                <span>Snowflake</span>
                                            </div>
                                        }
                                        extra={<Tag color="green">Connected</Tag>}
                                        style={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}
                                    >
                                        <p>Last synced: 3 hours ago</p>
                                        <Button type="primary" size="small" style={{ marginRight: '8px' }}>
                                            <SyncOutlined /> Sync Now
                                        </Button>
                                        <Button size="small">View History</Button>
                                    </Card>
                                    
                                    <Card
                                        title={
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <img src={databricksLogo} alt="Databricks" style={{ width: '20px', height: '20px' }} />
                                                <span>Databricks</span>
                                            </div>
                                        }
                                        extra={<Tag color="green">Connected</Tag>}
                                        style={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}
                                    >
                                        <p>Last synced: 6 hours ago</p>
                                        <Button type="primary" size="small" style={{ marginRight: '8px' }}>
                                            <SyncOutlined /> Sync Now
                                        </Button>
                                        <Button size="small">View History</Button>
                                    </Card>
                                    
                                    <Card
                                        title={
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <img src={bigqueryLogo} alt="BigQuery" style={{ width: '20px', height: '20px' }} />
                                                <span>BigQuery</span>
                                            </div>
                                        }
                                        extra={<Tag color="orange">Pending</Tag>}
                                        style={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}
                                    >
                                        <p>Last synced: Never</p>
                                        <Button type="primary" size="small" style={{ marginRight: '8px' }}>
                                            <SyncOutlined /> Sync Now
                                        </Button>
                                        <Button size="small">Configure</Button>
                                    </Card>
                                </div>
                            </div>
                            
                            {/* Sync Settings Section */}
                            <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <Title level={5}>Sync Settings</Title>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginTop: '16px' }}>
                                    <div>
                                        <Text strong>Auto-sync frequency</Text>
                                        <div style={{ marginTop: '4px' }}>
                                            <Tag color="blue">Every 6 hours</Tag>
                                        </div>
                                    </div>
                                    <div>
                                        <Text strong>Sync on changes</Text>
                                        <div style={{ marginTop: '4px' }}>
                                            <Tag color="green">Enabled</Tag>
                                        </div>
                                    </div>
                                    <div>
                                        <Text strong>Export format</Text>
                                        <div style={{ marginTop: '4px' }}>
                                            <Tag color="purple">Markdown</Tag>
                                        </div>
                                    </div>
                                    <div>
                                        <Text strong>Business docs format</Text>
                                        <div style={{ marginTop: '4px' }}>
                                            <Tag color="cyan">Confluence</Tag>
                                        </div>
                                    </div>
                                    <div>
                                        <Text strong>Column docs format</Text>
                                        <div style={{ marginTop: '4px' }}>
                                            <Tag color="orange">Data Platform</Tag>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tabs.TabPane>
                </StyledTabs>
            </SectionCard>
        </PageContainer>
    );
};

export { DriverOnboardingPage }; 