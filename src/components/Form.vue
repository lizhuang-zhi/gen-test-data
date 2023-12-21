<script>
import { bitable } from "@lark-base-open/js-sdk";
import { ref, onMounted } from "vue";
import { ElButton, ElForm, ElFormItem, ElSelect, ElOption } from "element-plus";

export default {
  components: {
    ElButton,
    ElForm,
    ElFormItem,
    ElSelect,
    ElOption,
  },
  setup() {
    const formData = ref({
      table: "", // 表id
    });
    // 展示数据
    const tableMetaList = ref([]);
    const fieldMetaList = ref([]);
    const loading = ref(false);

    onMounted(async () => {
      loading.value = true;
      const [tableList, selection, table] = await Promise.all([
        bitable.base.getTableMetaList(),
        bitable.base.getSelection(),
        bitable.base.getActiveTable(),
      ]);
      const view = await table.getViewById(selection.viewId);
      formData.value.table = selection.tableId;
      tableMetaList.value = tableList;
      fieldMetaList.value = await view.getFieldMetaList(); // 获取所有字段元数据
      loading.value = false;
    });

    // 批量生成测试记录
    const genTestData = async () => {
      loading.value = true;
      const tableId = formData.value.table;
      let allTableRecordList = await getTableAllRecordList(tableId);
      console.log(allTableRecordList);

      const table = await bitable.base.getTableById(tableId);
      table.addRecords(deepClone(allTableRecordList));
      loading.value = false;
    };

    // 改变table表
    const changeTableEvent = async () => {
      loading.value = true;
      const tableId = formData.value.table;
      if (tableId) {
        const table = await bitable.base.getTableById(tableId);
        const selection = await bitable.base.getSelection();
        const view = await table.getViewById(selection.viewId);
        fieldMetaList.value = await view.getFieldMetaList(); // 获取所有字段元数据
      }
      loading.value = false;
    };

    // **************************** 封装方法 ****************************
    const getTableAllRecordList = async (tableId) => {
      if (!tableId) return [];
      const table = await bitable.base.getTableById(tableId);
      const selection = await bitable.base.getSelection();
      const view = await table.getViewById(selection.viewId);
      const recordList = await view.getVisibleRecordIdList(); // 获取有序record的id列表
      let allRecordList = [];
      for (let i = 0; i < recordList.length; i++) {
        const record = await table.getRecordById(recordList[i]);
        allRecordList.push(record);
      }
      return allRecordList;
    };

    // 深度拷贝函数
    const deepClone = (obj) => {
      if (obj === null) return null;
      if (typeof obj !== "object") return obj;
      if (obj.constructor === Date) return new Date(obj);
      if (obj.constructor === RegExp) return new RegExp(obj);
      let newObj = new obj.constructor(); //保持继承链
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          //不遍历其原型链上的属性
          let val = obj[key];
          newObj[key] = typeof val === "object" ? deepClone(val) : val; // 使用arguments.callee解除与函数名的耦合
        }
      }
      return newObj;
    };

    return {
      formData,
      tableMetaList,
      fieldMetaList,
      loading,

      genTestData,
      changeTableEvent,
    };
  },
};
</script>

<template>
  <div class="form_container" v-loading="loading">
    <el-form ref="form" class="form" :model="formData" label-position="top">
      <el-form-item label="选择数据表" size="large">
        <el-select
          v-model="formData.table"
          placeholder="请选择数据表"
          style="width: 100%"
          @change="changeTableEvent"
        >
          <el-option
            v-for="meta in tableMetaList"
            :key="meta.id"
            :label="meta.name"
            :value="meta.id"
          />
        </el-select>
      </el-form-item>
      <el-button type="primary" plain size="large" @click="genTestData"
        >批量生成</el-button
      >
    </el-form>
  </div>
</template>

<style scoped lang="less">
.form_container {
  // 表单
  .form {
    &:deep(.el-form-item__label) {
      font-size: 16px;
      color: var(--el-text-color-primary);
      margin-bottom: 0;
    }
    &:deep(.el-form-item__content) {
      font-size: 16px;
    }

    .add_container {
      width: 100%;
      display: flex;
      align-items: center;
      padding-top: 10px;
      border-top: 1px solid #aaa;

      .title {
        margin-right: 10px;
      }
    }
    .del_container {
      width: 100%;
      display: flex;
      align-items: center;
      padding-top: 10px;

      .title {
        margin-right: 10px;
      }
    }
  }
}
</style>