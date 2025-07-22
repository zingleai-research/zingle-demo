import { 
    DatabaseOutlined, 
    CloudOutlined, 
    ApiOutlined, 
    FileTextOutlined,
    SearchOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { Input, Typography, Card } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';

import { BusinessProcessBuilderStep } from '../steps';
import { BusinessProcessBuilderState, DataSource, StepProps } from '../types';
import { Button } from '@src/alchemy-components';

import confluenceLogo from '../../../images/confluence-logo.png';
import wordLogo from '../../../images/word-logo.png';
import pdfLogo from '../../../images/pdf-logo.png';
import githubLogo from '../../../images/github-logo.png';
import gitlabLogo from '../../../images/gitlab-logo.png';

const { Title, Text } = Typography;

const Container = styled.div`
    max-height: 82vh;
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    justify-content: space-between;
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
`;

const SearchBarContainer = styled.div`
    display: flex;
    justify-content: end;
    width: auto;
    margin-bottom: 16px;
`;

const StyledSearchBar = styled(Input)`
    background-color: white;
    border-radius: 8px;
    box-shadow: 0px 0px 30px 0px rgb(239 239 239);
    border: 1px solid #e0e0e0;
    max-width: 300px;
    font-size: 16px;
`;

const StyledSearchOutlined = styled(SearchOutlined)`
    color: #a9adbd;
`;

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
    margin-bottom: 16px;
`;

const SourceCard = styled(Card)<{ selected?: boolean }>`
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid ${props => props.selected ? '#1890ff' : '#f0f0f0'};
    border-radius: 8px;
    min-height: 180px; // Ensures all cards have the same height
    
    &:hover {
        border-color: #1890ff;
        box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
    }
`;



const IconContainer = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
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
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
    gap: 12px;
`;

const LeftButtons = styled.div`
    display: flex;
    gap: 8px;
`;

const RightButtons = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
`;

// Mock data sources
const availableSources: DataSource[] = [
    {
        id: 'confluence',
        name: 'Confluence',
        type: 'file',
        description: 'Atlassian Confluence spaces and pages',
        icon: <img src={confluenceLogo} alt="Confluence" style={{ width: 32, height: 32 }} />,
    },
    {
        id: 'word-doc',
        name: 'Word Doc',
        type: 'file',
        description: 'Microsoft Word documents',
        icon: <img src={wordLogo} alt="Word Doc" style={{ width: 32, height: 32 }} />,
    },
    {
        id: 'upload-pdf',
        name: 'Upload PDF',
        type: 'file',
        description: 'Upload PDF files',
        icon: <img src={pdfLogo} alt="PDF" style={{ width: 32, height: 32 }} />,
    },
    {
        id: 'github',
        name: 'Github',
        type: 'database',
        description: 'GitHub repositories and files',
        icon: <img src={githubLogo} alt="Github" style={{ width: 32, height: 32 }} />,
    },
    {
        id: 'gitlab',
        name: 'Gitlab',
        type: 'database',
        description: 'GitLab repositories and files',
        icon: <img src={gitlabLogo} alt="Gitlab" style={{ width: 32, height: 32 }} />,
    },
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
        default:
            return '#666';
    }
};

export const SelectSourcesStep = ({ state, updateState, goTo, prev, cancel }: StepProps) => {
    const [searchFilter, setSearchFilter] = useState('');
    // Add state for uploaded PDF files
    const [uploadedPdfFiles, setUploadedPdfFiles] = useState<File[]>([]);

    const onSourceSelect = (source: DataSource) => {
        const isSelected = state.sources.some(s => s.id === source.id);
        let newSources: DataSource[];
        
        if (isSelected) {
            newSources = state.sources.filter(s => s.id !== source.id);
            // If unselecting Upload PDF, clear uploaded files
            if (source.id === 'upload-pdf') {
                setUploadedPdfFiles([]);
            }
        } else {
            newSources = [...state.sources, source];
        }
        
        updateState({
            ...state,
            sources: newSources
        });
    };

    // Handler for file input
    const onPdfFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setUploadedPdfFiles(Array.from(e.target.files));
        }
    };


    const onNext = () => {
        goTo(BusinessProcessBuilderStep.SELECT_DESTINATIONS);
    };

    const canProceed = true; // Always allow proceeding

    const filteredSources = availableSources.filter(
        source => source.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                 source.description.toLowerCase().includes(searchFilter.toLowerCase())
    );

    return (
        <Container>
            <Section>
                <Title level={4}>Select Data Sources</Title>
                <SearchBarContainer>
                    <StyledSearchBar
                        placeholder="Search data sources..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        allowClear
                        prefix={<StyledSearchOutlined />}
                    />
                </SearchBarContainer>
                <GridContainer>
                    {filteredSources.map((source) => {
                        const isSelected = state.sources.some(s => s.id === source.id);
                        return (
                            <SourceCard
                                key={source.id}
                                selected={isSelected}
                                onClick={() => onSourceSelect(source)}
                            >
                                <CardHeader>
                                    <IconContainer>
                                        {source.icon}
                                    </IconContainer>
                                    <div>
                                        <CardTitle level={5}>{source.name}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardDescription>{source.description}</CardDescription>
                                {/* Show file input if Upload PDF is selected */}
                                {source.id === 'upload-pdf' && isSelected && (
                                    <div style={{ marginTop: 12 }}>
                                        <label style={{
                                            display: 'inline-block',
                                            padding: '6px 16px',
                                            background: '#f5f5f5',
                                            borderRadius: 4,
                                            cursor: 'pointer',
                                            fontWeight: 500,
                                            fontSize: 14,
                                            border: '1px solid #d9d9d9',
                                        }}>
                                            Choose PDF(s)
                                            <input
                                                type="file"
                                                accept="application/pdf"
                                                multiple
                                                onChange={onPdfFilesChange}
                                                onClick={e => e.stopPropagation()}
                                                style={{ display: 'none' }}
                                            />
                                        </label>
                                        {uploadedPdfFiles.length > 0 && (
                                            <div style={{ marginTop: 8, fontSize: 13 }}>
                                                {uploadedPdfFiles.map((file) => file.name).join(', ')}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </SourceCard>
                        );
                    })}
                </GridContainer>
            </Section>

            <Section>
                <Text type="secondary" style={{ marginBottom: 8 }}>
                    Choose the data sources you want to include in your business process
                </Text>
            </Section>

            <ButtonContainer>
                <LeftButtons>
                    <Button variant="text" color="gray" onClick={cancel}>
                        Cancel
                    </Button>
                </LeftButtons>
                <RightButtons>
                    {prev && (
                        <Button variant="text" color="gray" onClick={prev}>
                            Previous
                        </Button>
                    )}
                    <Button 
                        onClick={onNext}
                    >
                        Next
                    </Button>
                </RightButtons>
            </ButtonContainer>
        </Container>
    );
}; 