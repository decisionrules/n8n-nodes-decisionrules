import type {
	CredentialInformation,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes } from 'n8n-workflow';
import { solveOperations, solveParameters } from './categories/solve/solve';
import { jobOperations, jobParameters } from './categories/job/job';
import { commonParameters } from './categories/common';
import { managementOperations, managementParameters } from './categories/management/management';

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
					{ name: 'Management Rule', value: 'managementRuleRes' },
					{ name: 'Management Folder', value: 'managementFolderRes' },
					{ name: 'Management Tag', value: 'managementTagRes' },
					{ name: 'Management Tools', value: 'managementToolsRes' },
					{ name: 'Job', value: 'jobRes' },
				],
				default: 'solveRes',
			},
			...solveOperations,
			...jobOperations,
			...managementOperations,
			...solveParameters,
			...jobParameters,
			...managementParameters,
			...commonParameters,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const credentials = await this.getCredentials('decisionRulesApi');
		const operation = this.getNodeParameter("operation" as 'resource');
		const host = (credentials["host"] as string).endsWith('/') ? (credentials["host"] as string).slice(0, -1) : credentials["host"];
		const managementHost = host + "/api"
		const managementApiKey = credentials["managementApiKey"]
		const solverApiKey = credentials["solverApiKey"]
		let responseData;

		const getPath = (host: CredentialInformation, type: any[], id: any, version?: any, path?: any): string => {
			const hostWithType = `${host}/${type.join("/")}/`
			const idWithVersion = `${id ? `${id}/${version}` : ''}`
			const pathWithVersion = `${path ? `?path=${path}${version ? `&version=${version}` : ''}` : ''}`
			return `${hostWithType}${idWithVersion ? idWithVersion : pathWithVersion}`
		}

		const getOptionalParam = (
			name: string,
			defaultValue: any = undefined,
			itemIndex = 0,
		) => {
			try {
				return this.getNodeParameter(name, itemIndex, defaultValue);
			} catch (error) {
				return defaultValue;
			}
		};

		const ruleId = getOptionalParam("ruleId");
		const ruleVersion = getOptionalParam("ruleVersion");
		const pathFolder = getOptionalParam("pathFolder");
		const path = getOptionalParam("path");
		const nodeId = getOptionalParam('nodeId');

		try {
			switch (operation) {
				case "solve": {
					const solveOptions = getOptionalParam("solveOptions");
					responseData = await this.helpers.httpRequest.call(this, {
						method: 'POST',
						url: `${host}/rule/solve/${ruleId}${ruleVersion ? "/" + ruleVersion : ""}`,
						body: { data: items.map(el => el.json), options: solveOptions },
						headers: {
							'Authorization': `Bearer ${solverApiKey}`,
						},
						json: true,
					});
					break;
				}
				case "startJob": {
					responseData = await this.helpers.httpRequest.call(this, {
						method: 'POST',
						url: `${host}/job/start/${ruleId}${ruleVersion ? "/" + ruleVersion : ""}`,
						body: { data: items.map(el => el.json) },
						headers: {
							'Authorization': `Bearer ${solverApiKey}`,
						},
						json: true,
					});
					break;
				}
				case 'getRule': {
					responseData = await this.helpers.httpRequest.call(this, {
						method: 'GET',
						url: getPath(managementHost, ["rule"], ruleId, ruleVersion, path),
						headers: { 'Authorization': `Bearer ${managementApiKey}` },
						json: true,
					});
					break;
				}
				case 'createNewRuleVersion': {
					responseData = await this.helpers.httpRequest.call(this, {
						method: 'POST',
						url: `${managementHost}/rule/${ruleId}/new-version`,
						headers: { 'Authorization': `Bearer ${managementApiKey}` },
						body: items[0].json,
						json: true,
					});
					break;
				}
				case 'updateRule': {
					responseData = await this.helpers.httpRequest.call(this, {
						method: 'PUT',
						url: `${managementHost}/rule/${ruleId}/${ruleVersion}`,
						headers: { 'Authorization': `Bearer ${managementApiKey}` },
						body: items[0].json,
						json: true,
					});
					break;
				}
				case 'updateRuleStatus': {
					const status = this.getNodeParameter('status', 0) as string;
					responseData = await this.helpers.httpRequest.call(this, {
						method: 'PUT',
						url: `${managementHost}/rule/status/${ruleId}/${status}/${ruleVersion}`,
						headers: { 'Authorization': `Bearer ${managementApiKey}` },
						json: true,
					});

					break;
				}
				case 'deleteRule': {
					responseData = await this.helpers.httpRequest.call(this, {
						method: 'DELETE',
						url: `${managementHost}/rule/${ruleId}/${ruleVersion}`,
						headers: { 'Authorization': `Bearer ${managementApiKey}` },
						json: true,
					});
					break;
				}
				case 'lockRule': {
					const locked = this.getNodeParameter('locked' as 'resource');
					responseData = await this.helpers.httpRequest.call(this, {
						method: 'PATCH',
						url: `${managementHost}/rule/lock/${ruleId}/${ruleVersion}`,
						headers: { 'Authorization': `Bearer ${managementApiKey}` },
						body: { locked },
						json: true,
					});
					break;
				}
				case 'getTags': {
					const tags = (this.getNodeParameter('tagsList', 0) as any).tags;
					responseData = await this.helpers.httpRequest.call(this, {
						method: 'GET',
						url: `${managementHost}/tags/items${tags.length ? `?tags=${tags.map((el: any) => el.tag).join(",")}` : ''}`,
						headers: { 'Authorization': `Bearer ${managementApiKey}` },
						json: true,
					});
					break;
				}
				case 'updateTags': {
					const tags = (this.getNodeParameter('updateTagsList', 0) as any).tags;
					responseData = await this.helpers.httpRequest.call(this, {
						method: 'PATCH',
						url: `${managementHost}/tags/${ruleId}/${ruleVersion}`,
						headers: { 'Authorization': `Bearer ${managementApiKey}` },
						body: tags.map((el: any) => { return { tagName: el.tag, color: el.color } }),
						json: true,
					});

					break;
				}
				case 'deleteTags': {
					const tags = (this.getNodeParameter('tagsList', 0) as any).tags;
					responseData = await this.helpers.httpRequest.call(this, {
						method: 'DELETE',
						url: `${managementHost}/tags/${ruleId}/${ruleVersion}${tags.length ? `?tags=${tags.map((el: any) => el.tag).join(",")}` : ''}`,
						headers: { 'Authorization': `Bearer ${managementApiKey}` },
						json: true,
					});
					break;
				}
				case 'findDependencies': {
					responseData = await this.helpers.httpRequest.call(this, {
						method: 'GET',
						url: `${managementHost}/tools/dependencies/${ruleId}/${ruleVersion}`,
						headers: { 'Authorization': 'Bearer ' + managementApiKey },
						json: true,
					});
					break;
				}
				case 'findDuplicates': {
					responseData = await this.helpers.httpRequest.call(this, {
						method: 'GET',
						url: `${managementHost}/tools/duplicates/${ruleId}/${ruleVersion}`,
						headers: { 'Authorization': `Bearer ${managementApiKey}` },
						json: true,
					});
					break;
				}
				case 'getRulesForSpace': {
					responseData = await this.helpers.httpRequest.call(this, {
						method: 'GET',
						url: `${managementHost}/space/items`,
						headers: { 'Authorization': `Bearer ${managementApiKey}` },
						json: true,
					});
					break;
				}
				case 'createRule': {
					responseData = await this.helpers.httpRequest.call(this, {
						method: 'POST',
						url: `${managementHost}/rule`,
						headers: { 'Authorization': `Bearer ${managementApiKey}` },
						body: items[0].json,
						json: true,
					});
					break;
				}
				case 'getFolderStructure': {
					responseData = await this.helpers.httpRequest.call(this, {
						method: 'GET',
						url: getPath(managementHost, ["folder"], nodeId, '', pathFolder),

						headers: { 'Authorization': `Bearer ${managementApiKey}` },
						json: true,
					});
					break;
				}
				case 'createFolder': {
					responseData = await this.helpers.httpRequest.call(this, {
						method: 'POST',
						url: getPath(managementHost, ["folder"], nodeId, '', pathFolder),
						headers: { 'Authorization': `Bearer ${managementApiKey}` },
						body: items[0].json,
						json: true,
					});
					break;
				}
				case 'updateNodeFolderStructure': {
					responseData = await this.helpers.httpRequest.call(this, {
						method: 'PUT',
						url: getPath(managementHost, ["folder"], nodeId, '', pathFolder),
						headers: { 'Authorization': `Bearer ${managementApiKey}` },
						body: items[0].json,
						json: true,
					});
					break;
				}
				case 'exportFolder': {
					responseData = await this.helpers.httpRequest.call(this, {
						method: 'GET',
						url: getPath(managementHost, ["folder", "export"], nodeId, '', pathFolder),
						headers: { 'Authorization': `Bearer ${managementApiKey}` },
						json: true,
					});
					break;
				}
				case 'importFolder': {
					responseData = await this.helpers.httpRequest.call(this, {
						method: 'POST',
						url: `${managementHost}/folder/import/${nodeId}`,
						headers: { 'Authorization': `Bearer ${managementApiKey}` },
						body: items[0].json,
						json: true,
					});
					break;
				}
				case 'deleteFolder': {
					const deleteAll = getOptionalParam('deleteAll', false) as boolean;
					responseData = await this.helpers.httpRequest.call(this, {
						method: 'DELETE',
						url: getPath(managementHost, ["folder"], nodeId, '', pathFolder),
						headers: { 'Authorization': `Bearer ${managementApiKey}` },
						qs: { deleteAll },
						json: true,
					});
					break;
				}
				case 'renameFolder': {
					const name = this.getNodeParameter('newName', 0) as string;
					responseData = await this.helpers.httpRequest.call(this, {
						method: 'PATCH',
						url: getPath(managementHost, ["folder", "rename"], nodeId, '', pathFolder),
						headers: { 'Authorization': `Bearer ${managementApiKey}` },
						body: { name },
						json: true,
					});
					break;
				}
				case 'moveFolder': {
					const targetId = this.getNodeParameter('nodeId', 0) as string;
					const nodes = (this.getNodeParameter('nodes', 0) as any).nodes;
					responseData = await this.helpers.httpRequest.call(this, {
						method: 'PUT',
						url: `${managementHost}/folder/move`,
						headers: { 'Authorization': `Bearer ${managementApiKey}` },
						body: { targetId, nodes },
						json: true,
					});
					break;
				}
				case 'findFolderOrRule': {
					const findOptions = getOptionalParam('findOptions', {});
					responseData = await this.helpers.httpRequest.call(this, {
						method: 'POST',
						url: `${managementHost}/folder/find`,
						headers: { 'Authorization': `Bearer ${managementApiKey}` },
						body: findOptions,
						json: true,
					});
					break;
				}
				case "cancelJob": {
					const jobId = this.getNodeParameter("jobId" as 'resource');
					responseData = await this.helpers.httpRequest.call(this, {
						method: 'POST',
						url: `${host}/job/cancel/${jobId}`,
						headers: {
							'Authorization': `Bearer ${solverApiKey}`,
						},
						json: true,
					});
					break;
				}
				case "jobInfo": {
					const jobId = this.getNodeParameter("jobId" as 'resource');
					responseData = await this.helpers.httpRequest.call(this, {
						method: 'GET',
						url: `${host}/job/${jobId}`,
						headers: {
							'Authorization': `Bearer ${solverApiKey}`,
						},
						json: true,
					});
					break;
				}
			}
		} catch (e) {
			throw new NodeApiError(this.getNode(), e)
		}
		responseData = Array.isArray(responseData) ? responseData : [responseData]
		return [responseData.map((data: any, i: number) => ({ json: data, pairedItem: { item: i } }))];
	}
}
