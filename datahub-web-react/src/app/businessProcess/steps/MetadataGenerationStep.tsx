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

    const handleFinish = () => {
        submit();
    };

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
                    <>
                        <LoadingContainer>
                            <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
                            <Title level={3}>Business Process Document Generated!</Title>
                            <Text type="secondary">
                                Your business process document has been generated and is ready to use.
                            </Text>
                        </LoadingContainer>
                        {/* Diagram Summary removed */}
                    </>
                )}
            </ContentContainer>

            <ButtonContainer>
                <Button variant="text" color="gray" onClick={cancel}>
                    Cancel
                </Button>
                {!isGenerating && (
                    <Button onClick={handleFinish}>
                        Save
                    </Button>
                )}
            </ButtonContainer>
        </Container>
    );
}; 