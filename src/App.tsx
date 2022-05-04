// ./src/App.tsx

import React, { useState } from 'react';
/*import Path from 'path';*/
/*import uploadFileToBlob, { isStorageConfigured } from './azure-storage-blob';*/
import { uploadFileToAzureFunctionEmotion, uploadFileToAzureFunctionIsHuman, isStorageConfigured } from './azure-storage-blob';

const storageConfigured = isStorageConfigured();

const App = (): JSX.Element => {
  // all blobs in container
  /*const [blobList, ] = useState<string[]>([]);*/
  const [probasH, setProbasH] = useState('');
  const [probasE, setProbasE] = useState('');

  // current file to upload into container
  const [fileSelected, setFileSelected] = useState(null);

  // UI/form management
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(Math.random().toString(36));

  const onFileChange = (event: any) => {
    // capture file into state
    setFileSelected(event.target.files[0]);
  };

  const onFileUploadHumanity = async () => {
    // prepare UI
    setUploading(true);

    // *** UPLOAD TO AZURE STORAGE ***
    /*const blobsInContainer: string[] = await uploadFileToBlob(fileSelected);

    // prepare UI for results
    setBlobList(blobsInContainer);*/
	
	// *** SEND IMG TO AZURE FUNCTION ***
	const response : string = await uploadFileToAzureFunctionIsHuman(fileSelected);
	setProbasH(response);
    // reset state/form
    setUploading(false);
    setInputKey(Math.random().toString(36));
  };
  
  const onFileUploadEmotion = async () => {
    // prepare UI
    setUploading(true);

    // *** UPLOAD TO AZURE STORAGE ***
    /*const blobsInContainer: string[] = await uploadFileToBlob(fileSelected);

    // prepare UI for results
    setBlobList(blobsInContainer);*/
	
	// *** SEND IMG TO AZURE FUNCTION ***
	const response : string = await uploadFileToAzureFunctionEmotion(fileSelected);
	setProbasE(response);
    // reset state/form
    setUploading(false);
    setInputKey(Math.random().toString(36));
  };

  // display form
  const DisplayForm = () => (
    <div>
      <input type="file" onChange={onFileChange} key={inputKey || ''} />
      <button type="submit" onClick={onFileUploadHumanity}>
        Check Humanity!
          </button>
      <button type="submit" onClick={onFileUploadEmotion}>
        Check Emotion!
          </button>
    </div>
  );

  // display file name and image
  /*const DisplayImagesFromContainer = () => (
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
  );*/
  
  const extractProbaH = () : string => {
	  var test = "";
	  const probList = JSON.parse(probasH);
	  probList.Results.WebServiceOutput0.forEach((elt : any) => test += "Humanity: " + (Math.round(elt["Scored Probabilities_Human"] * 100)) + '%\n');
	  return test;
  };
  
  const extractProbaE = () : string => {
	  var test = "";
	  const probList = JSON.parse(probasE);
	  probList.forEach((elt : any) => test += elt["tagName"] + ': ' + (Math.round(elt["probability"] * 100)) + '%\n');
	  return test;
  };
  
  const DisplayProbasH = () => (
	<div>
	  <span>
	  {extractProbaH()}
	  </span>
	</div>
  );
  
  const DisplayProbasE = () => (
	<div>
	  <span>
	  {extractProbaE()}
	  </span>
	</div>
  );

  return (
    <div>
      <h1>Humanity/Emotion Analyzer 3000</h1>
      {storageConfigured && !uploading && DisplayForm()}
      {storageConfigured && uploading && <div>Uploading</div>}
      <hr />
      {/*storageConfigured && blobList.length > 0 && DisplayImagesFromContainer()*/}
      {!storageConfigured && <div>Storage is not configured.</div>}
	  {probasH !== '' && DisplayProbasH()}
	  {probasE !== '' && DisplayProbasE()}
    </div>
  );
};

export default App;


