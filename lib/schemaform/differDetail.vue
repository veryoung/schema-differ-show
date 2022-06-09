<template>
  <div v-if="type === 'object' && data instanceof Array" class="data-warp">
    <div
      class="data-item "
      :class="
        i.action === 'remove' ? 'remove' : i.action === 'add' ? 'add' : ''
      "
      v-for="i in data"
      :key="i.action + i.key"
    >
      <div class="data-title">{{ schemaMap[i.key] }}:</div>
      <div class="data-content" v-if="i.type === 'object'">
        <DifferDetail :data="i" :schemaMap="schemaMap" :type="i.type" />
      </div>
      <div class="data-content" v-if="i.type === 'array'">
        <DifferDetail :data="i" :schemaMap="schemaMap" :type="i.type" />
      </div>
      <div class="data-content" v-else>
        {{ i.value }}
      </div>
    </div>
  </div>
  <div
    v-else-if="type === 'object' && typeof data === 'object'"
    class="data-warp"
  >
    <div
      class="data-item "
      :class="
        data.action === 'remove' ? 'remove' : data.action === 'add' ? 'add' : ''
      "
    >
      <div class="data-title" v-if="data.key">{{ schemaMap[data.key] }}:</div>
      <div class="data-content" v-for="d in data.diff" :key="d.action + d.key">
        <DifferDetail :data="d" :schemaMap="schemaMap" :type="d.type" />
      </div>
    </div>
  </div>
  <div class="data-warp" v-else-if="type === 'array' && data instanceof Array">
    <div class="data-item " v-for="(item, index) in data" :key="index">
      <DifferDetail :data="item" :schemaMap="schemaMap" :type="item.type" />
    </div>
  </div>
  <div class="detail-warp" v-else-if="type === 'array'">
    <div class="data-item" v-for="(item, index) in data.diff" :key="index">
      <div class="data-warp" v-if="item.type === 'array'">
        <div class="data-item">
          <DifferDetail :data="item" :schemaMap="schemaMap" :type="item.type" />
        </div>
      </div>
      <div class="data-warp" v-else-if="item.type === 'object'">
        <div
          class="data-item"
          :class="
            i.action === 'remove' ? 'remove' : i.action === 'add' ? 'add' : ''
          "
          v-for="i in item.diff"
          :key="i.action + i.key"
        >
          <div class="data-title">{{ schemaMap[i.key] }}:</div>
          <div class="data-content" v-if="i.type === 'object'">
            <DifferDetail :data="i" :schemaMap="schemaMap" :type="i.type" />
          </div>
          <div class="data-content" v-else-if="i.type === 'array'">
            <DifferDetail :data="i" :schemaMap="schemaMap" :type="i.type" />
          </div>
          <div class="data-content" v-else>
            {{ i.value }}
          </div>
        </div>
      </div>
      <div class="data-warp" v-else>
        <div
          class="data-item "
          :class="
            item.action === 'remove'
              ? 'remove'
              : item.action === 'add'
              ? 'add'
              : ''
          "
        >
          <div class="data-content">
            {{ item.value }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="type === 'scalar'" class="data-warp">
    <div
      class="data-item "
      :class="
        data.action === 'remove' ? 'remove' : data.action === 'add' ? 'add' : ''
      "
    >
      <div class="data-title" v-if="data.key">{{ schemaMap[data.key] }}:</div>
      <div class="data-content">
        {{ data.value }}
      </div>
    </div>
  </div>
  <div v-else>{{ data }}</div>
</template>

<script>
export default {
  name: "DifferDetail",
  props: {
    data: {
      type: [Array, Object]
    },
    type: {
      type: String
    },
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
  flex: 1;
}
.data-item {
  margin-bottom: 5px;
  display: flex;
  margin-left: 10px;
  padding: 5px 10px 0 5px;
  flex-direction: column;
}
.data-warp {
  padding: 4px 4px 0 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  flex: 1;
}
.data-title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 5px;
}
.data-content {
  margin-bottom: 5px;
  margin-left: 10px;
  flex: 1;
}
.remove {
  background-color: #fbe9eb;
}
.add {
  background-color: #ecfdf0;
}
</style>
