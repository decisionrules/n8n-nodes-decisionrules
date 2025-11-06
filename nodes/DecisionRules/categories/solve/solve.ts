import { INodeProperties } from "n8n-workflow"

export const solveOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['solveRes'],
            },
        },
        options: [
            {
                name: 'Solve Rule',
                value: 'solve',
                description: 'Takes the node input, sends it as data to the defined host, and solves a rule',
                action: 'Solve rule',


            },
        ],
        default: 'solve',
    },
]

export const solveParameters: INodeProperties[] = [
    {
        displayName: 'Solve Options',
        name: 'solveOptions',
        type: 'collection',
        default: {},
        displayOptions: {
            show: {
                operation: ['solve'],
                resource: ['solveRes'],
            },
        },
        options: [
            {
                displayName: 'Alias Conflict Path',
                name: 'aliasConflictPath',
                type: 'string',
                default: '',
                description: 'Path to handle alias conflicts',
            },
            {
                displayName: 'Audit TTL',
                name: 'auditTtl',
                type: 'number',
                default: '',
                description: 'Time-to-live for audit logs (e.g. "30d")',
            },
            {
                displayName: 'Correlation ID',
                name: 'corrId',
                type: 'string',
                default: '',
                description: 'Custom correlation ID for tracking requests',
            },
            {
                displayName: 'Enable Audit',
                name: 'audit',
                type: 'boolean',
                default: false,
                description: 'Whether to enable auditing for solver operations',
            },
            {
                displayName: 'Enable Debug',
                name: 'debug',
                type: 'boolean',
                default: false,
                description: 'Whether to enable debug mode for the solver',
            },

            {
                displayName: 'Excluded Condition Columns',
                name: 'excludedConditionCols',
                type: 'string',
                typeOptions: {
                    multipleValues: true,
                },
                default: [],
                description: 'Columns to exclude from condition evaluation',
            },
            {
                displayName: 'Included Condition Columns',
                name: 'includedConditionCols',
                type: 'string',
                typeOptions: {
                    multipleValues: true,
                },
                default: [],
                description: 'Columns to include in condition evaluation',
            },
            {
                displayName: 'Strategy',
                name: 'strategy',
                type: 'options',
                default: 'STANDARD',
                options: [
                    { name: 'Standard', value: 'STANDARD' },
                    { name: 'Array', value: 'ARRAY' },
                    { name: 'First Match', value: 'FIRST_MATCH' },
                    { name: 'Evaluate All', value: 'EVALUATE_ALL' },
                ],
                description: 'Select the solver strategy',
            },
        ],
    },
]