import { INodeProperties } from "n8n-workflow";

export const commonParameters: INodeProperties[] = [
    {
        displayName: 'Rule ID or Alias',
        name: 'ruleId',
        type: 'string',
        default: '',
        required: true,
        placeholder: 'my-rule-alias or ID...',
        description: 'The unique identifier or alias for the rule',
        displayOptions: {
            show: {
                operation: [
                    'solve',
                    'startJob',
                    'lockRule',
                    'updateRuleStatus',
                    'updateRule',
                    'createNewRuleVersion',
                    'updateTags',
                    'deleteTags',
                    'findDuplicates',
                    'findDependencies'
                ],
                resource: [
                    'solveRes',
                    'jobRes',
                    'managementTagRes',
                    'managementRuleRes',
                    'managementToolsRes'
                ],
            },
        },
    },
    {
        displayName: 'Rule Version',
        name: 'ruleVersion',
        type: 'string',
        default: '',
        placeholder: 'e.g., 1',
        description: 'The specific version of the rule to use. If empty, the latest is used.',
        displayOptions: {
            show: {
                operation: [
                    'solve',
                    'startJob',
                    'getRule',
                    'updateRule',
                    'deleteRule',
                    'updateTags',
                    'findDuplicates',
                    'findDependencies'
                ],
                resource: [
                    'solveRes',
                    'jobRes',
                    'managementTagRes',
                    'managementRuleRes',
                    'managementToolsRes'
                ]
            },
        },
    },
    {
        displayName: 'Version',
        name: 'ruleVersion',
        type: 'string',
        default: '',
        required: true,
        placeholder: 'e.g., 1',
        description: 'Specify a rule version.',
        displayOptions: {
            show: {
                resource: [
                    'managementRuleRes',
                    'managementTagRes',
                    'managementToolsRes'
                ],
                operation: [
                    'updateRuleStatus',
                    'lockRule',
                    'deleteTags'
                ],
            },
        },
    },
]