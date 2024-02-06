
import { google } from 'googleapis';
import { credentials } from '../auth-google/keys.js';
import stream from 'stream';
import fetch from 'node-fetch';
import { server } from '../index.js';

const apiGraphFacebook = 'https://graph.facebook.com/v18.0';
const apiVideoFacebook = 'https://graph-video.facebook.com/v18.0';
const PAGE_ID = '241875695668890'; //NIUB951
const CLIENT_ID = '246817391757242';
const KEY_SECRET = '3197b3823ee1442f09bf6aed5e165819';

const getFBAccessTokenLarge = async (token) => {
   try {
        const url = `${apiGraphFacebook}/${PAGE_ID}?fields=access_token&access_token=${token}`
        const res = await fetch(url, {method: 'GET', headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}});
        const data = await res.json();
        console.log('data getTokenPage: ', data)

        //get token large page
        const urlTokenLarge = `${apiGraphFacebook}/oauth/access_token?grant_type=fb_exchange_token&client_id=${CLIENT_ID}&client_secret=${KEY_SECRET}&fb_exchange_token=${data?.access_token}`;
        const resTokenLarge = await fetch(urlTokenLarge, {method: 'GET', headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}});
        const dataTokenLarge = await resTokenLarge.json();
        console.log('dataTokenLarge: ', dataTokenLarge)
        return dataTokenLarge?.access_token;
   } catch(error) {
        throw new Error('error getFBAccessTokenLarge');
   }
}

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
    const access_token_facebook = server.app.get('facebookAccessToken');

    const headersImage = {
        'Content-Type': 'image/*',
        'Content-length': '0',
        'Connection': 'keep-alive',
        'Host': 'graph.facebook.com',
        'Accept': '*/*',
        'Access-Control-Allow-Origin': '*',
    }
    const headersVideo = {
        'Content-Type': 'video/*',
        'Connection': 'keep-alive',
        'Accept': '*/*',
        'Host': 'graph-video.facebook.com',
        'Access-Control-Allow-Origin': '*',
    }
    let arrayMedia = [];

    try {
        for (const file of files) {
            if(file.type === 'video') {
                const url = `${apiVideoFacebook}/${PAGE_ID}/videos?access_token=${access_token_facebook}&file_url=${file.url}&description=${uniqueKey}`;
                   
                // try {
                    const response = await fetch(url, {method: 'POST', headers: headersVideo});
                    const data = await response.json();

                    if(data.error) { //se queda guardado url de google drive
                        arrayMedia.push({
                            url: file.url,
                            type: file.type,
                            name: file.name,
                            status: 'stored',
                            driveId: file.id,
                            facebookId: null
                        });
                    } else {
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
                    }
    
                // } catch (error) {
                //     console.log('error save - get video: ----------- ', error);
                //     throw new Error('error save - get video');
                // }
                  
            }
                
              
            if(file.type === 'image') {
                const url = `${apiGraphFacebook}/${PAGE_ID}/photos?access_token=${access_token_facebook}&url=${file.url}&message=${uniqueKey}`;
                    
                // try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: headersImage
                    });
                    const data = await response.json();
                    console.log('buscando id de image: ----------- ', data);

                    if(data?.error?.code === 190) {
                        throw new Error('UnauthorizedError');
                    } else {

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
                    }
    
                // } catch (error) {
                //     console.log('error save image: ----------- ', error);
                //     throw new Error('error save image');
                // }
                    
            }
        }
    } catch (error) {
        for (const file of files){
           await deleteFileInGoogleDrive(file.id)
        }
        console.log('error processFilesFacebook: ----------- ', error);
        if(error.message === 'UnauthorizedError') {
            throw new Error('UnauthorizedError');
        } else {
            throw new Error('error processFilesFacebook');
        }
    }

        console.log('----arrayMedia: ----------- ', arrayMedia);
        return arrayMedia;

}

const getSourceMediaFacebook = async (id) => {
    
    const access_token_facebook = server.app.get('facebookAccessToken');

    return new Promise(async (resolve, reject) => {
        try {
            const url = `${apiGraphFacebook}/${id}?access_token=${access_token_facebook}&fields=source`;
            const resImage = await fetch(url, {method: 'GET', headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}});
            const dataImage = await resImage.json();
            console.log('dataImage: ----------- ', dataImage);
            if(dataImage.error) {
                // resolve(null);
                if(dataImage.error.code === 190) {
                    throw new Error('UnauthorizedError');
                }
            }
            resolve(dataImage);
        } catch (error) {
            console.log('error getSourceMediaFacebook: ----------- ', error);
            
            reject(error);
        }
    });
    

}

const deleteFileInGoogleDrive = async (fileId) => {
    try {
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
    } catch (error) {
        console.log('error deleteFileInGoogleDrive: ----------- ', error);
    }
}

// const wait = (tiempo) => {
//     console.log('entre a wait ....................' + tiempo)
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve();
//         }, tiempo);
//     });
// }

export {
    proccesingFiles,
    getSourceMediaFacebook,
    deleteFileInGoogleDrive,
    getFBAccessTokenLarge
}