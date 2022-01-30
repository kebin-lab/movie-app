<template>
  <div class="detail-wrapper">
    <h2>{{ movieInfo.original_title}}</h2>
    <img :src="'https://image.tmdb.org/t/p/w185/'+ movieInfo.poster_path" alt="">
    <p>公開日:{{ movieInfo.release_date}}</p>
    <p>評価:{{ movieInfo.vote_average}}/10</p>
    <p>
      <a :href="movieInfo.homepage">公式サイトはこちらから</a>
    </p>
    <p>概要:{{ movieInfo.overview }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    movie_id: Number
  },
  data() {
    return {
      movieInfo: null
    }
  },
  created() {
    axios
    .get(`https://api.themoviedb.org/3/movie/${this.$route.params.movie_id}`, {
      params: {
        language: 'ja-JA',
        api_key: process.env.VUE_APP_API_KEY
      }
    })
    .then(res => {
      this.movieInfo = res.data
      // console.log(res);
    })
  }
}
</script>