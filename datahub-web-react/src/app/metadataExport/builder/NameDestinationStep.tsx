import React from 'react';
import styled from 'styled-components';
import { Button } from '@src/alchemy-components';
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

export const NameDestinationStep = ({ state, updateState, prev, submit, cancel }: StepProps) => {
    return (
        <Container>
            <Title>Name Your Export Destination</Title>
            <Content>
                <p>Name and finalize your export destination configuration.</p>
                <p>This step would include naming the destination and final review.</p>
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
                <Button variant="filled" onClick={() => submit()}>
                    Create Destination
                </Button>
            </div>
        </Container>
    );
}; 