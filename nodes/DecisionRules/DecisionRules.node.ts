import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

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
		requestDefaults: {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Solve', value: 'solveRes' },
					{ name: 'Management', value: 'managementRes' },
					{ name: 'Job', value: 'jobRes' },
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
						resource: ['solveRes'],
					},
				},
				options: [
					{
						name: 'Solve Rule',
						value: 'solve',
						description: 'Takes the Node input and sends its as data to defined host and performs a Solve Rule',
						action: 'Solve Rule',


					},
				],
				default: 'solve',
				description: 'Select the operation to perform.',
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
						description: 'Takes the Node input and sends its as data to defined host and starts a Job on Integration Flow Rule',
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
						description: 'When a Job was started you can retrieve information about Job success, failure or if its in process based on Job ID',
						action: 'Get Job Info',

					},
				],
				default: 'startJob',
				description: 'Select the operation to perform.',
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
				type: 'number',
				default: '',
				required: false,
				placeholder: 'e.g., 2',
				description: 'The specific version of the rule to use. If empty, the latest is used',
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
						displayName: 'Included Condition Columns',
						name: 'includedConditionCols',
						type: 'string',
						typeOptions: {
							multipleValues: true,
						},
						default: [],
						description: 'Columns to include in condition evaluation.',
					},
					{
						displayName: 'Excluded Condition Columns',
						name: 'excludedConditionCols',
						type: 'string',
						typeOptions: {
							multipleValues: true,
						},
						default: [],
						description: 'Columns to exclude from condition evaluation.',
					},
					{
						displayName: 'Enable Debug',
						name: 'debug',
						type: 'boolean',
						default: false,
						description: 'Enable debug mode for the solver.',
					},
					{
						displayName: 'Correlation ID',
						name: 'corrId',
						type: 'string',
						default: '',
						description: 'Custom correlation ID for tracking requests.',
					},
					{
						displayName: 'Enable Audit',
						name: 'audit',
						type: 'boolean',
						default: false,
						description: 'Enable auditing of solver operations.',
					},
					{
						displayName: 'Audit TTL',
						name: 'auditTtl',
						type: 'number',
						default: '',
						description: 'Time-to-live for audit logs (e.g. "30d").',
					},
					{
						displayName: 'Alias Conflict Path',
						name: 'aliasConflictPath',
						type: 'string',
						default: '',
						description: 'Path to handle alias conflicts.',
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
						description: 'Select the solver strategy.',
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
		let responseData;
		if (operation == "solve" || operation == "startJob") {
			const ruleId = this.getNodeParameter("ruleId" as 'resource');
			const ruleVersion = this.getNodeParameter("ruleVersion" as 'resource');

			if (operation == "solve") {
				responseData = await this.helpers.httpRequest({
					method: 'POST',
					url: `${credentials["host"]}/rule/solve/${ruleId}${ruleVersion ? "/" + ruleVersion : ""}`,
					body: { data: items.map(el => el.json) },
					headers: { Authorization: `Bearer ${credentials["solverApiKey"]}` },
					json: true,
				});
			}
			if (operation == "startJob") {
				responseData = await this.helpers.httpRequest({
					method: 'POST',
					url: `${credentials["host"]}/job/start/${ruleId}${ruleVersion ? "/" + ruleVersion : ""}`,
					body: { data: items.map(el => el.json) },
					headers: { Authorization: `Bearer ${credentials["solverApiKey"]}` },
					json: true,
				});
			}
		}
		if (operation == "cancelJob") {
			const jobId = this.getNodeParameter("jobId" as 'resource');
			responseData = await this.helpers.httpRequest({
				method: 'POST',
				url: `${credentials["host"]}/job/cancel/${jobId}`,
				headers: { Authorization: `Bearer ${credentials["solverApiKey"]}` },
				json: true,
			});
		}
		if (operation == "jobInfo") {
			const jobId = this.getNodeParameter("jobId" as 'resource');
			responseData = await this.helpers.httpRequest({
				method: 'GET',
				url: `${credentials["host"]}/job/${jobId}`,
				headers: { Authorization: `Bearer ${credentials["solverApiKey"]}` },
				json: true,
			});
		}
		return [this.helpers.returnJsonArray(responseData)];
	}
}
