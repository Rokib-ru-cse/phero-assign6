const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const search = document.getElementById('search');
let modalBody = document.getElementById("modal-body")
const spinner = document.querySelector('.spinner')
let searchedImages = undefined
// selected image 
let sliders = [];
let show = false;
let stopImageIndex


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  if (searchedImages != undefined) {
    spinner.style.display = 'none'
  }
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
  })

}

const getImages = (query) => {
  if (searchedImages == undefined) {
    spinner.style.display = 'block'
  }
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => searchedImages = data)
    .then(() => {
      showImages(searchedImages.hits)
    })
    .catch(err => console.log(err))
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;

  let item = sliders.indexOf(img);
  if (item === -1) {
    element.classList.add('added');
    sliders.push(img);
  } else {
    element.classList.remove('added');
    sliders.splice(item, 1)
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  const duration = document.getElementById('duration').value || 1000;
  if (duration > 0) {
    document.querySelector('.main').style.display = 'block';
    // hide image aria
    imagesArea.style.display = 'none';
    sliders.forEach(slide => {
      let item = document.createElement('div')
      item.className = "slider-item";
      item.innerHTML = `<img style="cursor: pointer;" class="w-100"
      src="${slide}"
      alt="">`;
      sliderContainer.appendChild(item)

    })
    changeSlide(0)
    timer = setInterval(function () {
      if(show){
        slideIndex = stopImageIndex
      }else{
        slideIndex++;
      }
      changeSlide(slideIndex);
    }, duration);

    let sliderItem = document.querySelectorAll(".slider-item")
    sliderItem.forEach((item) => {
      item.addEventListener('mouseover', (e) => {
        stopImageIndex = slideIndex
        show = true
      })
      item.addEventListener('mouseout', (e) => {
         show = false
      })
    })
    attachOnClick()
  } else {
    alert("invalid duration value, please give positive value")
    return
  }

}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  searchedImages = undefined
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  getImages(search.value)
  sliders.length = 0;
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})

// adding enter functionality 
search.addEventListener("keypress", function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    searchBtn.click()
  }
});

// attach onclink

attachOnClick = () => {
  let sliderItem = document.querySelectorAll(".slider-item")
  sliderItem.forEach(item => {
    item.setAttribute("data-toggle", 'modal');
    item.setAttribute("data-target", '#exampleModal');

    item.addEventListener('click', (e) => {
      let clickedItem = e.target.src
      e.target.setAttribute("data-toggle", 'modal');
      e.target.setAttribute("data-target", '#exampleModal');
      e.target.setAttribute
      let clickedItemDetails = searchedImages.hits.filter(item => item.webformatURL == clickedItem)[0]
      modalBody.innerHTML = ''
      var div = document.createElement("div");
      var p1 = document.createElement("div");
      p1.innerHTML =
        `<p class="text-center mt-4">This image tags are ${clickedItemDetails.tags}</p><br/>
      <p class="text-center">This image has been downloaded ${clickedItemDetails.downloads} times</p><br/>
      <p class="text-center">This image width is ${clickedItemDetails.imageWidth} px</p><br/>
      <p class="text-center">This image height is ${clickedItemDetails.imageHeight} px</p><br/>
      <p class="text-center">This image size is ${Math.round(clickedItemDetails.imageSize / 1048576)} mb</p><br/>
      <p class="text-center">This image has ${clickedItemDetails.comments} comments</p><br/>`
      div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${clickedItemDetails.webformatURL}") src="${clickedItemDetails.webformatURL}" alt="${clickedItemDetails.tags}">`;
      modalBody.appendChild(div)
      modalBody.appendChild(p1)
    })
  })
}