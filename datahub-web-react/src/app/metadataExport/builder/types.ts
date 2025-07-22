export interface DestinationConfig {
    name: string;
    displayName: string;
    description: string;
    urn: string;
    recipe: string;
    documentation?: string;
}

export interface DestinationBuilderState {
    name?: string;
    type?: string;
    config?: {
        recipe?: string;
    };
    schedule?: {
        interval?: string;
        timezone?: string;
    };
    owners?: any[];
}

export interface StepProps {
    state: DestinationBuilderState;
    updateState: (state: DestinationBuilderState) => void;
    isEditing: boolean;
    goTo: (step: any) => void;
    prev?: () => void;
    submit: (shouldRun?: boolean) => void;
    cancel: () => void;
    exportDestinations: DestinationConfig[];
    destinationRefetch?: () => Promise<any>;
    selectedDestination?: any;
} 