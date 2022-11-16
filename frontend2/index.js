var name = '';
var encoded = null;
var fileExt = null;
var SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const synth = window.speechSynthesis;
const recognition = new SpeechRecognition();
const icon = document.querySelector('i.fa.fa-microphone');


///// SEARCH TRIGGER //////
function searchFromVoice() {
  recognition.start();
  recognition.onresult = (event) => {
    const speechToText = event.results[0][0].transcript;
    console.log(speechToText);
    document.getElementById("searchbar").value = speechToText;
    search();
  }
}

function search() {
  var searchTerm = document.getElementById("searchbar").value;
  var apigClient = apigClientFactory.newClient({ });


    var body = { };
    var params = {q : searchTerm};
    var additionalParams = {};

    apigClient.searchGet(params, body , additionalParams).then(function(res){
        console.log("success");
        console.log(res);
        showImages(res.data)
      }).catch(function(result){
          console.log(result);
          console.log("NO RESULT");
      });

}


/////// SHOW IMAGES BY SEARCH //////

function showImages(res) {
  console.log("INSIDE SHOW IMAGES");
  var newDiv = document.getElementById("images");
  if(typeof(newDiv) != 'undefined' && newDiv != null){
  while (newDiv.firstChild) {
    newDiv.removeChild(newDiv.firstChild);
  }
  }
  
  console.log(res);
  if (res.length == 0) {
    var newContent = document.createTextNode("No image to display");
    newDiv.appendChild(newContent);
  }
  else {
    // console.log('LENGTH NOT 0 AHHHHHHHHH ', res.results.length)
    var results = res.results;
    for (var i = 0; i < results.length; i++) {
    //   console.log('INSIDE FOR LOOP');
      var newDiv = document.getElementById("images");
      //newDiv.style.display = 'inline'
      var newimg = document.createElement("img");
      var classname = randomChoice(['big', 'vertical', 'horizontal', '']);
      if(classname){newimg.classList.add();}
      
    //   filename = results[i].substring(results[i].lastIndexOf('/')+1)
      newimg.src = results[i];
      newDiv.appendChild(newimg);
    }
  }
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}



///// UPLOAD IMAGES ///////

const realFileBtn = document.getElementById("realfile");

function uploadImage() {
  realFileBtn.click(); 
}

function previewFile(input) {
  var reader = new FileReader();
  var apigClient = apigClientFactory.newClient({ });
  name1 = input.files[0].name;
  fileExt = name1.split(".").pop();
  
  console.log(fileExt)
  console.log("THIS IS THE EXTENSION!!")

  var onlyname = name1.replace(/\.[^/.]+$/, "");
  var finalName = onlyname+"."+fileExt;
  name1 = finalName;

  console.log('NAME: ', name1);

  var params = {
    "key": name1,
    "bucket": "ycui4897-photostore",
    "Content-Type": "image/" + fileExt,
    "Accept":"*/*"
  };

  var additionalParams = {};

  reader.onload = function (e) {
    src = e.target.result;    

    let encoded = e.target.result.replace(/^data:(.*;base64,)?/, '');
    // encoded = encoded.trim()
    // encoded = '"' + encoded + '"' 
    console.log(encoded)
    // body = btoa(e.target.result)
    // console.log(body)
    // var newImage = document.createElement("img");
    // newImage.src = src;
    // encoded = newImage.outerHTML;

    // last_index_quote = encoded.lastIndexOf('"');
    // if (fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'png') {
    //   encodedStr = encoded.substring(33, last_index_quote);
    // }
    // else {
    //   encodedStr = encoded.substring(32, last_index_quote);
    // }
    // var apigClient = apigClientFactory.newClient({ });

    // console.log("image/" + fileExt);

    return apigClient.uploadBucketKeyPut(params, encoded, additionalParams)
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