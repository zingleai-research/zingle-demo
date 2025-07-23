import { LoadingOutlined } from '@ant-design/icons';
import { Modal } from '@components';
import { Spin, Steps } from 'antd';
import { isEqual } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { SelectDestinationStep } from './SelectDestinationStep';
import { DefineConfigurationStep } from './DefineConfigurationStep';
import { CreateScheduleStep } from './CreateScheduleStep';
import { NameDestinationStep } from './NameDestinationStep';
import destinationsJson from './destinations.json';
import { DestinationBuilderState, StepProps } from './types';

const StepsContainer = styled.div`
    margin-right: 20px;
    margin-left: 20px;
    margin-bottom: 40px;
`;

/**
 * Mapping from the step type to the title for the step
 */
export enum ExportDestinationBuilderStepTitles {
    SELECT_DESTINATION = 'Choose Export Destination',
    DEFINE_CONFIGURATION = 'Configure Connection',
    CREATE_SCHEDULE = 'Export Schedule',
    NAME_DESTINATION = 'Finish up',
}

/**
 * Mapping from the step type to the component implementing that step.
 */
export const ExportDestinationBuilderStepComponent = {
    SELECT_DESTINATION: SelectDestinationStep,
    DEFINE_CONFIGURATION: DefineConfigurationStep,
    CREATE_SCHEDULE: CreateScheduleStep,
    NAME_DESTINATION: NameDestinationStep,
};

/**
 * Steps of the Export Destination Builder flow.
 */
export enum ExportDestinationBuilderStep {
    SELECT_DESTINATION = 'SELECT_DESTINATION',
    DEFINE_CONFIGURATION = 'DEFINE_CONFIGURATION',
    CREATE_SCHEDULE = 'CREATE_SCHEDULE',
    NAME_DESTINATION = 'NAME_DESTINATION',
}

type Props = {
    initialState?: DestinationBuilderState;
    open: boolean;
    onSubmit?: (input: DestinationBuilderState, resetState: () => void, shouldRun?: boolean) => void;
    onCancel: () => void;
    destinationRefetch?: () => Promise<any>;
    selectedDestination?: any;
    loading?: boolean;
};

export const ExportDestinationBuilderModal = ({
    initialState,
    open,
    onSubmit,
    onCancel,
    destinationRefetch,
    selectedDestination,
    loading,
}: Props) => {
    const isEditing = initialState !== undefined;
    const titleText = isEditing ? 'Edit Export Destination' : 'Connect Export Destination';
    const initialStep = isEditing
        ? ExportDestinationBuilderStep.DEFINE_CONFIGURATION
        : ExportDestinationBuilderStep.SELECT_DESTINATION;

    const [stepStack, setStepStack] = useState([initialStep]);
    const [destinationBuilderState, setDestinationBuilderState] = useState<DestinationBuilderState>({
        schedule: {
            interval: '0 0 * * *',
        },
    });

    const exportDestinations = JSON.parse(JSON.stringify(destinationsJson));

    // Reset the destination builder modal state when the modal is re-opened.
    const prevInitialState = useRef(initialState);
    useEffect(() => {
        if (!isEqual(prevInitialState.current, initialState)) {
            setDestinationBuilderState(initialState || {});
        }
        prevInitialState.current = initialState;
    }, [initialState]);

    // Reset the step stack to the initial step when the modal is re-opened.
    useEffect(() => setStepStack([initialStep]), [initialStep]);

    const goTo = (step: ExportDestinationBuilderStep) => {
        setStepStack([...stepStack, step]);
    };

    const prev = () => {
        setStepStack(stepStack.slice(0, -1));
    };

    const cancel = () => {
        onCancel?.();
    };

    const submit = (shouldRun?: boolean) => {
        onSubmit?.(
            destinationBuilderState,
            () => {
                setStepStack([initialStep]);
                setDestinationBuilderState({});
            },
            shouldRun,
        );
    };

    const currentStep = stepStack[stepStack.length - 1];
    const currentStepIndex = Object.values(ExportDestinationBuilderStep)
        .map((value, index) => ({
            value,
            index,
        }))
        .filter((obj) => obj.value === currentStep)[0].index;
    const StepComponent: React.FC<StepProps> = ExportDestinationBuilderStepComponent[currentStep];

    return (
        <Modal width="64%" title={titleText} open={open} onCancel={onCancel} buttons={[]}>
            <Spin spinning={loading} indicator={<LoadingOutlined />}>
                {currentStepIndex > 0 ? (
                    <StepsContainer>
                        <Steps current={currentStepIndex}>
                            {Object.keys(ExportDestinationBuilderStep).map((item) => (
                                <Steps.Step key={item} title={ExportDestinationBuilderStepTitles[item]} />
                            ))}
                        </Steps>
                    </StepsContainer>
                ) : null}
                <StepComponent
                    state={destinationBuilderState}
                    updateState={setDestinationBuilderState}
                    isEditing={isEditing}
                    goTo={goTo}
                    prev={stepStack.length > 1 ? prev : undefined}
                    submit={submit}
                    cancel={cancel}
                    exportDestinations={exportDestinations}
                    destinationRefetch={destinationRefetch}
                    selectedDestination={selectedDestination}
                />
            </Spin>
        </Modal>
    );
}; 