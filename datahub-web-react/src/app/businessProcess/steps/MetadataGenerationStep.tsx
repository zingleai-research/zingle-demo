import { 
    SyncOutlined, 
    CheckCircleOutlined,
    DatabaseOutlined,
    CloudOutlined,
    ApiOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import { Typography, Progress, Card, List } from 'antd';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import ReactMarkdown from 'react-markdown';

import { BusinessProcessBuilderState, StepProps } from '../types';
import { Button } from '@src/alchemy-components';

const { Title, Text } = Typography;

const Container = styled.div`
    max-height: 82vh;
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    align-items: center;
    justify-content: center;
    min-height: 400px;
`;

const ContentContainer = styled.div`
    text-align: center;
    max-width: 600px;
    width: 100%;
`;

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 32px;
`;

const SpinningIcon = styled(SyncOutlined)`
    font-size: 48px;
    color: #1890ff;
    margin-bottom: 16px;
    animation: spin 1s linear infinite;
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;

const ProgressContainer = styled.div`
    width: 100%;
    margin: 24px 0;
`;

const SummaryContainer = styled.div`
    margin-top: 32px;
    text-align: left;
`;

const SummaryCard = styled(Card)`
    margin-bottom: 16px;
    border-radius: 8px;
`;

const IconContainer = styled.div<{ color: string }>`
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background: ${props => props.color};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    color: white;
    font-size: 16px;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid #f0f0f0;
    width: 100%;
`;

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
        default:
            return '#666';
    }
};

export const MetadataGenerationStep = ({ state, prev, submit, cancel }: StepProps) => {
    const history = useHistory();
    const [progress, setProgress] = useState(0);
    const [isGenerating, setIsGenerating] = useState(true);
    const [generatedMetadata, setGeneratedMetadata] = useState<any[]>([]);

    useEffect(() => {
        if (isGenerating) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        setIsGenerating(false);
                        // Mock generated metadata
                        setGeneratedMetadata([
                            {
                                id: 'source-1',
                                name: 'Customer Data',
                                type: 'dataset',
                                source: state.sources[0]?.name || 'Unknown Source',
                                description: 'Customer information and preferences'
                            },
                            {
                                id: 'source-2',
                                name: 'Transaction Data',
                                type: 'dataset',
                                source: state.sources[0]?.name || 'Unknown Source',
                                description: 'Financial transaction records'
                            },
                            {
                                id: 'destination-1',
                                name: 'Analytics Dashboard',
                                type: 'dashboard',
                                destination: state.destination?.name || 'Unknown Destination',
                                description: 'Business intelligence dashboard'
                            }
                        ]);
                        return 100;
                    }
                    return prev + 20;
                });
            }, 1000); // Update every second for 5 seconds total

            return () => clearInterval(interval);
        }
    }, [isGenerating, state]);

    const handleView = () => {
        history.push('/business-process/driver-onboarding');
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

    // Custom renderer to highlight suggestions (lines starting with //)
    function renderMarkdownWithSuggestions(markdown: string) {
        const lines = markdown.split('\n');
        return lines.map((line, idx) => {
            if (line.trim().startsWith('//')) {
                return (
                    <div key={idx} style={{ color: '#b37feb', fontStyle: 'italic', margin: '8px 0', background: '#f9f0ff', padding: '4px 12px', borderRadius: 6 }}>
                        Suggestion: {line.replace('//', '').trim()}
                    </div>
                );
            }
            return <ReactMarkdown key={idx}>{line}</ReactMarkdown>;
        });
    }

    return (
        <Container>
            <ContentContainer>
                {isGenerating ? (
                    <>
                        <LoadingContainer>
                            <SpinningIcon />
                            <Title level={3}>Generating Business Process Document</Title>
                            <Text type="secondary">
                                Analyzing your selections to generate a business process document...
                            </Text>
                        </LoadingContainer>
                        <ProgressContainer>
                            <Progress 
                                percent={progress} 
                                status="active"
                                strokeColor={{
                                    '0%': '#108ee9',
                                    '100%': '#87d068',
                                }}
                            />
                        </ProgressContainer>
                        <Text type="secondary">
                            This process typically takes a few seconds to complete.
                        </Text>
                    </>
                ) : (
                    <div style={{ textAlign: 'left', maxHeight: 400, overflowY: 'auto', margin: '0 auto', background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 2px 8px #f0f1f2' }}>
                        {renderMarkdownWithSuggestions(documentMarkdown)}
                    </div>
                )}
            </ContentContainer>
            <ButtonContainer>
                <Button variant="text" color="gray" onClick={cancel}>
                    Cancel
                </Button>
                {!isGenerating && (
                    <Button onClick={handleView}>
                        View
                    </Button>
                )}
            </ButtonContainer>
        </Container>
    );
}; 