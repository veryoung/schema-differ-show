<template>
  <div class="diff-container" v-if="!noData && !isShowDiffer">
    <div
      class="children-warp"
      v-if="hasChildren && currentChildren && currentChildren.length > 0"
    >
      <el-tag
        class="children-tag"
        v-for="(item, index) in currentChildren"
        :key="item"
        :type="index === currentIndex ? '' : 'info'"
        @click="onChangeChildren(index)"
        >{{ item }}</el-tag
      >
    </div>
    <template>
      <div class="item" v-for="item in Object.keys(currentData)" :key="item">
        <div class="data-title">{{ schemaMap[item] }}:</div>
        <div class="data-content" v-if="typeof currentData[item] === 'object'">
          <SchemaDetail :data="currentData[item]" :schemaMap="schemaMap" />
        </div>
        <div class="data-content" v-else>
          {{ currentData[item] }}
        </div>
      </div>
    </template>
  </div>
  <div class="diff-container" v-else-if="!noData && isShowDiffer">
    <div class="tips">
      <div class="tips-box">
        <div class="block add"></div>
        <div class="text">对比线上新增</div>
      </div>
      <div class="tips-box">
        <div class="block remove"></div>
        <div class="text">对比线上移除</div>
      </div>
    </div>
    <div
      class="children-warp"
      v-if="hasChildren && differChildrenData && differChildrenData.length > 0"
    >
      <el-tag
        class="children-tag"
        v-for="(item, index) in differChildrenData"
        :key="item.value + item.action"
        :type="
          currentDifferIndex === index
            ? ''
            : item.action === 'add'
            ? 'success'
            : item.action === 'remove'
            ? 'danger'
            : 'info'
        "
        @click="onChangeDifferChildren(item, index)"
        >{{ item.value }}</el-tag
      >
    </div>
    <div class="nodata" v-if="currentDifferIndex === -1 && hasChildren">
      选中一项查看变更
    </div>
    <template>
      <div
        class="item"
        :class="
          item.action === 'remove'
            ? 'remove'
            : item.action === 'add'
            ? 'add'
            : ''
        "
        v-for="item in differDataResult"
        :key="item.key + item.action"
      >
        <div class="data-title">{{ schemaMap[item.key] }}:</div>
        <div
          class="data-content"
          v-if="item.type === 'object' || item.type === 'array'"
        >
          <DifferDetail
            :data="item.diff"
            :type="item.type"
            :schemaMap="schemaMap"
          />
        </div>
        <div class="data-content" v-else>
          {{ item.value }}
        </div>
      </div>
    </template>
  </div>
  <div v-else class="nodata">暂无数据</div>
</template>

<script>
import SchemaDetail from "./schemaDetail";
import DifferDetail from "./differDetail";
import { objectDiff, arrayDiff } from "./differ";

export default {
  name: "SchemaDifferShow",
  components: { SchemaDetail, DifferDetail },
  watch: {
    isShowDiffer(val) {
      if (!val) {
        this.resetDifferInfo();
      }
    }
  },
  props: {
    currentJSON: {
      type: [Object, Array]
    },
    differJSON: {
      type: [Object, Array]
    },
    hasChildren: {
      type: Boolean
    },
    currentChildren: {
      type: Array
    },
    differChildren: {
      type: Array
    },
    schema: {
      type: Object
    },
    isShowDiffer: {
      type: Boolean
    }
  },
  data() {
    return {
      schemaMap: {}, // schema映射
      currentIndex: 0,
      currentData: {},
      differData: {},
      noData: false,
      differDataResult: [],
      differChildrenData: [],
      currentDifferIndex: -1
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    /** 初始化一些信息 */
    init() {
      this.initSchema(this.schema);
      if (this.hasChildren) {
        this.currentIndex = 0;
        this.currentData = this.currentJSON[0];
        if (!this.currentData || Object.keys(this.currentJSON).length === 0) {
          this.noData = true;
        }
        this.differJSONData();
        return;
      }
      this.currentData = this.currentJSON;
      this.differData = this.differJSON;
      this.differJSONData();
      if (!this.currentData || Object.keys(this.currentJSON).length === 0) {
        this.noData = true;
      }
    },
    /** 初始化schema */
    initSchema(schema, key) {
      if (!schema) return;
      let props;
      if (key) {
        if (schema.title) this.schemaMap[key] = schema.title;
        props = schema.properties;
      } else {
        props = schema.root.properties;
      }
      for (let key in props) {
        const currentRoot = props[key];
        if (currentRoot.type === "object") {
          this.initSchema(currentRoot, key);
        } else if (currentRoot.type === "array") {
          this.schemaMap[key] = currentRoot.title;
          this.initSchema(currentRoot.items, key);
        } else {
          this.schemaMap[key] = currentRoot.title;
        }
      }
    },
    /** 变更选中的子元素 */
    onChangeChildren(index) {
      this.currentIndex = index;
      this.currentData = this.currentJSON[index];
      if (!this.currentData) {
        this.noData = true;
      }
      this.differJSONData();
    },
    /** 对比子数据 */
    differJSONData() {
      if (this.hasChildren) {
        if (this.differChildrenData.length === 0) {
          this.differChildrenData = arrayDiff(
            this.differChildren,
            this.currentChildren
          );
        }
        if (this.currentDifferIndex === -1) {
          return;
        }
      }
      this.differDataResult =
        objectDiff(this.differData, this.currentData) || [];
    },
    /** 变更differ的子元素  */
    onChangeDifferChildren(item, index) {
      if (item.action === "remove") return;
      const { value } = item;
      this.currentDifferIndex = index;
      const currentIndex = this.currentChildren.findIndex(i => i === value);
      const differIndex = this.differChildren.findIndex(i => i === value);
      this.differData = this.differJSON[differIndex] || {};
      this.currentData = this.currentJSON[currentIndex];
      this.differJSONData();
    },
    /** 重置子项对比信息 */
    resetDifferInfo() {
      this.currentDifferIndex = -1;
      if (this.hasChildren) {
        this.differData = {};
        this.differDataResult = [];
      }
    }
  }
};
</script>

<style scoped>
.diff-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.btn-warp {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
.data-item {
  margin-bottom: 20px;
  padding: 5px 10px;
  flex-direction: column;
}
.item {
  margin-bottom: 20px;
  padding: 5px 10px;
  flex-direction: row;
}
.data-title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 5px;
}
.data-content {
  margin-bottom: 5px;
}
.children-warp {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-bottom: 10px;
}
.children-tag {
  margin: 0 10px 10px 0;
  cursor: pointer;
}
.remove {
  background-color: #fbe9eb;
}
.add {
  background-color: #ecfdf0;
}
.nodata {
  width: 100%;
  text-align: center;
  height: 100px;
  line-height: 100px;
  font-weight: 700;
}
.tips {
  display: flex;
  flex-direction: row;
  margin: 10px 0;
}
.tips-box {
  margin-right: 20px;
  display: flex;
  align-items: center;
}
.block {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
.text {
  font-size: 12px;
}
</style>
