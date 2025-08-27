const fdk			= require('@fnproject/fdk');
//const request 		= require('request');
//const axios         = require('axios');
//const bodyParser    = require('body-parser');
const common        = require("oci-common");
const secrets       = require("oci-secrets");
const vaults        = require("oci-vault");
const identity      = require("oci-identity");
const keymanagement = require("oci-keymanagement");

fdk.handle(async function(input, ctx){
	let jiraClientId;
	let jiraClientSecret;
	//const provider      	  = new common.ConfigFileAuthenticationDetailsProvider(); // locally using config file
	const provider 			  = new common.ResourcePrincipalAuthenticationDetailsProvider(); // using resource principal provider of OCI
	const ociVaultName        = "IBA Vault";
	const ociCompartmentName  = "NONPROD-Oracle-Integration-CMP";
	//const app 				  = express();
	
	//(async() => {
	//  jiraClientId      = await getSecret('jira-ClientId');
	//  jiraClientSecret  = await getSecret('jira-ClientSecret');
	//})();
	
	async function getVaultOCID(vaultName, compartmentId) {
	  try {
		  const keyClient = new keymanagement.KmsVaultClient({ authenticationDetailsProvider: provider});

		  const listVaultsRequest = {
									  compartmentId: compartmentId
									};

		  const listVaultsResponse = await keyClient.listVaults(listVaultsRequest);
		  const vault = listVaultsResponse.items.find(v => v.displayName === vaultName);
		  // console.log("Vaults:", listVaultsResponse);
		  // console.log("Vault OCID:", listVaultsResponse.items[listVaultsResponse.items.findIndex(vault => vault.displayName === 'IBA Vault')].id);
		  // console.log("Vault OCID:", listVaultsResponse.items.find(v => v.displayName === vaultName).id);
		  if (vault){
			  console.log(`Vault Name: ${vault.displayName}`);
			  console.log(`Vault OCID: ${vault.id}`);
			  return vault.id;
		  } else{
			  console.log(`Vault with name "${vaultName}" not found.`);
			  return null;
		  }        
	  } catch (error) {
		  console.error("Error listing vaults:", error);
	  }
	}

	async function getSecretOCID(secretName, vaultId) {
	  try {
		  const secretsClient = new secrets.SecretsClient({ authenticationDetailsProvider: provider });

		  const getSecretRequest = {
			  vaultId: vaultId,
			  secretName: secretName
		  };

		  const getSecretResponse = await secretsClient.getSecretBundleByName(getSecretRequest);

		  // console.log("Secret:", getSecretResponse);
		  // console.log(`Secret Name: ${secretName}`);
		  if (getSecretResponse){
			  console.log(`Secret "${secretName}" OCID "${getSecretResponse.secretBundle.secretId}"`);
			  secretsClient.close();
			  return getSecretResponse.secretBundle.secretId;
		  }else{
			  console.log(`Secret with name "${secretName}" not found`);
			  secretsClient.close();
			  return null;
		  }
	  } catch (error) {
		  console.error("Error retrieving secret:", error);
		  secretsClient.close();
	  }
	}

	async function getCompartmentOCID(compartmentName) {
	  try {
		  const identityClient = new identity.IdentityClient({authenticationDetailsProvider: provider});

		  // Set the tenancy OCID (root compartment)
		  const tenancyId = provider.getTenantId();

		  // List compartments under the tenancy
		  const listCompartmentsRequest = {
			  compartmentId: tenancyId,
			  accessLevel: "ANY",
			  compartmentIdInSubtree: true
		  };

		  const compartments = await identityClient.listCompartments(listCompartmentsRequest);

		  // Filter the compartment by name
		  const compartment = compartments.items.find(comp => comp.name === compartmentName);

		  if (compartment) {
			  console.log(`Compartment Name: ${compartment.name}`);
			  console.log(`Compartment OCID: ${compartment.id}`);
			  return compartment.id;
		  } else {
			  console.log(`Compartment with name "${compartmentName}" not found.`);
			  return null;
		  }
	  } catch (error) {
		  console.error("Error fetching compartment OCID:", error);
		  throw error;
	  }
	}

	async function getSecret(secretName) {
	  try {
		  const secretId = await getSecretOCID(secretName, await getVaultOCID(ociVaultName, await getCompartmentOCID(ociCompartmentName)));
		  const secretsClient = new secrets.SecretsClient({ authenticationDetailsProvider: provider });
		  const getSecretRequest = {
			  secretId: secretId
		  };
		  const getSecretResponse = await secretsClient.getSecretBundle(getSecretRequest);
		  const secretValue = Buffer.from(getSecretResponse.secretBundle.secretBundleContent.content, 'base64').toString('ascii');
		  // console.log("Secret:", getSecretResponse);
		  console.log(`Secret "${secretName}" value is "${secretValue}"`);
		  secretsClient.close();
		  return secretValue;
	  } catch (error) {
		  console.error("Error retrieving secret value:", error);
		  secretsClient.close();
	  }
	}
	
	try {
		//jiraClientId      = await getSecret('jira-ClientId');
		//jiraClientSecret  = await getSecret('jira-ClientSecret');
		//return {"ociCompartmentName": getCompartmentOCID(ociCompartmentName)};
		return {"ociCompartmentName": "duno"};
	} catch (error) {
		console.error('Error fetching data:', error);
		return error;
	}
})
