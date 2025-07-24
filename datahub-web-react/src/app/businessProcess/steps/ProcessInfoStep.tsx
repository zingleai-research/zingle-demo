import { Form, Input, Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';

import { BusinessProcessBuilderStep } from '../steps';
import { BusinessProcessBuilderState, StepProps } from '../types';
import { Button } from '@src/alchemy-components';

const { Title } = Typography;

const Container = styled.div`
    max-height: 82vh;
    display: flex;
    flex-direction: column;
    padding: 0 20px;
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 32px;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid #f0f0f0;
`;

export const ProcessInfoStep = ({ state, updateState, goTo, cancel }: StepProps) => {
    const [form] = Form.useForm();
    const [formValues, setFormValues] = React.useState({
        processName: state.processName || '',
        processDescription: state.processDescription || ''
    });

    const onNext = () => {
        const values = form.getFieldsValue();
        updateState({
            ...state,
            processName: values.processName || '',
            processDescription: values.processDescription || ''
        });
        goTo(BusinessProcessBuilderStep.SELECT_SOURCES);
    };

    const handleFormChange = (changedValues: any, allValues: any) => {
        setFormValues(allValues);
    };

    const canProceed = true; // Always allow proceeding

    return (
        <Container>
            <Form form={form} layout="vertical" initialValues={state} onValuesChange={handleFormChange}>
                <Section>
                    <Title level={4}>Process Information</Title>
                    <Form.Item
                        name="processName"
                        label="Process Name"
                    >
                        <Input placeholder="Enter business process name" />
                    </Form.Item>
                    <Form.Item
                        name="processDescription"
                        label="Process Description"
                    >
                        <Input.TextArea 
                            placeholder="Describe your business process"
                            rows={3}
                        />
                    </Form.Item>
                </Section>

                <ButtonContainer>
                    <Button variant="text" color="gray" onClick={cancel}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={onNext}
                    >
                        Next
                    </Button>
                </ButtonContainer>
            </Form>
        </Container>
    );
}; 