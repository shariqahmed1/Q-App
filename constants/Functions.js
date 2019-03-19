import firebase from './Firebase';

const  validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

const capitalize = (s) =>{
    return s[0].toUpperCase() + s.slice(1);
}

const sliceString = (val) =>{
  let arr = [];
  for (var i = 0; i < val.length; i++) {
      arr.push(val.charAt(i));
  }
  return arr;
}

const searchQuery = (arrLength,arr) => {
  let query =  arrLength > 0 ? arrLength > 1 ? arrLength > 2 ? `${arr[0]}${arr[1]}${arr[2]}` : `${arr[0]}${arr[1]}` : `${arr[0]}` : "";
  return query;
}

const checkAppointmentTimeIsStartOrNot = (t) => {
    var time = `${new Date().getHours()}:${new Date().getMinutes()}`;
    var startTime = t;
    var currentTime = time.toString();
    var regExp = /(\d{1,2})\:(\d{1,2})\:(\d{1,2})/;
    if(parseInt(currentTime .replace(regExp, "$1$2$3")) > parseInt(startTime 		.replace(regExp, "$1$2$3"))){
        return true;
    }
  return false;
}

const FIREBASE_DATABASE = firebase.database();
const FIREBASE_STORAGE = firebase.storage();
const FIREBASE_AUTH = firebase.auth();
const FIREBASE = firebase;

const uploadImage = async (uri, databaseRefrenceName) => {
    let randomnmbr = Math.floor(Math.random() * 900000000000000) + 100000000000000;
    const imgName = `${randomnmbr}.jpg`;
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function () {
            reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });
    const ref = FIREBASE_STORAGE.ref(databaseRefrenceName).child(imgName);
    const snapshot = await ref.put(blob);
    const remoteUri = await snapshot.ref.getDownloadURL();
    blob.close();
    return {imagePath : remoteUri, imageName : imgName};
}

const newImageUpload = async (uri) => {
    let response = undefined;
    await uploadImage(uri, "images")
    .then((res) => {
        response = res;
    })
    .catch(err => {
        console.log(err.message);
    })
    return response;
}

const updatedImageUpload = async (uri, imageUpdate, imageName) => {
    let response = undefined;
    if (imageUpdate) {
        if (imageName !== "") {
            FIREBASE_STORAGE.ref("images").child(imageName).delete()
        }
        await uploadImage(uri, "images")
            .then((res) => {
                response = res;
            })
            .catch(err => {
                console.log(err.message);
            })
    }
    else {
        response = { imageName: imageName, imagePath: uri };
    }
    return response;
}

export {
    newImageUpload,
    validateEmail,
    uploadImage,
    updatedImageUpload,
    capitalize,
    sliceString,
    searchQuery,
    checkAppointmentTimeIsStartOrNot,
    FIREBASE_DATABASE,
    FIREBASE_STORAGE,
    FIREBASE_AUTH,
    FIREBASE
}; 