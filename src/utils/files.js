
import { google } from 'googleapis';
import { credentials } from '../auth-google/keys.js';
import stream from 'stream';
import fetch from 'node-fetch';

const access_token_facebook = 'EAADgeqb1x7oBO7MfP0ZAv2pMrt26ZCotbB7DUVvuyhWhzq2sUCdLCi1rHY8hID38g7NTB3NeQe7RGAFv7rMqNYqzRaUZBKPcz4eigPpzqHF2ZCtiRTFtJUwY9oMUYL25z298n6ckO2BG2BUH8PMoFL87MeUQ7ZAKEQqKNlvFjQjxCZCKoVBcRqnnKlrsPQ6DmObXnZBZAIMZD';
const apiGraphFacebook = 'https://graph.facebook.com/v18.0';
const apiVideoFacebook = 'https://graph-video.facebook.com/v18.0';
const page_id = '208361202351294';

const proccesingFiles = async (files, uniqueKey) => {
    const auth = new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key,
        ['https://www.googleapis.com/auth/drive']
      );
      const drive = google.drive({ version: 'v3', auth });
    
    const filesArrayInGoogleDrive = [];
    for (const file of files) {
        const mimetype = file.mimetype;
        const bufferStream = new stream.PassThrough();
        bufferStream.end(file.buffer);
        const driveResponse = await drive.files.create({
            requestBody: {
            name: file.originalname,
            parents: ["1B2LqBytLfVKmcw-LHjdR_9Q5A9rzH7kE"]
          },
          media: {
            mimeType: mimetype,
            body: bufferStream
          },
            fields: 'id, webViewLink, webContentLink'
        }).catch((err) => {
            console.log('err in save:', err);
        });
    
        filesArrayInGoogleDrive.push({
            id: driveResponse.data.id,
            name: file.originalname,
            url: 'https://drive.google.com/uc?id=' + driveResponse.data.id,
            type: mimetype.includes('video') ? 'video' : 'image'
        });
    }

    return await processFilesFacebook(filesArrayInGoogleDrive, uniqueKey);
 
}

const processFilesFacebook = async (files, uniqueKey) => {

    console.log('Entre a processFilesFacebook ....................')
    console.log('files:------------', files)
    
    const headersImage = {
        'Content-Type': 'image/*',
        'Content-length': '0',
        'Connection': 'keep-alive',
        'Host': 'graph.facebook.com',
        'Accept': '*/*',
        'Access-Control-Allow-Origin': '*',
    }
    const headersVideo = {
        'Content-Type': 'multipart/form-data',
        'Connection': 'keep-alive',
        'Accept': '*/*',
        'Host': 'graph-video.facebook.com',
        'Access-Control-Allow-Origin': '*',
    }
    let arrayMedia = [];

    for (const file of files) {
        if(file.type === 'video') {
            const url = `${apiVideoFacebook}/${page_id}/videos?access_token=${access_token_facebook}&file_url=${file.url}&description=${uniqueKey}`;
               
            try {
                const response = await fetch(url, {method: 'GET', headers: headersVideo});
                const data = await response.json();
                console.log('data publish video franz: ----------- ', data);
                await wait(8000);
                const dataVideo = await getSourceMediaFacebook(data.id)
                console.log('dataVideo: ----------- ', dataVideo);
                arrayMedia.push({
                    url: dataVideo?.source ? dataVideo.source : file.url,
                    type: file.type,
                    name: file.name,
                    status: 'stored',
                    driveId: file.id,
                    facebookId: data.id
                });

                if(dataVideo.source) {
                    //delete file in google drive
                    deleteFileInGoogleDrive(file.id);
                }

                console.log('response save video: ----------- ', data);
            } catch (error) {
                console.log('error save - get video: ----------- ', error);
            }
              
        }
            
          
        if(file.type === 'image') {
            const url = `${apiGraphFacebook}/${page_id}/photos?access_token=${access_token_facebook}&url=${file.url}&message=${uniqueKey}`;
                
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: headersImage
                });
                const data = await response.json();
                console.log('buscando id de image: ----------- ', data);
                const dataImage = await getSourceMediaFacebook(data.id);
                arrayMedia.push({
                    url: dataImage?.source ? dataImage.source : file.url,
                    type: file.type,
                    name: file.name,
                    status: 'stored',
                    driveId: file.id,
                    facebookId: data.id
                });
                if(dataImage.source) {
                    //delete file in google drive
                    deleteFileInGoogleDrive(file.id);
                }

                console.log('response save image: ----------- ', data);
            } catch (error) {
                console.log('error save image: ----------- ', error);
            }
                
        }
    }
  
        console.log('----arrayMedia: ----------- ', arrayMedia);
        return arrayMedia;

}

const getSourceMediaFacebook = async (id) => {

    return new Promise(async (resolve, reject) => {
        try {
            const url = `${apiGraphFacebook}/${id}?access_token=${access_token_facebook}&fields=source`;
            const resImage = await fetch(url, {method: 'GET', headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}});
            const dataImage = await resImage.json();
            resolve(dataImage);
        } catch (error) {
            console.log('error getSourceMediaFacebook: ----------- ', error);
            resolve(null);
        }
    });
    

}

const deleteFileInGoogleDrive = async (fileId) => {
    const auth = new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key,
        ['https://www.googleapis.com/auth/drive']
      );
      const drive = google.drive({ version: 'v3', auth });
      await drive.files.delete({
        fileId: fileId,
      });
}

const wait = (tiempo) => {
    console.log('entre a wait ....................' + tiempo)
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, tiempo);
    });
}

export {
    proccesingFiles,
    getSourceMediaFacebook,
    deleteFileInGoogleDrive
}