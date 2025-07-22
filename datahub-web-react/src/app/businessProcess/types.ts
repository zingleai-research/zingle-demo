import { BusinessProcessBuilderStep } from './steps';

export interface DataSource {
    id: string;
    name: string;
    type: string;
    description: string;
    icon: string;
}

export interface DataDestination {
    id: string;
    name: string;
    type: string;
    description: string;
    icon: string;
}

/**
 * Props provided to each step as input.
 */
export type StepProps = {
    state: BusinessProcessBuilderState;
    updateState: (newState: BusinessProcessBuilderState) => void;
    goTo: (step: BusinessProcessBuilderStep) => void;
    prev?: () => void;
    submit: (shouldRun?: boolean) => void;
    cancel: () => void;
};

/**
 * The object represents the state of the Business Process Builder form.
 */
export interface BusinessProcessBuilderState {
    /**
     * The name of the new business process
     */
    processName?: string;

    /**
     * The description of the new business process
     */
    processDescription?: string;

    /**
     * The selected data sources
     */
    sources: DataSource[];

    /**
     * The selected data destination
     */
    destination: DataDestination | null;
} 