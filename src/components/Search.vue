<template>
  <div class="home-container">
    <h1 class="home-title">Search</h1>
    <input type="text" v-model="keyword" placeholder="好きなキーワードを入力してください">
    <button @click="serchMovie">search</button>
    <div class="error" v-if="errorMessage">
      <p>{{ errorMessage }}</p>
    </div>

    <div class="content-wrapper">
      <div class="movie-container" v-for="movieInfo of movieInfos" :key="movieInfo.id">
        <h3 class="movie-title">{{ movieInfo.title }}</h3>
        <router-link :to="`/search/${movieInfo.id}`">
          <img :src="'https://image.tmdb.org/t/p/w185/'+ movieInfo.poster_path" alt="">
        </router-link>
        <p class="movie-overview">{{ movieInfo.overview }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "Search",
  data() {
    return {
      movieInfos: null,
      keyword: "",
      errorMessage: null,
    }
  },
  methods: {
    serchMovie() {
      this.errorMessage = null;
      // 入力された文字列の空白を全て削除する
      // \s が空白を意味し、グローバル修飾子gをつけることで何度空白があっても全て置換する
      // （gがないと先頭だけしか置換されない）
      const inputKeyword = this.keyword.replace(/\s+/g, "");
      if (inputKeyword == "") {
        this.errorMessage = "Please input some keyword!";
        this.keyword = "";
        return; 
      }
      this.movieInfos = null;
      axios
        .get('https://api.themoviedb.org/3/search/movie', {
          params: {
            query: this.keyword,
            page: 1,
            language: 'ja-JA',
            api_key: process.env.VUE_APP_API_KEY
          }
        })
        .then(res => {
          this.movieInfos = res.data.results
          // console.log(res);
        }).catch(err => {
          console.log(err);
        }).finally(() => {
          // this.keyword = null;
        })
    }
  }
}
</script>

<style scoped>
.home-container {
  background-color: white;
  text-align: center;
}

.home-title {
  font-weight: 600;
}

.content-wrapper {
  display: grid;
  /* grid-template-columns: repeat(3, lfr); */
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  /* margin: 0 auto; */
}

.movie-container {
  /* display: inline-block; */
  /* border: 1px black solid; */
  /* width: 200px; */
  text-align: center;
}

.movie-title {
  margin: 0px;
  margin-top: 15px;
  margin-bottom: 7px;
}

.movie-overview {
  width: 200px;
  height:60px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin: 0 auto;
}
</style>