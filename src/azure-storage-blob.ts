// ./src/azure-storage-blob.ts

// <snippet_package>
// THIS IS SAMPLE CODE ONLY - NOT MEANT FOR PRODUCTION USE
/*import { ContainerClient } from '@azure/storage-blob';*/
/*import { BlobServiceClient } from '@azure/storage-blob';*/

/*const containerName = `tutorial-container`;*/
const sasToken = process.env.REACT_APP_STORAGESASTOKEN;
const storageAccountName = process.env.REACT_APP_STORAGERESOURCENAME; 
// </snippet_package>

// <snippet_isStorageConfigured>
// Feature flag - disable storage feature to app if not configured
export const isStorageConfigured = () => {
  return (!storageAccountName || !sasToken) ? false : true;
}
// </snippet_isStorageConfigured>

// <snippet_getBlobsInContainer>
// return list of blobs in container to display
/*const getBlobsInContainer = async (containerClient: ContainerClient) => {
  const returnedBlobUrls: string[] = [];

  // get list of blobs in container
  // eslint-disable-next-line
  for await (const blob of containerClient.listBlobsFlat()) {
    // if image is public, just construct URL
    returnedBlobUrls.push(
      `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blob.name}`
    );
  }

  return returnedBlobUrls;
}*/
// </snippet_getBlobsInContainer>

// <snippet_createBlobInContainer>
/*const createBlobInContainer = async (containerClient: ContainerClient, file: File) => {
  
  // create blobClient for container
  const blobClient = containerClient.getBlockBlobClient(file.name);

  // set mimetype as determined from browser with file upload control
  const options = { blobHTTPHeaders: { blobContentType: file.type } };

  // upload file
  await blobClient.uploadData(file, options);
}*/
// </snippet_createBlobInContainer>

// <snippet_uploadFileToBlob>
/*const uploadFileToBlob = async (file: File | null): Promise<string[]> => {
  if (!file) return [];

  // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );

  // get Container - full public read access
  const containerClient: ContainerClient = blobService.getContainerClient(containerName);
  await containerClient.createIfNotExists({
    access: 'container',
  });

  // upload file
  await createBlobInContainer(containerClient, file);

  // get list of blobs in container
  return getBlobsInContainer(containerClient);
};*/
// </snippet_uploadFileToBlob>

const uploadFileToAzureFunctionEmotion = async (file: File | null): Promise<string> => {
	if (!file) return '';
	
	 const handleUpload = async (file: File) => {
		const buffer = await file.arrayBuffer();
		let byteArray = new Int8Array(buffer);
		return byteArray;
	}	

	const binaryFile = await handleUpload(file);
	
	const upload = (file: File) : Promise<string> => {
	  return fetch('https://tribes-function.azurewebsites.net/api/HttpTrigger1?code=rETEnxRk4xVJsZI8P5onrAGtc_QJDJowwjKEpPyftuArAzFuyIbFqg==', { // Your POST endpoint
		method: 'POST',
		headers: {
		  // Content-Type may need to be completely **omitted**
		  // or you may need something
		  "Content-Type": "application/octet-stream"
		},
		body: binaryFile // This is your file object
	  }).then(
		response => response.text() // if the response is a JSON object
	  ).then(
		success => success // Handle the success response object
	  ).catch(
		error => "" // Handle the error response object
	  );
	};
	
	return upload(file);
};

const uploadFileToAzureFunctionIsHuman = async (file: File | null): Promise<string> => {
	if (!file) return '';
	
	const toBase64 = (file : File)  => new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});
	
	const b64 = await toBase64(file) as string; 
	
	const upload = (file: File) : Promise<string> => {
	  return fetch('https://tribes-function.azurewebsites.net/api/HttpTrigger2?code=pdE1lXisLEUmsY3BOe6A8MBFPCaFavjA9scEsboPQjhUAzFuOSk6kQ==', { // Your POST endpoint
		method: 'POST',
		headers: {
		  // Content-Type may need to be completely **omitted**
		  // or you may need something
		  "Content-Type": "*"
		},
		body: b64 // This is your file object
	  }).then(
		response => response.text() // if the response is a JSON object
	  ).then(
		success => success // Handle the success response object
	  ).catch(
		error => "" // Handle the error response object
	  );
	};
	
	return upload(file);
};

/*export default uploadFileToBlob;*/
export {uploadFileToAzureFunctionEmotion, uploadFileToAzureFunctionIsHuman};

