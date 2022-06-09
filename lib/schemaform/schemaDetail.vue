<template>
  <div class="container" v-if="(data instanceof Array)">
      <div class="detail-warp">
        <div class="data-item" v-for="(item, index) in data" :key="index">
          <div class="data-warp" v-if="(item instanceof Array)">
            <div cl="data-item" >
              <SchemaDetail v-for="(i, index) in item" :key="index" :data="i" :schemaMap="schemaMap" />
            </div>
          </div>
          <div class="data-warp" v-else-if="typeof item === 'object'">
            <div class="data-item " v-for="i in Object.keys(item)" :key="i">
              <div class="data-title">{{ schemaMap[i] }}:</div>
              <div
                class="data-content"
                v-if="typeof item[i] === 'object' && item[i]"
              >
                <SchemaDetail :data="item[i]" :schemaMap="schemaMap" />
              </div>
              <div class="data-content" v-else>
                {{ item[i] }}
              </div>
            </div>
          </div>
          <div class="data-warp" v-else>
            <div class="data-content">
              {{ item }}
            </div>
          </div>
        </div>
      </div>
  </div>
  <div class="detail-warp" v-else-if="typeof data === 'object'">
    <div class="data-warp">
      <div class="data-item " v-for="i in Object.keys(data)" :key="i">
      <div class="data-title">{{ schemaMap[i] }}:</div>
      <div
        class="data-content"
        v-if="typeof data[i] === 'object' && data[i]"
      >
        <SchemaDetail :data="data[i]" :schemaMap="schemaMap" />
      </div>
      <div class="data-content" v-else>
        {{ data[i] }}
      </div>
    </div>
    </div>
  </div>
  <div class="detail-warp" v-else>
    <div class="data-warp">
      <div class="data-item ">{{data}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SchemaDetail",
  props: {
    data: {},
    schemaMap: {
      type: Object
    }
  }
};
</script>

<style scoped>
.detail-warp {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: 10px;
}
.data-item {
  margin-bottom: 10px;
  display: flex;
  margin-left: 10px;
  padding: 5px 10px;
  flex-direction: column;
}
.data-warp {
  padding-top: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  flex: 1;
}
.data-title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 5px;
}
.data-content {
  width: 100%;
  margin-bottom: 5px;
  margin-left: 10px;
}
</style>
