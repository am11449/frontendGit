document.getElementById("displaytext").style.display = "none";

function searchPhoto()
{

  var apigClient = apigClientFactory.newClient();

    var user_message = document.getElementById('note-textarea').value;

    var body = { };
    var params = {q : user_message};
    var additionalParams = {};

    apigClient.searchGet(params, body , additionalParams).then(function(res){
        console.log(res)
        var data = {}
        var data_array = []
        resp_data  = res.data.results
        length_of_response = resp_data.length;
        if(length_of_response == 0)
        {
          document.getElementById("displaytext").innerHTML = "No Images Found !!!"
          document.getElementById("displaytext").style.display = "block";

        }

        resp_data.forEach( function(obj) {

            var img = new Image();
            img.src = obj;
            img.setAttribute("class", "banner-img");
            img.setAttribute("alt", "effy");
            document.getElementById("displaytext").innerHTML = "Images returned are : "
            document.getElementById("img-container").appendChild(img);
            document.getElementById("displaytext").style.display = "block";

          });
      }).catch( function(result){

      });



}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // reader.onload = () => resolve(reader.result)
    reader.onload = () => {
      let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
      if ((encoded.length % 4) > 0) {
        encoded += '='.repeat(4 - (encoded.length % 4));
      }
      resolve(encoded);
    };
    reader.onerror = error => reject(error);
  });
}

function getBinary(file){
    return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = error => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

function uploadPhoto()
{
   // var file_data = $("#file_path").prop("files")[0];
   var file = document.getElementById('file_path').files[0];
   console.log(file);
  //  const reader = new FileReader();

   // var file = document.querySelector('#file_path > input[type="file"]').files[0];
   var encoded_image = getBinary(file).then(
     data => {
     console.log(data)
     var apigClient = apigClientFactory.newClient();

     // var data = document.getElementById('file_path').value;
     // var x = data.split("\\")
     // var filename = x[x.length-1]
    //  var file_type = file.type + ";base64"

     var body = data;
     var params = {"key" : file.name, "bucket" : "ycui4897-photostore", "Content-Type":file.type, "Accept": file.type};
     var additionalParams = {}
     apigClient.uploadBucketKeyPut(params, body , additionalParams).then(function(res){
       console.log(res)
       if (res.status == 200)
       {
         document.getElementById("uploadText").innerHTML = "Image Uploaded  !!!"
         document.getElementById("uploadText").style.display = "block";
       }
     })
   });
}

function uploadPhoto1(){

  var file = document.getElementById('file_path').files[0];
  console.log(document.getElementById('file_path').value)
  file_path = document.getElementById('file_path').value
  const fs = require('fs');
  const AWS = require('aws-sdk');
  AWS.config.update({ region: 'us-west-1' });

  // Fill in your bucket name and local file name:
  const BUCKET_NAME = 'ycui4897-photostore'
  const FILE_NAME_LOCAL = file_path
  const FILE_NAME_S3 = 'pic5.jpeg'
  // const FILE_PERMISSION = 'public-read'

  // Create S3 service object
  s3 = new AWS.S3({ apiVersion: '2006-03-01' });

  // Get file stream
  const fileStream = fs.createReadStream(FILE_NAME_LOCAL);

  // Upload the file to a specified bucket
  const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: FILE_NAME_S3,
      Body: fileStream,
  };

  s3.upload(uploadParams, function (err, data) {
      if (err) {
          console.log("Error", err);
      } if (data) {
          console.log("Upload Success", data.Location);
      }
});
}

const realFileBtn = document.getElementById("realfile");

function uploadImage() {
  realFileBtn.click(); 
}

function previewFile(input) {
  var reader = new FileReader();
  name1 = document.getElementById('file_path').files[0].name;
  console.log(name1)
  fileExt = name1.split(".").pop();
  
  console.log(fileExt)
  console.log("THIS IS THE EXTENSION!!")

  var onlyname = name1.replace(/\.[^/.]+$/, "");
  var finalName = onlyname+"."+fileExt;
  name1 = finalName;

  reader.onload = function (e) {
    var src = e.target.result;    
    var newImage = document.createElement("img");
    newImage.src = src;
    encoded = newImage.outerHTML;

    last_index_quote = encoded.lastIndexOf('"');
    if (fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'png') {
      encodedStr = encoded.substring(33, last_index_quote);
    }
    else {
      encodedStr = encoded.substring(32, last_index_quote);
    }
    var apigClient = apigClientFactory.newClient({ apiKey: "3TX4JSS1syaieUQvBLq0gqWfJfEHiTH7woeUrkt8" });

    var params = {
        "key": name1,
        "bucket": "pipebucketcloud",
        "Content-Type": "image/jpg",
    };

    var additionalParams = {
      headers: {
        "Content-Type": "image/jpg",
      }
    };

    apigClient.uploadBucketKeyPut(params, encodedStr, additionalParams)
      .then(function (result) {
        console.log(result);
        console.log('success OK');
        alert("Photo Uploaded Successfully");
      }).catch(function (result) {
        console.log(result);
      });
    }
   reader.readAsDataURL(input.files[0]);
}