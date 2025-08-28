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
	const provider 			  = new common.ResourcePrincipalAuthenticationDetailsProvider(); // using resource principal provider of OCI
	const identityClient 	  = new identity.IdentityClient({authenticationDetailsProvider: provider});
	const ociVaultName        = "IBA Vault";
	const ociCompartmentName  = "NONPROD-Oracle-Integration-CMP";	

	try {
		return {provider.getTenantId()};
	} catch (error) {
		console.error('Error fetching data:', error);
		return error;
	}
})
