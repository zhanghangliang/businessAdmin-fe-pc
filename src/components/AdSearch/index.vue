<template>
  <div>
    <template v-if="searchType.arr && searchType.arr.length >0">
      <!--  大于10 -->
      <div v-if=" searchType.arr.length >5"
           class="filter-search-div search-item-div">
        <span>{{ searchType.title }} :</span>
        <ul :ref="searchType.name"
            class="search-item-list"
            :class="{'search-item-list-overflow': searchType.overflow}">
          <li v-for="(item,index) of searchType.arr"
              :key="index"
              :class="{'active': searchType.active == index}"
              @click="getActive(item,index)">
            {{ item[searchType.realName] }}
          </li>
        </ul>
        <span v-if="searchType.hasMore"
              class="more"
              @click="more">
          {{ !searchType.overflow ? "更多":"收起" }}
        </span>

      </div>
      <!--   小于10 -->
      <div v-else
           class="filter-search-div search-item-div"
           style="float:left; width:calc(100% - 50%);">
        <span>{{ searchType.title }}:</span>
        <ul :ref="searchType.name"
            class="search-item-list">
          <li v-for="(item,index) of searchType.arr"
              :key="index"
              :class="{'active': searchType.active == index}"
              @click="getActive(item,index)">
            {{ item[searchType.realName] }}
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'AdSearch',
  props: {
    searchType: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  created () {

  },
  methods: {
    getActive (tab, index) {
      this.$emit('li-click', index)
    },
    more () {
      this.$emit('more')
    }
  }
}
</script>

<style>
</style>
