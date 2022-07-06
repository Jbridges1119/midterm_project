// Client facing scripts here
$(document).ready(function() {
  //MOVES WINDOW TO TOP OF PAGE
  $(`.scrollTop`).click(toTop);

  //FADES IN/OUT SCROLLTOP BUTTON
  $(window).scroll(toTopFade);

  //KEEPS STORY AT TOP
  $(window).scroll(storyStaysAtTop);

  //RED FLAG STAYS BRIGHT WHEN CLICKED
  // $("i.report").click(report);
  $(document).on('click', 'i.report', report)
  //SUBMIT TEXT TO ADD TO STORY
  $("form.addContribution").submit(submitNewAdd);

//SLIDE BUTTON TO ADD TO A STORY
  $("button.showText").click(addSlideButton);

  //LIST PAGE TOGGLE BUTTONS
  let offset = 0
  $("a.toggleRight").click(function(event) {
    event.preventDefault();
  offset += 3
    $.getJSON(`/stories/listdown/${offset}`, function(res) {
      if(!res.stories.length) {
        offset -= 3
        return $('.caro').effect( "bounce", {direction:'right',distance:15, times:3}, 150 );
        }
        renderStories(res);
     })
    .fail(() => {
       console.error("Ajax .get Error");
    });
  })
  $("a.toggleLeft").click(function(event) {
  event.preventDefault();
  if(offset <= 0) {
    return $('.caro').effect( "bounce", {direction:'right',distance:15, times:3}, 150 );
    }
  offset -= 3
  $.getJSON(`/stories/listup/${offset}`, function(res) {
    renderStories(res);
  })
  .fail(() => {
    console.error("Ajax .get Error");
  });
})
//OWNERS LIST PAGE TOGGLE BUTTONS - USES OFFSET
$("a.toggleOwnerRight").click(function(event) {
  event.preventDefault();
  offset += 3
  $.getJSON(`/users/listdown/${offset}`, function(res) {
    if(!res.stories.length) {
      offset -= 3
      return $('.caro').effect( "bounce", {direction:'right',distance:15, times:3}, 150 );
      }
      renderOwnerStories(res);
   })
  .fail(() => {
     console.error("Ajax .get Error");
  });
})
$("a.toggleOwnerLeft").click(function(event) {
  event.preventDefault();
  if(offset <= 0) {
    return $('.caro').effect( "bounce", {direction:'right',distance:15, times:3}, 150 );
    }
  offset -= 3
  $.getJSON(`/users/listup/${offset}`, function(res) {
    renderOwnerStories(res);
  })
  .fail(() => {
    console.error("Ajax .get Error");
  });
})
$(document).on('click', 'button.fa-arrow-up',submitLike)

$(document).on('click', 'button.fa-arrow-down',submitDislike)


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
<p>${escape(data.additions)}</p>
<footer>
<div class="icons">
  <i class="fa-solid fa-flag report"></i>
  <div class="rating">
    <form class="submit" action="/users/like/${data.id}" method="POST">
    <button id="${data.id}" class="fa-solid fa-arrow-up vote"></button>
    <span id="${data.id}" class="ratingCounter" >
      <div id="vaiableCounter"> ${data.rating}
      </div></span></form>
    <form id="${data.id}" class="submit" action="/users/dislike/${data.id}"" method="POST">
    <button id="${data.id}"class="fa-solid fa-arrow-down vote"></i></form>
  </div>
</div>
</footer>
</div>`


  return contribution;
};


const renderContributions = function(data) {
  $(`#contribution-container`).empty();
  data.contributions.forEach(contribution => {
    $('#contribution-container').prepend(createAdditionElement(contribution));
  });

};

const loadContributions = function(id) {
  $.getJSON(`/stories/additions/${id}`, function(res) {
    renderContributions(res);
  })
  .fail(() => {
    console.error("Ajax .get Error here?");
  });
};

const submitNewAdd = function(event) {
  event.preventDefault();
  const string = event.currentTarget.baseURI
  let numberString = '';
  for (let i = string.length - 1; i > 0; i--){
    if(string[i] === "/"){
      break
    } else {
      numberString += string[i]
    }
  }
  numberString = numberString.split('').reverse().join('')
  const id = string.charAt(string.length - 1)
    $.post(`/stories/additions/${id}`, $(this).serialize())
    .fail(() => {
      console.error("Ajax .post Error or here?");
    })
      .then(() => {
        loadContributions(id);
        $('#add-text').val("");
        $(`.new-add`).slideToggle(250);

      });
};


//
// END OF SINGLE STORY FUNCTIONS AND EVENT HANDLERS
//

//
// STORY LIST PAGE
//
const createStoryElement = function(data) {

  if(!data.completed) {
    const notFinished = `<a href="/stories/${data.id}"  class="storyStamp">${data.title}<div class="desc">${data.content.substring(0, 150) + "..."}</div><div   class="storyFinished">In Progress</div></a>`
    return notFinished;
  }
  const stories =
  `<a href="/stories/${data.id}"  class="storyStamp">${data.title}<div class="desc">${data.content.substring(0, 150) + "..."}</div><div   class="storyFinished">Complete</div></a>`
  return stories;
};


const renderStories = function(res) {
  $(`#story-container`).empty();
  for (let story of res.stories) {
    $('#story-container').append(createStoryElement(story));
    $("html").animate({ scrollBottom: 100}, 'fast');
  }
  }

  const createOwnerStoryElement = function(data) {
    if(!data.completed) {
      const notFinished = `<a href="/users/${data.id}"  class="storyStamp">${data.title}<div class="desc">${data.content.substring(0, 150) + "..."}</div><div   class="storyFinished">In Progress</div></a>`
      return notFinished;
    }
    const stories =
    `<a href="/users/${data.id}"  class="storyStamp">${data.title}<div class="desc">${data.content.substring(0, 150) + "..."}</div><div   class="storyFinished">Complete</div></a>`
    return stories;
  };

  const renderOwnerStories = function(res) {
    $(`#story-container`).empty();
    for (let story of res.stories) {
      $('#story-container').append(createOwnerStoryElement(story));
      $("html").animate({ scrollBottom: 100}, 'fast');
    }
    }

//
//  END OF STORY LIST PAGE
//

//
// LIKE/DISLIKE FUNCTION
//

//FORM CURRENT RATING INTO HTML
const createCounter = function(data) {
  const counter = `<div id="vaiableCounter">${data.contribution[0].rating}</div>`
  return counter;
};

//GET CURRENT CONTRIBUTION RATING
const loadRatingCounter = function(event) {
  $.getJSON(`/users/rating/${event}`, function(data) {
    $(`#${data.contribution[0].id}.ratingCounter`).empty();
    $(`#${data.contribution[0].id}.ratingCounter`).prepend(createCounter(data));
  })
  .fail(() => {
    console.error("Ajax .get Error here");
  });
};

//POST TO INCREASE CONTRIBUTION RATING BY 1
const submitLike = function(event) {
  event.preventDefault();
  const id = event.currentTarget.id
  $.post(`/users/like/${id}`, $(this).serialize())
  .fail(() => {
    console.error("Ajax .post Error");
  })
  .then(() => {
    loadRatingCounter(id);
  });
}
//POST TO REDUCT CONTRIBUTION RATING BY 1
const submitDislike = function(event) {
  event.preventDefault();
  const id = event.currentTarget.id
  $.post(`/users/dislike/${id}`, $(this).serialize())
  .fail(() => {
    console.error("Ajax .post Error here");
  })
  .then(() => {
    loadRatingCounter(id);
  });
}

//
// END OF LIKE/DISLIKE FUNCTION
//

