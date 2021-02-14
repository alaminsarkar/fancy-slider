const imagesArea = document.querySelector(".images");
const gallery = document.querySelector(".gallery");
const galleryHeader = document.querySelector(".gallery-header");
const searchBtn = document.getElementById("search-btn");
const sliderBtn = document.getElementById("create-slider");
const sliderContainer = document.getElementById("sliders");
// selected image
let sliders = [];

//  Api key
const KEY = "15674931-a9d714b6e9d654524df198e00&q";

// show images
const showImages = (images) => {
  imagesArea.style.display = "block";
  gallery.innerHTML = "";
  // show gallery title
  galleryHeader.style.display = "flex";
  console.log(images);
  images.forEach((image) => {
    let div = document.createElement("div");
    div.className = "col-lg-3 col-md-4 col-xs-6 img-item mb-2";
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div);
  });
  toggleSpinner();
};

const getImages = (query) => {
  toggleSpinner();

  fetch(
    `https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`
  )
    .then((response) => response.json())
    .then((data) => showImages(data.hits))
    .catch((err) => displayError());
};

let slideIndex = 0;
let count = 0;
const selectItem = (event, img) => {
  let element = event.target;

  let item = sliders.indexOf(img);
  if (item === -1) {
    element.classList.add("added");
    sliders.push(img);
    count++;
  } else {
    element.classList.remove("added");
    sliders.splice(item, 1);
    count--;
  }
  document.getElementById("image-count").innerText = count;
  displayCounter();
};

var timer;
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert("Select at least 2 image.");
    return;
  }
  // create slider previous next area
  sliderContainer.innerHTML = "";
  const prevNext = document.createElement("div");
  prevNext.className =
    "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext);
  document.querySelector(".main").style.display = "block";
  // hide image area
  imagesArea.style.display = "none";
  const duration = document.getElementById("duration").value;
  sliders.forEach((slide) => {
    let item = document.createElement("div");
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item);
  });
  changeSlide(0);
  if (duration > 1000) {
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, duration);
  } else if (duration == "") {
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, 1000);
  } else {
    alert("Negative duration is not acceptable");
    document.querySelector(".main").style.display = "none";
  }
};

// change slider index
const changeItem = (index) => {
  changeSlide((slideIndex += index));
};

// change slider item
const changeSlide = (index) => {
  const items = document.querySelectorAll(".slider-item");
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  }

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach((item) => {
    item.style.display = "none";
  });

  items[index].style.display = "block";
};

searchBtn.addEventListener("click", function () {
  document.querySelector(".main").style.display = "none";
  clearInterval(timer);
  const search = document.getElementById("search");
  getImages(search.value);
  sliders.length = 0;
  count = 0;
  document.getElementById("image-count").innerText = count;
});

sliderBtn.addEventListener("click", function () {
  createSlider();
});

// Get the input field
var input = document.getElementById("search");

input.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    document.getElementById("search-btn").click();
  }
});

// Loading Spinner

const toggleSpinner = () => {
  document.getElementById("loading-spinner").classList.toggle("d-none");
};

// Loading counter
const displayCounter = () => {
  document.getElementById("display-count").classList.remove("d-none");
};

// Error Message
const displayError = () => {
  const errorTag = document.getElementById("error-msg");
  errorTag.innerText = "Something went wrong!";
};
