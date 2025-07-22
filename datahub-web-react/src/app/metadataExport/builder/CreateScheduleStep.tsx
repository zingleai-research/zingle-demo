import React from 'react';
import styled from 'styled-components';
import { Button } from '@src/alchemy-components';
import { ExportDestinationBuilderStep } from './ExportDestinationBuilderModal';
import { StepProps } from './types';

const Container = styled.div`
    padding: 20px;
`;

const Title = styled.h3`
    margin-bottom: 16px;
`;

const Content = styled.div`
    margin-bottom: 24px;
    padding: 16px;
    background: #f5f5f5;
    border-radius: 8px;
`;

export const CreateScheduleStep = ({ state, updateState, goTo, prev, cancel }: StepProps) => {
    return (
        <Container>
            <Title>Set Export Schedule</Title>
            <Content>
                <p>Schedule configuration will be implemented here.</p>
                <p>This step would include frequency, timezone, and other scheduling options.</p>
            </Content>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                {prev && (
                    <Button variant="text" color="gray" onClick={prev}>
                        Back
                    </Button>
                )}
                <Button variant="text" color="gray" onClick={cancel}>
                    Cancel
                </Button>
                <Button variant="filled" onClick={() => goTo(ExportDestinationBuilderStep.NAME_DESTINATION)}>
                    Next
                </Button>
            </div>
        </Container>
    );
}; 