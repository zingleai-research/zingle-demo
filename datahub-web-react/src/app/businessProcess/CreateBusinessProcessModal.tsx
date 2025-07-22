import { LoadingOutlined } from '@ant-design/icons';
import { Modal as AntModal } from 'antd';
import { Spin, Steps } from 'antd';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { ProcessInfoStep } from './steps/ProcessInfoStep';
import { SelectSourcesStep } from './steps/SelectSourcesStep';
import { SelectDestinationsStep } from './steps/SelectDestinationsStep';
import { MetadataGenerationStep } from './steps/MetadataGenerationStep';
import { BusinessProcessBuilderState, StepProps } from './types';
import { BusinessProcessBuilderStep } from './steps';
import { FileOutlined, CloudOutlined, DatabaseOutlined, GithubOutlined } from '@ant-design/icons';

const StepsContainer = styled.div`
    margin-right: 20px;
    margin-left: 20px;
    margin-bottom: 40px;
`;

/**
 * Mapping from the step type to the title for the step
 */
export enum BusinessProcessBuilderStepTitles {
    PROCESS_INFO = 'Process Information',
    SELECT_SOURCES = 'Select Data Sources',
    SELECT_DESTINATIONS = 'Select Tables',
    METADATA_GENERATION = 'Generate',
}

/**
 * Mapping from the step type to the component that should be rendered
 */
const BusinessProcessBuilderStepComponent: Record<BusinessProcessBuilderStep, React.FC<StepProps>> = {
    [BusinessProcessBuilderStep.PROCESS_INFO]: ProcessInfoStep,
    [BusinessProcessBuilderStep.SELECT_SOURCES]: SelectSourcesStep,
    [BusinessProcessBuilderStep.SELECT_DESTINATIONS]: SelectDestinationsStep,
    [BusinessProcessBuilderStep.METADATA_GENERATION]: MetadataGenerationStep,
};

interface Props {
    open: boolean;
    onCancel: () => void;
    onSubmit: (state: BusinessProcessBuilderState) => void;
}

export const CreateBusinessProcessModal = ({ open, onCancel, onSubmit }: Props) => {
    const [stepStack, setStepStack] = useState([BusinessProcessBuilderStep.PROCESS_INFO]);
    const [businessProcessState, setBusinessProcessState] = useState<BusinessProcessBuilderState>({
        sources: [],
        destination: null,
        processName: '',
        processDescription: '',
    });

    // Reset modal state when it opens
    useEffect(() => {
        if (open) {
            setStepStack([BusinessProcessBuilderStep.PROCESS_INFO]);
            setBusinessProcessState({
                sources: [],
                destination: null,
                processName: '',
                processDescription: '',
            });
        }
    }, [open]);

    const goTo = (step: BusinessProcessBuilderStep) => {
        setStepStack([...stepStack, step]);
    };

    const prev = () => {
        setStepStack(stepStack.slice(0, -1));
    };

    const cancel = () => {
        onCancel?.();
    };

    const submit = () => {
        onSubmit?.(businessProcessState);
    };

    const currentStep = stepStack[stepStack.length - 1];
    const currentStepIndex = Object.values(BusinessProcessBuilderStep)
        .map((value, index) => ({
            value,
            index,
        }))
        .filter((obj) => obj.value === currentStep)[0].index;
    const StepComponent: React.FC<StepProps> = BusinessProcessBuilderStepComponent[currentStep];

    const dataSources = [
        {
            key: 'confluence',
            title: 'Confluence',
            description: 'Atlassian Confluence spaces and pages',
            icon: <FileOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
        },
        {
            key: 'word',
            title: 'Word Doc',
            description: 'Microsoft Word documents',
            icon: <FileOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
        },
        {
            key: 'pdf',
            title: 'Upload PDF',
            description: 'Upload PDF files',
            icon: <FileOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
        },
        {
            key: 'github',
            title: 'Github',
            description: 'GitHub repositories and files',
            icon: <GithubOutlined style={{ fontSize: 32, color: '#000' }} />,
        },
        {
            key: 'gitlab',
            title: 'Gitlab',
            description: 'GitLab repositories and files',
            icon: <DatabaseOutlined style={{ fontSize: 32, color: '#fc6d26' }} />,
        },
        {
            key: 'snowflake',
            title: 'Snowflake',
            description: 'Snowflake data warehouse',
            icon: <CloudOutlined style={{ fontSize: 32, color: '#56c1e1' }} />,
        },
        {
            key: 'databricks',
            title: 'Databricks',
            description: 'Databricks Lakehouse Platform',
            icon: <DatabaseOutlined style={{ fontSize: 32, color: '#ff3621' }} />,
        },
    ];

    return (
        <AntModal 
            width="64%" 
            title="Create New Business Process" 
            open={open} 
            onCancel={onCancel}
            footer={null}
        >
            <Spin spinning={false} indicator={<LoadingOutlined />}>
                <StepsContainer>
                    <Steps current={currentStepIndex}>
                        {Object.keys(BusinessProcessBuilderStep).map((item) => (
                            <Steps.Step key={item} title={BusinessProcessBuilderStepTitles[item]} />
                        ))}
                    </Steps>
                </StepsContainer>
                <StepComponent
                    state={businessProcessState}
                    updateState={setBusinessProcessState}
                    goTo={goTo}
                    prev={stepStack.length > 1 ? prev : undefined}
                    submit={submit}
                    cancel={cancel}
                />
            </Spin>
        </AntModal>
    );
}; 