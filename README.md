# n8n-nodes-decisionrules

This is an n8n community node that integrates DecisionRules with your n8n workflows, so you can execute business rules, run integration flows, and automate complex logic-based tasks.

[DecisionRules](https://www.decisionrules.io) is a no-code business rules engine that allows you to manage and execute complex logic without programming. n8n is a fair-code licensed tool for workflow automation that allows you to connect various services.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

---

## Table of contents

- [Installation](#installation)
- [Operations](#operations)
- [Credentials](#credentials)
- [Compatibility](#compatibility)
- [Usage](#usage)
- [Resources](#resources)

---

## Installation (self-hosted)

To install the DecisionRules community node directly from the n8n Editor UI:

1. Open your n8n instance.
2. Go to **Settings > Community Nodes**
3. Select **Install**.
4. Enter the npm package name: `@decisionrules/n8n-nodes-decisionrules` to install the latest version. To install a specific version (e.g 0.4.4) enter `@decisionrules/n8n-nodes-decisionrules@0.4.4`. All versions are available [here](https://www.npmjs.com/package/@decisionrules/n8n-nodes-decisionrules?activeTab=versions)
5. Agree to the [risks](https://docs.n8n.io/integrations/community-nodes/risks/) of using community nodes and select **Install**
6. The node is now available to use in your workflows.

## Installation (n8n Cloud)

If you’re using n8n Cloud, installing community nodes is even simpler:

1. Go to the **Canvas** and open the **nodes panel**.
2. Search for **DecisionRules** in the community node registry.
3. Click **Install node** to add the decisionrules node to your instance.


 > On n8n cloud users can choose not to show verified community nodes. Instance owners can toggle this in the Cloud Admin Panel. To install the DecisionRules node, make sure the installation of verified community nodes is enabled. 


## Installation (development and contributing) 
To contribute to our DecisionRules node, you can install the node and link it to your n8n instance. Follow the steps below:

### ⚙️ Prerequisites

- Node.js (recommended: v18.10+)
- pnpm installed globally

---

### 1. Initialize n8n locally

Begin by installing and running n8n to create the necessary configuration directory (`~/.n8n`):

```bash
npm install -g n8n # Skip this step if you already have n8n installed globally
n8n start # This will generate the ~/.n8n directory
```

### 2. Clone and build the Node Package

Install dependencies and build the node:

```bash
pnpm install
pnpm run build
```

### 3. Link the custom node to n8n

Create the `custom` directory inside `~/.n8n` (if it doesn't exist), then symlink your local node package:

```bash
mkdir -p ~/.n8n/custom
ln -s /full/path/to/n8n-nodes-decisionrules ~/.n8n/custom/n8n-nodes-decisionrules # replace full/path/to with the path to your n8n-nodes-decisionrules directory
```

> **Note:** Use the absolute path in the symlink for compatibility.

### 4. Restart n8n

Now that your custom node is linked, start n8n again:

```bash
n8n start
```

---

### 🔁 Making changes

If you make any changes to your custom node locally, remember to rebuild and restart:

```bash
pnpm run build
n8n start
```

---

## Operations

This node supports the following operations:
### Rules
- Solve Rule
Takes the input data from a previous node and sends it to the DecisionRules API to solve a rule (e.g., decision table, decision tree). The node then outputs the result from the API.
### Integration Flows
- Start Job:
Takes the input data from a previous node to start a new asynchronous job for a specific Integration Flow rule. The node outputs the job initiation details.
- Get Job Info:
Retrieves the status and information (e.g., success, failure, in-process) for a specific job using its Job ID.
- Cancel Job:
Cancels a running or waiting job using its Job ID.

### Management
The Management operations allow you to programmatically manage your DecisionRules rules, folders, and tags.

#### Rule Management
- **Get Rule**: Retrieves all information about a rule, including its content, version, input/output schemas. Can fetch by rule ID, alias, or path.
- **Create Rule**: Creates a new rule based on the request body.
- **Create New Rule Version**: Creates a new version of an existing rule with modifications.
- **Update Rule**: Modifies an existing rule (cannot change rule ID, version, alias, or last update date).
- **Update Rule Status**: Changes rule status between 'pending' and 'published'.
- **Delete Rule**: Deletes a rule by ID, alias, or path.
- **Lock Rule**: Locks or unlocks a rule to prevent/allow modifications.
- **Get Rules For Space**: Retrieves all rules and rule flows in the current space.

#### Rule Analysis
- **Find Dependencies**: Identifies all dependencies for a specific rule.
- **Find Duplicates**: Finds duplicate rules in decision tables.

#### Tag Management
- **Get Tags**: Retrieves all rules/rule flows with specific tags.
- **Update Tags**: Adds tags to a rule (all versions or specific version).
- **Delete Tags**: Removes tags from a rule (all versions or specific version).

#### Folder Management
- **Get Folder Structure**: Retrieves the folder hierarchy and contents by node ID or path.
- **Create Folder**: Creates a new folder structure under a target location.
- **Update Node Folder Structure**: Modifies existing folder structure and moves rules.
- **Delete Folder**: Deletes a folder and optionally all its contents.
- **Rename Folder**: Changes the name of a folder.
- **Move Folder**: Moves folders and/or rules to a different parent location.
- **Export Folder**: Exports a folder with all its rules.
- **Import Folder**: Imports a folder structure with rules into a target location.
- **Find Folder or Rule**: Searches for folders and rules by various attributes (name, ID, tags, type, etc.).

---

## Credentials

To use this node, you will need to authenticate with the DecisionRules Solve API and specify host URL.

To configure your credentials:
1.  Log in to your DecisionRules account.
2.  To specify the host correctly you can use the URL that you logged in by and you change app to api.
(app.decisionrules.io -> api.decisionrules.io)
2.  Navigate to **Space > API Keys > Solver** to find your API Token.
3.  In n8n, go to the Credentials section and add new credentials for the 'DecisionRules API'.
4.  Enter your API Token and host in the respective field.

### For Management API (Management Operations)

To configure your Management API credentials:
1. Log in to your DecisionRules account.
2. Use the same host format as above (e.g., `api.decisionrules.io`).
3. Navigate to **Space > API Keys > Management** to find your Management API Token.
4. In n8n, add the Management API credentials.
5. Enter your Management API Token and host in the respective fields.


---

## Compatibility

This node has been tested with n8n version 1.16.3.

---

## Usage

This node is designed to integrate your n8n workflows with the DecisionRules engine. Here's how to understand its behavior:

### Operations Using Input Data (`Solve Rule`, `Start Job`, `Create Rule`, `Create New Rule Version`, `Update Rule`, `Create Folder`, `Update Node Folder Structure`, `Import Folder`)

These operations process data from previous nodes in your workflow. The JSON output of a preceding node will be used as the input payload for the DecisionRules API call.

**Example:** You can have an 'HTTP Request' node that fetches user data. When you connect it to the DecisionRules node and select the `Solve Rule` operation, the fetched user data is sent to your rule for evaluation. The result of that rule is then available as the output of the DecisionRules node for the next steps in your workflow.

**Management Example:** You can prepare a rule definition in JSON format in a previous node, then use `Create Rule` to add it to your DecisionRules space.

### Operations Using Node Parameters (All other operations)

Operations like `Get Job Info`, `Cancel Job`, `Get Rule`, `Delete Rule`, etc. do **not** use the data from previous nodes. Instead, they rely on parameters you configure directly in the node's properties panel in the n8n UI, such as `Job ID`, `Rule ID`, `Node ID`, or `Path`.

**Example:** After using a `Start Job` operation, you can use a 'Wait' node and then a `Get Job Info` node to check the status of that job. You would pass the `jobId` from the `Start Job` output into the 'Job ID' field of the `Get Job Info` node.

---

## Troubleshooting

### Common issues

---

### Authentication errors
- Verify your **Host** is correct (e.g., `https://api.decisionrules.io`).
- Verify your **Solver API Key** is correct.
- Verify your **Management API Key** is correct for Management operations.

---

### Resource Not Found
- Verify the **Rule ID**, **rule alias**, or **Job ID** is correct.
- Check if the resource exists in the **DecisionRules space** associated with your API key.
- Ensure you have access to the resource with the provided key.

---

### Operation failures
- Check that the **input parameters** from the previous node are a valid JSON object.
- For **Solve Rule** and **Start Job**, ensure the incoming data structure matches the expected input model for your rule in DecisionRules.
- For **Create Rule**, **Update Rule**, and **Create New Rule Version**, ensure the rule definition follows the correct format.
- For **Folder operations**, verify the folder structure and node IDs are valid.
- Review the **error message** in the n8n output panel for detailed error messages from the DecisionRules API.

---

## Resources

* [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
* [DecisionRules Documentation](https://docs.decisionrules.io/doc)

---
