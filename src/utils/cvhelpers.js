const objectURL2cvMat = (objectURL, callback) => {
  console.log(objectURL);
  let img = new Image();
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");
  img.src = objectURL;
  img.onload = function () {
    context.drawImage(img, 0, 0);
    let myData = context.getImageData(0, 0, img.width, img.height);
    const cvImg = cv.matFromImageData(myData);
    callback(cvImg);
  };
};

// only for at maximum 2D aarays !!
const jsarray2cvMat = (array) => {
  if (Array.isArray(array[0]))
    return cv.matFromArray(
      array.length,
      array[0].length,
      cv.CV_64FC1,
      array.flat()
    );
  else {
    return cv.matFromArray(array.length, 1, cv.CV_64FC1, array.flat());
  }
};

const image2cvMat = (image) => {
  let tmpCanvas = document.createElement("canvas");
  let tmpCtx = tmpCanvas.getContext("2d");
  tmpCanvas.width = image.width;
  tmpCanvas.height = image.height;
  tmpCtx.drawImage(image, 0, 0, image.width, image.height);
  let myData = tmpCtx.getImageData(0, 0, image.width, image.height);
  return cv.matFromImageData(myData);
};

const blobToBase64 = (imgurl) => {
  return fetch(imgurl)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise((callback) => {
          let reader = new FileReader();
          reader.onload = function () {
            callback(this.result);
          };
          reader.readAsDataURL(blob);
        })
    );
};

const homographyfromepnp = (extrensicMatvec, transVec) => {
  let rMat = new cv.Mat(3, 3, cv.CV_64FC1);
  cv.Rodrigues(extrensicMatvec, rMat);
  let R = new cv.Mat(3, 3, cv.CV_64FC1);
  rMat.col(0).copyTo(R.col(0));
  rMat.col(1).copyTo(R.col(1));
  transVec.col(0).copyTo(R.col(2));
  rMat.delete();
  return R;
};

export {
  objectURL2cvMat,
  blobToBase64,
  homographyfromepnp,
  image2cvMat,
  jsarray2cvMat,
};
