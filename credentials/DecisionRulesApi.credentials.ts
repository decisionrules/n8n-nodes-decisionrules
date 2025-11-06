import {
    Icon,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class DecisionRulesApi implements ICredentialType {
    name = 'decisionRulesApi';
    displayName = 'DecisionRules Credentials API';
    documentationUrl = 'https://docs.decisionrules.io/doc/api/api-keys';
    icon?: Icon | undefined = `file:dr.svg`;

    properties: INodeProperties[] = [
        {
            displayName: 'Host',
            name: 'host',
            type: 'string',
            default: '',
            required: true
        },
        {
            displayName: 'Solver API Key',
            name: 'solverApiKey',
            type: 'string',
            default: '',
            typeOptions: {
                password: true,
            },
        },
        {
            displayName: 'Management API Key',
            name: 'managementApiKey',
            type: 'string',
            default: '',
            typeOptions: {
                password: true,
            },
        },
    ];

    test: ICredentialTestRequest = {
        request: {
            baseURL: '={{ $credentials.host }}',
            url: '/health-check',
        },
    };
}
