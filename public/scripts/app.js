// Client facing scripts here
$(document).ready(function() {
  //MOVES WINDOW TO TOP OF PAGE
  $(`.scrollTop`).click(toTop);

  //FADES IN/OUT SCROLLTOP BUTTON
  $(window).scroll(toTopFade);

  //KEEPS STORY AT TOP
  $(window).scroll(storyStaysAtTop);

  //RED FLAG STAYS BRIGHT WHEN CLICKED
  $("i.report").click(report);

  //SUBMIT TEXT TO ADD TO STORY
  $("form.addContribution").submit(submitNewAdd);

//SLIDE BUTTON TO ADD TO A STORY
  $("button.showText").click(addSlideButton);

  //LIST PAGE TOGGLE BUTTONS
  $(".toggleRight").click(loadStoriesRight)
  $(".toggleLeft").click(loadStoriesLeft)
})


//
// SINGLE STORY FUNCTIONS AND EVENT HANDLERS
//


const storyStaysAtTop = function(){
  const $story = $('#myStory');
  const $title = $('p.title')
  $story.toggleClass('stationary', $(this).scrollTop() > $title.height())
};

//CHANGES REPORT FLAG TO RED WHEN CLICKED
const report = function(){
  $(this).css('color', `red`)
};

//MOVES WINDOW TO TOP OF PAGE
const toTop = function(event) {
  event.preventDefault();
  $("html").animate({ scrollTop: 0}, 'fast');
};

//FADES IN/OUT SCROLLTOP BUTTON
const toTopFade = function() {
  if ($(this).scrollTop() > 80) {
    return $('.hidden').fadeIn();
  }
  return $('.hidden').fadeOut();
};

//PREVENT JS IN INPUT
const escape = function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

//SLIDE BUTTON TO ADD TO A STORY
const addSlideButton = function(event) {
  event.preventDefault();
  $("html").animate({ scrollTop: 0}, 'fast');
  $(`.new-add`).slideToggle(250);
  $('div.show').slideUp(150)
  $('#add-text').focus();
};



const createAdditionElement = function(data) {
  const contribution =
  `<div class="contribution">
  <input type="hidden" >
<p>${escape(data.text)}</p>
<footer>
  <div class="icons">
    <i class="fa-solid fa-flag report"></i>
    <div class="rating">
    <form class="submit" action="/users/like/${data.id}" method="POST">
    <button class="fa-solid fa-arrow-up vote"></button><span>${data.id.rating}</span></form>
      <form class="submit" action="/users/dislike/${data.id}" method="POST">
      <button class="fa-solid fa-arrow-down vote"></i></form>
    </div>
  </div>
</footer>
</div>`
  return contribution;
};


const renderContributions = function(data) {
  $(`#contribution-container`).empty();
  data.forEach(contribution => {
    $('#contribution-container').prepend(createAdditionElement(contribution));
  });
};

const loadContributions = function() {
  $.getJSON('/stories/:id', function(res) {
    renderContributions(res);
  })
  .fail(() => {
    console.error("Ajax .get Error");
  });
};

const submitNewAdd = function(event) {
  event.preventDefault();
    $.post("/stories/:id", $(this).serialize())
    .fail(() => {
      console.error("Ajax .post Error");
    })
      .then(() => {
        loadContributions();
      });
};


//
// END OF SINGLE STORY FUNCTIONS AND EVENT HANDLERS
//

//
// STORY LIST PAGE
//
let offset = 0

const createStoryElement = function(data) {
  const stories =
  `<a href="/stories/${data.id}" class="storyStamp">${data.title}</a>`
  return stories;
};


const renderStories = function(data) {
  $(`#story-container`).empty();
  data.forEach(story => {
    $('#story-container').prepend(createAdditionElement(story));
    if(!data.active) {
      const finished = `<div class="storyFinished">Finished</div>`
      $('a.storyStamp').append(finished)
    }
  });
};

const loadStoriesRight = function(event) {
  event.preventDefault();
  $.getJSON('/stories/listdown/offset', function(res) {
    offset += 3
    renderStories(res);
  })
  .fail(() => {
    console.error("Ajax .get Error");
  });
};

const loadStoriesLeft = function(event) {
  event.preventDefault();
  $.getJSON('/stories/listup/offset', function(res) {
    if(offset >= 3) {
      offset -= 3
    }
    renderStories(res);
  })
  .fail(() => {
    console.error("Ajax .get Error");
  });
};
//
//  END OF STORY LIST PAGE
//

//
// LIKE/DISLIKE FUNCTION
//

const createCounter = function(data) {
  const counter =
  `data.rating`;
  return counter;
};


const loadLikeCounter = function(event) {
  event.preventDefault();
  $.getJSON('/stories/like/:id', function(data) {
    $(`span.rating-${data.id}`).empty();
    $(`span.rating-${data.id}`).prepend(createCounter(data));
  })
  .fail(() => {
    console.error("Ajax .get Error");
  });
};


const submitLike = function(event) {
  event.preventDefault();
  $.post("/stories/like/:id", $(this).serialize())
  .fail(() => {
    console.error("Ajax .post Error");
  })
  .then(() => {
    loadLikeCounter();

  });

}

const submitDislike = function(event) {
  event.preventDefault();
  $.post("/stories/dislike/:id", $(this).serialize())
  .fail(() => {
    console.error("Ajax .post Error");
  })
  .then(() => {
    loadLikeCounter();

  });

}

//
// END OF LIKE/DISLIKE FUNCTION
//
