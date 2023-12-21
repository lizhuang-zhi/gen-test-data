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
      // loading.value = true;
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
      <!-- 选项 -->
      <div
        class="check_prop"
        v-for="(field, fieldIndex) in formData.fields"
        :key="fieldIndex"
      >
        <div class="top_line"></div>
        <el-form-item label="选择字段" size="large">
          <el-select
            v-model="field.fieldID"
            placeholder="请选择需要检查的字段"
            style="width: 100%"
          >
            <el-option
              v-for="fieldMeta in fieldMetaList"
              :key="fieldMeta.id"
              :label="fieldMeta.name"
              :value="fieldMeta.id"
            />
          </el-select>
        </el-form-item>
      </div>
      <el-button type="primary" plain size="large" @click="genTestData"
        >查询记录</el-button
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