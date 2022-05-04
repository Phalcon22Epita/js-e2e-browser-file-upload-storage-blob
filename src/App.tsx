// ./src/App.tsx

import React, { useState } from 'react';
import Path from 'path';
/*import uploadFileToBlob, { isStorageConfigured } from './azure-storage-blob';*/
import uploadFileToAzureFunction, { isStorageConfigured } from './azure-storage-blob';

const storageConfigured = isStorageConfigured();

const App = (): JSX.Element => {
  // all blobs in container
  const [blobList, ] = useState<string[]>([]);
  const [probas, setProbas] = useState('');

  // current file to upload into container
  const [fileSelected, setFileSelected] = useState(null);

  // UI/form management
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(Math.random().toString(36));

  const onFileChange = (event: any) => {
    // capture file into state
    setFileSelected(event.target.files[0]);
  };

  const onFileUpload = async () => {
    // prepare UI
    setUploading(true);

    // *** UPLOAD TO AZURE STORAGE ***
    /*const blobsInContainer: string[] = await uploadFileToBlob(fileSelected);

    // prepare UI for results
    setBlobList(blobsInContainer);*/
	
	// *** SEND IMG TO AZURE FUNCTION ***
	const response : string = await uploadFileToAzureFunction(fileSelected);
	setProbas(response);
    // reset state/form
    setFileSelected(null);
    setUploading(false);
    setInputKey(Math.random().toString(36));
  };

  // display form
  const DisplayForm = () => (
    <div>
      <input type="file" onChange={onFileChange} key={inputKey || ''} />
      <button type="submit" onClick={onFileUpload}>
        Upload!
          </button>
    </div>
  );

  // display file name and image
  const DisplayImagesFromContainer = () => (
    <div>
      <h2>Container items</h2>
      <ul>
        {blobList.map((item) => {
          return (
            <li key={item}>
              <div>
                {Path.basename(item)}
                <br />
                <img src={item} alt={item} height="200" />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
  
  const extractProba = () : string => {
	  var test = "";
	  const probList = JSON.parse(probas);
	  probList.forEach((elt : any) => test += elt["tagName"] + ': ' + (Math.round(elt["probability"] * 100)) + '%\n');
	  return test;
  };
  
  const DisplayProbas = () => (
	<div>
	  <span>
	  {extractProba()}
	  </span>
	</div>
  );

  return (
    <div>
      <h1>Upload file to Azure Blob Storage</h1>
      {storageConfigured && !uploading && DisplayForm()}
      {storageConfigured && uploading && <div>Uploading</div>}
      <hr />
      {storageConfigured && blobList.length > 0 && DisplayImagesFromContainer()}
      {!storageConfigured && <div>Storage is not configured.</div>}
	  {probas !== '' && DisplayProbas()}
		  
    </div>
  );
};

export default App;


