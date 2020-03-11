/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  let $response = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
  // console.log($response.data);

  // *** From Code Review: map over data and pull only pertinant data: less to hold in memory
  return $response.data;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  // changed 'show' to tvShows so we don't get lost in keys of returned object
  for (let tvShow of shows) {
    let noImageFound = 'https://tinyurl.com/tv-missing';
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${tvShow.show.id}">
         <div class="card" data-show-id="${tvShow.show.id}">
         <img class="card-img-top" src="${tvShow.show.image !== null ? tvShow.show.image.medium : noImageFound}">
           <div class="card-body" data-show-id="${tvShow.show.id}">
           <button class="episode-button">See Episodes</button>
             <h5 class="card-title">${tvShow.show.name}</h5>
             <p class="card-text">${tvShow.show.summary}</p>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
  $('.episode-button').on('click', async function (event) {
    let gottenEpisodes = await getEpisodes($(event.target).parent().attr('data-show-id'))
    populateEpisodes(gottenEpisodes);
  });


}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  let showEpisodes = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  // console.log(showEpisodes)
  let episodeList = showEpisodes.data.map(episode => {
    return {
      'id': episode.id,
      'name': episode.name,
      'season': episode.season,
      'number': episode.number
    }
  }
  )
  console.log(episodeList);
  return episodeList;

  // {id: 1234, name: "Pilot", season: "1", number: "1"},
  // TODO: return array-of-episode-info, as described in docstring above
}


// borrowing code from populateShows() for framework
function populateEpisodes(listOfEpisodes) {
  //eventlistener the 'get episodes' button with 
  const $episodeList = $("#episodes-list");
  $episodeList.empty();

  for (let episode of listOfEpisodes) {
    let $item = $(
      `<li> ${episode.name}, ${episode.season}, ${episode.number} </li>`
    )
      ;

    $episodeList.append($item);
  }

  $('#episodes-area').show();
}
