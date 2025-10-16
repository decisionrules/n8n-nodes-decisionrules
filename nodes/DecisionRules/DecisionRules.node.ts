import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes } from 'n8n-workflow';

export class DecisionRules implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'DecisionRules',
		name: 'decisionRules',
		group: ['transform'],
		version: [1],
		defaultVersion: 1,
		icon: { light: 'file:dr.svg', dark: 'file:dr.svg' },
		description: 'DecisionRules Actions',
		defaults: {
			name: 'DecisionRules',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'decisionRulesApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Solve', value: 'solveRes' },
					{ name: 'Job', value: 'jobRes' },
				],
				default: 'solveRes',
			},
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
						operation: ['solve', 'startJob'],
						resource: ['solveRes', 'jobRes'],
					},
				},
			},
			{
				displayName: 'Rule Version',
				name: 'ruleVersion',
				type: 'string',
				default: '',

				placeholder: 'e.g., 2',
				description: 'The specific version of the rule to use. If empty, the latest is used.',
				displayOptions: {
					show: {
						operation: ['solve', 'startJob'],
						resource: ['solveRes', 'jobRes'],
					},
				},
			},
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
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const credentials = await this.getCredentials('decisionRulesApi');
		const operation = this.getNodeParameter("operation" as 'resource');
		const host = (credentials["host"] as string).endsWith('/') ? (credentials["host"] as string).slice(0, -1) : credentials["host"];
		let responseData;

		try {
			if (operation == "solve" || operation == "startJob") {
				const ruleId = this.getNodeParameter("ruleId" as 'resource');
				const ruleVersion = this.getNodeParameter("ruleVersion" as 'resource');

				if (operation == "solve") {
					let solveOptions = {}
					try {
						solveOptions = this.getNodeParameter("solveOptions" as 'resource');
					} catch {

					}
					responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'decisionRulesApi', {
						method: 'POST',
						url: `${host}/rule/solve/${ruleId}${ruleVersion ? "/" + ruleVersion : ""}`,
						body: { data: items.map(el => el.json), options: solveOptions },
						json: true,
					});
				}
				if (operation == "startJob") {
					responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'decisionRulesApi', {
						method: 'POST',
						url: `${host}/job/start/${ruleId}${ruleVersion ? "/" + ruleVersion : ""}`,
						body: { data: items.map(el => el.json) },
						json: true,
					});
				}
			}
			if (operation == "cancelJob") {
				const jobId = this.getNodeParameter("jobId" as 'resource');
				responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'decisionRulesApi', {
					method: 'POST',
					url: `${host}/job/cancel/${jobId}`,
					json: true,
				});
			}
			if (operation == "jobInfo") {
				const jobId = this.getNodeParameter("jobId" as 'resource');
				responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'decisionRulesApi', {
					method: 'GET',
					url: `${host}/job/${jobId}`,
					json: true,
				});

			}
		} catch (e) {
			throw new NodeApiError(this.getNode(), e)
		}
		return [responseData.map((data: any, i: number) => ({ json: data, pairedItem: { item: i } }))];
	}
}
