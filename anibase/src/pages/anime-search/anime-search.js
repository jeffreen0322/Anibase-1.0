import React, { useEffect, useState } from "react";
import AnimeEntry from "../../components/anime-entry/animeEntry";
import Category from "../../components/named-header/category";
import Pagination from "../../components/pagination/pagination";
import { useParams } from "react-router-dom";
import "./anime-search.css";

export default function AnimeSearch() {
  const idObj = useParams("id");
  const idObj2 = useParams("page");
  const directory = "/anime-search/" + idObj.id + "/";
  const searchResults = GetResults();
  return (
    <div>
      <AnimeSearchList animeResults={searchResults[0]} />
      <Pagination
        directory={directory}
        page={idObj2.page}
        count={searchResults[1]}
      />
    </div>
  );
}

function GetResults() {
  const [animeResults, SetAnimeResults] = useState([]);
  const [paginationResults, SetPaginationResults] = useState([]);

  const idObj = useParams("id");
  const idObj2 = useParams("page");

  // Async function to fetch from api.
  const GetAnimeResults = async () => {
    const temp = await fetch(
      "https://api.jikan.moe/v4/anime?q=" +
        idObj.id +
        "&" +
        "page=" +
        idObj2.page
    ).then((res) => res.json());

    SetAnimeResults(temp.data);
    SetPaginationResults(temp.pagination);
  };

  // Used when fetching data.
  useEffect(() => {
    GetAnimeResults();
  }, [idObj]);

  return [animeResults, paginationResults];
}

function AnimeSearchList({ animeResults }) {
  const animeSet = [];
  var duplicate = false;

  // Go through every anime.
  for (let i = 0; i < animeResults.length; ++i) {
    // Starting from the beginning of array, check if each of anime has the same mal_id as the current.
    for (let j = 0; j < i; ++j) {
      if (animeResults[i].mal_id === animeResults[j].mal_id) {
        duplicate = true;
        break;
      }
    }

    if (!duplicate) {
      animeSet.push(animeResults[i]);
    }

    duplicate = false;
  }

  return (
    <div>
      <Category name="Search Results" />
      <div className="results">
        {animeSet.map((anime) => (
          <AnimeEntry
            key={anime.title}
            id={anime.mal_id}
            title={anime.title}
            score={anime.score}
            episodes={anime.episodes}
            image={anime.images.jpg.image_url}
            season={null}
          />
        ))}
      </div>
    </div>
  );
}
