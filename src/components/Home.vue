<template>
  <div class="home-container">
    <h1 class="home-title">Home</h1>
    <select name="" id="" v-model="movieSort">
      <option value="popular">人気順</option>
      <option value="top_rated">評価順</option>
      <option value="now_playing">公開中</option>
      <option value="upcoming">Coming Soon</option>
    </select>
    <button @click="getMoviesBySort">並び替える</button>
    <div class="content-wrapper">
      <div class="movie-container" v-for="movieInfo of movieInfos" :key="movieInfo.id">
        <h3 class="movie-title">{{ movieInfo.title }}</h3>
        <router-link :to="`/search/${movieInfo.id}`">
          <img :src="'https://image.tmdb.org/t/p/w185/'+ movieInfo.poster_path" alt="">
        </router-link>
        <p class="movie-overview">{{ movieInfo.overview }}</p>
      </div>
    </div>
    <div class="pagenation">
      <ul>
        <li class="inactivePage" 
          :class="(current_page == 1) ? 'disabled' : ''" 
          @click="changePage(current_page-1)">
            « 
          </li>
        <li v-for="page in frontPageRange" 
          :key="page" 
          @click="changePage(page)" 
          :class="(isCurrent(page)) ? 'activePage' : 'inactivePage'">
          {{ page }}
        </li>
        <li v-show="isFrontDot" class="inactivePage disabled">...</li>
        <li v-for="page in middlePageRange" 
          :key="page" 
          @click="changePage(page)" 
          :class="(isCurrent(page)) ? 'activePage' : 'inactivePage'">
          {{ page }}
        </li>
        <li v-show="isEndDot" class="inactivePage disabled">...</li>
        <li v-for="page in endPageRange" 
          :key="page" @click="changePage(page)" 
          :class="(isCurrent(page)) ? 'activePage' : 'inactivePage'">
          {{ page }}
        </li>
        <li class="inactivePage" 
          :class="(current_page >= last_page) ? 'disabled' : ''" 
          @click="changePage(current_page + 1)">
          »
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "Home",
  created() {
    axios
    .get('https://api.themoviedb.org/3/movie/popular', {
      params: {
        page: 1,
        language: 'ja-JA',
        api_key: process.env.VUE_APP_API_KEY
      }
    })
    .then(res => {
      this.movieInfos = res.data.results
      this.last_page = res.data.total_pages
      // console.log(res);
    })
  },
  data() {
    return {
      movieSort: "popular",
      movieInfos: null,
      current_page: 1,
      last_page: "",
      range: 3,
      front_dot: false,
      end_dot: false
    }
  },
  computed: {
    // 先頭の２個の配列を返す
    frontPageRange() {
      return this.calcuRange(1,2);
    },
    // 真ん中５個の配列を返す
    middlePageRange() {
      if (this.current_page <= this.range) {
        return this.calcuRange(3, this.range + 2);

      } else if (this.current_page > this.last_page - this.range) {
        return this.calcuRange(this.last_page - this.range -1, this.last_page -2);

      } else {
          return this.calcuRange(
          this.current_page - Math.floor(this.range / 2), 
          this.current_page + Math.floor(this.range / 2)
        );
      }
    },
    // 最後２個の配列を返す
    endPageRange() {
      return this.calcuRange(this.last_page - 1, this.last_page);
    },
    isFrontDot() {
      this.checkNeedDot();
      return this.front_dot;
    },
    isEndDot() {
      this.checkNeedDot();
      return this.end_dot;
    }
  },
  methods: {
    async getMoviesBySort() {
      const result = await axios.get(`https://api.themoviedb.org/3/movie/${this.movieSort}`, {
        params: {
          page: this.current_page,
          language: 'ja-JA',
          api_key: process.env.VUE_APP_API_KEY
        }
      });
      const movies = result.data;
      this.current_page = movies.page;
      this.last_page = movies.total_pages;
      this.movieInfos = result.data.results;
    },
    calcuRange(start, end) {
      const range = [];
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
      return range;
    },
    changePage(page) {
      if (page > 0 && page <= this.last_page) {
        this.current_page = page;
        this.getMoviesBySort();
      }
    },
    isCurrent(page) {
      return page === this.current_page;
    },
    checkNeedDot() {
      if (this.current_page <= this.range) {
        this.front_dot = false;
        this.end_dot = true;
      } else if (this.current_page > this.last_page - this.range) {
        this.front_dot = true;
        this.end_dot = false;
      } else {
        this.front_dot = true;
        this.end_dot = true;
      }
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
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
}

.movie-container {
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

.pagenation {
  /* display: flex; */
  list-style-type: none;
}

.pagenation li {
  cursor: pointer;
  list-style: none;
  border: 1px solid #ddd;
  padding: 6px 12px;
  text-align: center;
  display: inline;
}

.activePage {
  background-color: #337ab3;
  color: white;
}

.inactivePage {
  color: #337ab3;
}
.disabled {
  cursor: not-allowed;
}
</style>