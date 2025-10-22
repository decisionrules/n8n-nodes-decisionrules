import { INodeProperties } from "n8n-workflow"

export const jobOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['jobRes'],
            }
        },
        options: [
            {
                name: 'Start Job',
                value: 'startJob',
                description: 'Takes the node input, sends it as data to the defined host, and starts a job for an integration flow rule',
                action: 'Start a job',

            },
            {
                name: 'Cancel Job',
                value: 'cancelJob',
                description: 'Cancels a running job',
                action: 'Cancel a job',

            },
            {
                name: 'Get Job Info',
                value: 'jobInfo',
                description: 'Retrieves information about a job\'s status (e.g., success, failure, or in process) based on its ID',
                action: 'Get job info',

            },
        ],
        default: 'startJob',
    },
]


export const jobParameters: INodeProperties[] = [
    {
        displayName: 'Job ID',
        name: 'jobId',
        type: 'string',
        default: '',
        required: true,
        placeholder: 'e.g., a1b2c3d4-e5f6-7890-1234-567890abcdef',
        description: 'The unique identifier for the job',
        displayOptions: {
            show: {
                operation: ['cancelJob', 'jobInfo'],
                resource: ['jobRes'],
            },
        },
    },
]