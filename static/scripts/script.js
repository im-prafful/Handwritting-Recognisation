var slideImg = document.getElementById('slideImg');

var images = new Array (
    "/static/images/slider2.jpeg",
    "/static/images/slider3.jpeg",
    "/static/images/slider4.jpeg",
    "/static/images/slider5.jpeg",
    "/static/images/slider6.jpeg",
);

var len = images.length;
var i = 0;

function slider () {
    if (i > len - 1){
        i = 0;
    }
    slideImg.src = images[i];
    i++;
    setTimeout('slider()', 2950);
}

const myTags = [
    'A', 'n', 'K',
    'i', 'L', 'a',
    'S', 'B', 'c',
    'P', 'x', 'f',
    'z', 'Y', 'u',
    'Q', 'k', 'g',
    't', 'V', 'H',
    'R', 'M', 'j',
    'E', 'w', 'Y',
    't', 'b', 'h',
];

var tagCloud = TagCloud('.tagcloudTexts', myTags, {
    radius: 180,
    maxSpeed: 'normal',
    initSpeed: 'fast',
    direction: 145,
    keep: true

});

document.addEventListener("mousemove", parallax);
function parallax(e) {
    document.querySelectorAll(".symbols").forEach(function (move) {
        var movingvalue = move.getAttribute("data-value");
        var x = (e.clientX * movingvalue) / 50;
        var y = (e.clientY * movingvalue) / 50;

        move.style.transform = "translateX(" + x + "px) translateY(" + y + "px)";
    });
}

const form = document.querySelector("form");
const fileInput = document.querySelector(".file-input");
const progressArea = document.querySelector(".progress-area");
const uploadedArea = document.querySelector(".uploaded-area");

form.addEventListener("click", () => {
  fileInput.click();
});

fileInput.onchange = ({ target }) => {
  const file = target.files[0];
  if (file) {
    let fileName = file.name;
    if (fileName.length >= 12) {
      const splitName = fileName.split(".");
      fileName = `${splitName[0].substring(0, 13)}... .${splitName[1]}`;
    }
    uploadFile(fileName, file);
  }
};

function uploadFile(name, file) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/process_image");

  xhr.upload.addEventListener("progress", (event) => {
    const loaded = event.loaded;
    const total = event.total;
    const fileLoaded = Math.floor((loaded / total) * 100);
    let fileTotal = Math.floor(total / 1000);
    let fileSize;
    if (fileTotal < 1024) {
      fileSize = `${fileTotal} KB`;
    } else {
      fileSize = `${(loaded / (1024 * 1024)).toFixed(2)} MB`;
    }

    const progressHTML = `<li class="row">
      <i class="fas fa-file-alt"></i>
      <div class="content">
        <div class="details">
          <span class="name">${name} • Uploading</span>
          <span class="percent">${fileLoaded}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress" style="width: ${fileLoaded}%"></div>
        </div>
      </div>
    </li>`;

    uploadedArea.classList.add("onprogress");
    progressArea.innerHTML = progressHTML;

    if (loaded === total) {
      progressArea.innerHTML = "";
      const uploadedHTML = `<li class="row">
        <div class="content upload">
          <i class="fas fa-file-alt"></i>
          <div class="details">
            <span class="name">${name} • Uploaded</span>
            <span class="size">${fileSize}</span>
          </div>
        </div>
        <i class="fas fa-check"></i>
      </li>`;

      uploadedArea.classList.remove("onprogress");
      uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
    }
  });

  const data = new FormData();
  data.append("file", file);
  xhr.send(data);
}

$(document).ready(function() {
  $('form').submit(function(event) {
    event.preventDefault();

    var formData = new FormData($(this)[0]);

    $.ajax({
      url: '/process_image',
      type: 'POST',
      data: formData,
      async: false,
      cache: false,
      contentType: false,
      processData: false,
      success: function(response) {
        console.log(response);
        $('#result').text(response.text);

        if (response.checkboxes_exist) {
          $('#checkboxInfo').text('Checkboxes exist');
          if (response.filled_checkboxes.length > 0) {
            var filledCheckboxes = response.filled_checkboxes.join(', ');
            $('#filledCheckboxes').text('Filled Checkboxes: ' + filledCheckboxes);
          } else {
            $('#filledCheckboxes').text('No filled checkboxes found');
          }
        } else {
          $('#checkboxInfo').text('No checkboxes found');
          $('#filledCheckboxes').text('');
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
    });
    return false;
  });
});

$(document).ready(function() {
  $('.file-input').change(function(event) {
      var form_data = new FormData($('form')[0]);
      $.ajax({
          type: 'POST',
          url: '/process_image',
          data: form_data,
          contentType: false,
          cache: false,
          processData: false,
          success: function(response) {
              $('#result').html(
                  `<p>Text: ${response.text}</p>` +
                  `<p>Checkboxes exist: ${response.checkboxes_exist}</p>` +
                  `<p>Filled checkboxes: ${response.filled_checkboxes.join(', ')}</p>`
              );
          }
      });
  });
});

