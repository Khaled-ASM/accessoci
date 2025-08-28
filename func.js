const fdk			= require('@fnproject/fdk');
const common        = require("oci-common");
const secrets       = require("oci-secrets");
const vaults        = require("oci-vault");
const identity      = require("oci-identity");
const keymanagement = require("oci-keymanagement");

fdk.handle(async function(input, ctx){
	//try {
		let jiraClientId	= 0;
		let jiraClientSecret= 0;
		const provider 			  = new common.ResourcePrincipalAuthenticationDetailsProvider(); // using resource principal provider of OCI
	//	const identityClient 	  = new identity.IdentityClient({authenticationDetailsProvider: provider});
		const ociVaultName        = "IBA Vault";
		const ociCompartmentName  = "NONPROD-Oracle-Integration-CMP";	

		return {"tenantId": "new"};
	//} catch (error) {
	//	console.error('Error fetching data:', error);
	//	return error;
	//}
})
