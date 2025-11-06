import { INodeProperties } from "n8n-workflow";

const managementRuleOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['managementRuleRes'],
            },
        },
        options: [
            {
                name: 'Create New Rule Version',
                value: 'createNewRuleVersion',
                description: 'Creates a new version of an existing rule',
                action: 'Create a new rule version',
            },
            {
                name: 'Create Rule',
                value: 'createRule',
                description: 'Creates a new rule',
                action: 'Create a rule',
            },
            {
                name: 'Delete Rule',
                value: 'deleteRule',
                description: 'Deletes a specific rule or a version of a rule',
                action: 'Delete a rule',
            },
            {
                name: 'Get Rule',
                value: 'getRule',
                description: 'Retrieves a specific rule by its ID or alias',
                action: 'Get a rule',
            },
            {
                name: 'Get Rules for Space',
                value: 'getRulesForSpace',
                description: 'Retrieves all rules within the configured space',
                action: 'Get all rules for a space',
            },
            {
                name: 'Lock Rule',
                value: 'lockRule',
                description: 'Locks or unlocks a rule to prevent edits',
                action: 'Lock or unlock a rule',
            },
            {
                name: 'Update Rule',
                value: 'updateRule',
                description: 'Updates the content or properties of a rule',
                action: 'Update a rule',
            },
            {
                name: 'Update Rule Status',
                value: 'updateRuleStatus',
                description: "Changes a rule's status (e.g., to published or pending)",
                action: "Update a rule's status",
            },
        ],
        default: 'getRule',
    },
];

const managementFolderOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['managementFolderRes'],
            },
        },
        options: [
            {
                name: 'Create Folder',
                value: 'createFolder',
                description: 'Creates a new folder at a specified location',
                action: 'Create a folder',
            },
            {
                name: 'Delete Folder',
                value: 'deleteFolder',
                description: 'Deletes a folder and optionally all its contents',
                action: 'Delete a folder',
            },
            {
                name: 'Export Folder',
                value: 'exportFolder',
                description: 'Exports the contents of a folder as a JSON object',
                action: 'Export a folder',
            },
            {
                name: 'Get Folder Structure',
                value: 'getFolderStructure',
                description: 'Retrieves the folder and rule hierarchy',
                action: 'Get the folder structure',
            },
            {
                name: 'Import Folder',
                value: 'importFolder',
                description: 'Imports a folder structure from a JSON object',
                action: 'Import a folder',
            },
            {
                name: 'Move Folder',
                value: 'moveFolder',
                description: 'Moves a folder or rule to a different location',
                action: 'Move a folder or rule',
            },
            {
                name: 'Rename Folder',
                value: 'renameFolder',
                description: 'Renames an existing folder',
                action: 'Rename a folder',
            },
            {
                name: 'Update Node Folder Structure',
                value: 'updateNodeFolderStructure',
                description: 'Updates the structure of a folder or node',
                action: 'Update a node folder structure',
            },
            {
                name: 'Find Folder or Rule',
                value: 'findFolderOrRule',
                description: 'Finds a folder or rule by various attributes',
                action: 'Find a folder or rule',
            }
        ],
        default: 'getFolderStructure',
    },
];

const managementTagOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['managementTagRes'],
            },
        },
        options: [
            {
                name: 'Delete Tags',
                value: 'deleteTags',
                description: 'Removes one or more tags from a rule',
                action: 'Delete tags from a rule',
            },
            {
                name: 'Get Rules by Tags',
                value: 'getTags',
                description: 'Retrieves all tags associated with a rule',
                action: 'Get tags for a rule',
            },
            {
                name: 'Update Tags',
                value: 'updateTags',
                description: 'Adds or overwrites tags for a rule',
                action: 'Update tags for a rule',
            },
        ],
        default: 'getTags',
    },
];

const managementToolsOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['managementToolsRes'],
            },
        },
        options: [
            {
                name: 'Find Dependencies',
                value: 'findDependencies',
                description: 'Finds all dependencies for a given rule',
                action: 'Find rule dependencies',
            },
            {
                name: 'Find Duplicates',
                value: 'findDuplicates',
                description: 'Finds duplicate conditions within a rule',
                action: 'Find duplicates in a rule',
            },
        ],
        default: 'findDependencies',
    },
];

const managementRuleParameters: INodeProperties[] = [
    {
        displayName: 'Identify By',
        name: 'identifierType',
        type: 'options',
        options: [
            { name: 'ID or Alias', value: 'id' },
            { name: 'Path', value: 'path' },
        ],
        default: 'id',
        displayOptions: {
            show: {
                resource: ['managementRuleRes'],
                operation: [
                    'getRule',
                    'deleteRule',
                ],
            },
        },
    },
    {
        displayName: 'Rule ID or Alias',
        name: 'ruleId',
        type: 'string',
        default: '',
        required: true,
        placeholder: 'e.g., my-rule-alias or an ID',
        description: 'The unique ID or alias of the rule to target',
        displayOptions: {
            show: {
                resource: ['managementRuleRes'],
                operation: [
                    'getRule',
                    'deleteRule',
                ],
                identifierType: ['id']
            },
        },
    },
    {
        displayName: 'Path to the rule',
        name: 'path',
        type: 'string',
        default: '',
        required: true,
        placeholder: 'e.g., /New folderRule Name',
        description: 'The unique path to the rule',
        displayOptions: {
            show: {
                resource: ['managementRuleRes'],
                operation: [
                    'getRule',
                    'deleteRule',
                ],
                identifierType: ['path']
            },
        },
    },
    {
        displayName: 'Path to folder',
        name: 'path',
        type: 'string',
        default: '',
        placeholder: 'e.g., /New folder',
        description: 'The unique path to folder',
        displayOptions: {
            show: {
                resource: ['managementRuleRes'],
                operation: ['createRule'],
            },
        },
    },
    {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
            { name: 'Pending', value: 'pending' },
            { name: 'Published', value: 'published' },
        ],
        default: 'published',
        required: true,
        description: 'The new status for the rule',
        displayOptions: {
            show: {
                resource: ['managementRuleRes'],
                operation: ['updateRuleStatus'],
            },
        },
    },
    {
        displayName: 'Lock Rule',
        name: 'locked',
        type: 'boolean',
        default: true,
        required: true,
        description: 'Whether to lock the rule to prevent edits',
        displayOptions: {
            show: {
                resource: ['managementRuleRes'],
                operation: ['lockRule'],
            },
        },
    },
];

const managementTagParameters: INodeProperties[] = [
    {
        displayName: 'Tags',
        name: 'tagsList',
        type: 'fixedCollection',
        default: '',
        typeOptions: {
            multipleValues: true,
        },
        description: '',
        options: [
            {
                name: 'tags',
                displayName: 'Tags',
                values: [
                    {
                        displayName: 'Tag name',
                        name: 'tag',
                        type: 'string',
                        default: '',
                        required: true,
                        description: 'tag1 e.g.',
                    },
                ],
            },
        ],
        displayOptions: {
            show: {
                resource: ['managementTagRes'],
                operation: ['getTags', 'deleteTags'],
            },
        },
    },
    {
        displayName: 'Tags',
        name: 'updateTagsList',
        type: 'fixedCollection',
        default: '',
        typeOptions: {
            multipleValues: true,
        },
        description: '',
        options: [
            {
                name: 'tags',
                displayName: 'Tags',
                values: [
                    {
                        displayName: 'Tag name',
                        name: 'tag',
                        type: 'string',
                        default: '',
                        required: true,
                        description: 'tag1 e.g.',
                    },
                    {
                        displayName: 'Color',
                        name: 'color',
                        type: 'options',
                        options: [
                            { name: 'Default', value: 'default' },
                            { name: 'Violet', value: 'violet' },
                            { name: 'Yellow', value: 'yellow' },
                            { name: 'Green', value: 'green' },
                            { name: 'Red', value: 'red' },
                            { name: 'White', value: 'white' },
                        ],
                        default: 'default',
                    },
                ],
            },
        ],
        displayOptions: {
            show: {
                resource: ['managementTagRes'],
                operation: ['updateTags'],
            },
        },
    },
];

const managementFolderParameters: INodeProperties[] = [
    {
        displayName: 'Identify By',
        name: 'identifierTypeFolder',
        type: 'options',
        options: [
            { name: 'Node ID', value: 'id' },
            { name: 'Path', value: 'path' },
        ],
        default: 'id',
        displayOptions: {
            show: {
                resource: ['managementFolderRes'],
                operation: [
                    'updateNodeFolderStructure',
                    'exportFolder',
                    'getFolderStructure',
                    'deleteFolder',
                    'renameFolder',
                    'createFolder',
                    'importFolder',
                ],
            },
        },
    },
    {
        displayName: 'Target Folder ID',
        name: 'nodeId',
        type: 'string',
        default: '',
        placeholder: 'Empty for root or e.g., b64e1a2a-453f-6b9f-14a6-db5c4e549fbb',
        description: 'The ID of the *destination* folder. Leave empty to target the root.',
        displayOptions: {
            show: {
                resource: ['managementFolderRes'],
                operation: [
                    'moveFolder'
                ],
            },
        },
    },
    {
        displayName: 'Node ID',
        name: 'nodeId',
        type: 'string',
        default: '',
        placeholder: 'Empty for root or e.g., b64e1a2a-453f-6b9f-14a6-db5c4e549fbb',
        description: 'The ID of the folder/node. Leave empty to target the root.',
        displayOptions: {
            show: {
                resource: ['managementFolderRes'],
                operation: [
                    'updateNodeFolderStructure',
                    'importFolder',
                    'exportFolder',
                    'getFolderStructure',
                    'createFolder',
                ],
                identifierTypeFolder: ['id']
            },
        },
    },
    {
        displayName: 'Node ID',
        name: 'nodeId',
        type: 'string',
        default: '',
        required: true,
        placeholder: 'Empty for root or e.g., b64e1a2a-453f-6b9f-14a6-db5c4e549fbb',
        description: 'The ID of the folder/node.',
        displayOptions: {
            show: {
                resource: ['managementFolderRes'],
                operation: [
                    'deleteFolder',
                    'renameFolder'
                ],
                identifierTypeFolder: ['id']
            },
        },
    },
    {
        displayName: 'Path to folder',
        name: 'pathFolder',
        type: 'string',
        default: '',
        required: true,
        placeholder: 'e.g. /New Folder',
        description: 'The path to folder.',
        displayOptions: {
            show: {
                resource: ['managementFolderRes'],
                operation: [
                    'deleteFolder',
                    'renameFolder'
                ],
                identifierTypeFolder: ['path']
            },
        },
    },
    {
        displayName: 'Path to folder',
        name: 'pathFolder',
        type: 'string',
        default: '',
        placeholder: 'e.g. /New Folder',
        description: 'The path to folder.',
        displayOptions: {
            show: {
                resource: ['managementFolderRes'],
                operation: [
                    'updateNodeFolderStructure',
                    'importFolder',
                    'exportFolder',
                    'getFolderStructure',
                    'createFolder',
                ],
                identifierTypeFolder: ['path']
            },
        },
    },
    {
        displayName: 'Nodes',
        name: 'nodes',
        placeholder: 'Add node',
        type: 'fixedCollection',
        default: '',
        typeOptions: {
            multipleValues: true,
        },
        description: '',
        options: [
            {
                name: 'nodes',
                displayName: 'Nodes',
                values: [
                    {
                        displayName: 'Node type',
                        name: 'type',
                        type: 'options',
                        required: true,
                        options: [
                            { name: 'Root', value: 'ROOT' },
                            { name: 'Folder', value: 'FOLDER' },
                            { name: 'Rule', value: 'RULE' },
                        ],
                        default: 'FOLDER',
                    },
                    {
                        displayName: 'Node ID',
                        name: 'id',
                        type: 'string',
                        default: '',
                        required: true,
                        description: 'The ID of the folder/node. For move operation.',
                    },
                ],
            },
        ],
        displayOptions: {
            show: {
                resource: ['managementFolderRes'],
                operation: [
                    'moveFolder'
                ],
            },
        },
    },
    {
        displayName: 'Delete All Contents',
        name: 'deleteAll',
        type: 'boolean',
        default: false,
        description: 'Whether to delete all nested rules and folders within the target folder',
        displayOptions: {
            show: {
                resource: ['managementFolderRes'],
                operation: ['deleteFolder'],
            },
        },
    },
    {
        displayName: 'New Name',
        name: 'newName',
        type: 'string',
        default: '',
        required: true,
        description: 'The new name for the folder',
        displayOptions: {
            show: {
                resource: ['managementFolderRes'],
                operation: ['renameFolder'],
            },
        },
    },
    {
        displayName: 'Filter Attributes',
        name: 'findOptions',
        type: 'collection',
        placeholder: 'Add Filter Attribute',
        default: {},
        displayOptions: {
            show: {
                resource: ['managementFolderRes'],
                operation: ['findFolderOrRule'],
            },
        },
        options: [
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Name of the folder or rule to find',
            },
            {
                displayName: 'ID',
                name: 'id',
                type: 'string',
                default: '',
                description: 'ID of the folder or rule to find',
            },
            {
                displayName: 'Base ID',
                name: 'baseId',
                type: 'string',
                default: '',
                description: 'Base ID of the rule to find',
            },
            {
                displayName: 'Rule Alias',
                name: 'ruleAlias',
                type: 'string',
                default: '',
                description: 'Alias of the rule to find',
            },
            {
                displayName: 'Rule Type',
                name: 'ruleType',
                type: 'options',
                default: '',
                description: 'Type of the rule to find',
                options: [
                    { name: 'Any', value: '' },
                    { name: 'Decision Table', value: 'DECISION_TABLE' },
                    { name: 'Decision Tree', value: 'DECISION_TREE' },
                    { name: 'Scripting Rule', value: 'SCRIPTING_RULE' },
                    { name: 'Decision Flow', value: 'DECISION_FLOW' },
                ],
            },
            {
                displayName: 'Tags',
                name: 'tags',
                type: 'string',
                typeOptions: {
                    multipleValues: true,
                },
                default: [],
                description: 'Tags to filter by',
            },
            {
                displayName: 'Rule status',
                name: 'status',
                type: 'options',
                default: 'published',
                description: 'State of the rule to find',
                options: [
                    { name: 'Pending', value: 'pending' },
                    { name: 'Published', value: 'published' },
                ],
            },
            {
                displayName: 'Type',
                name: 'type',
                type: 'options',
                default: '',
                description: 'Type of the item to find (Folder or Rule)',
                options: [
                    { name: 'Any', value: '' },
                    { name: 'Folder', value: 'FOLDER' },
                    { name: 'Rule', value: 'RULE' },
                ],
            },
            {
                displayName: 'Version',
                name: 'version',
                type: 'number',
                default: undefined,
                description: 'Version of the rule to find',
            },
        ],
    },
];

export const managementOperations = [
    ...managementRuleOperations,
    ...managementTagOperations,
    ...managementFolderOperations,
    ...managementToolsOperations
]

export const managementParameters = [
    ...managementRuleParameters,
    ...managementTagParameters,
    ...managementFolderParameters
]
