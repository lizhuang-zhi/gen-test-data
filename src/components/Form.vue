<script>
import { bitable } from "@lark-base-open/js-sdk";
import { ref, onMounted } from "vue";
import { ElButton, ElForm, ElFormItem, ElSelect, ElOption } from "element-plus";
import { randomTimeRecord } from "@/record/randomGen.js";
import { NotGenFieldIDs, FieldType } from "@/record/field.js";
import { inArray } from "@/utils/tools.js";

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
    const fieldIdTypeMap = ref({});
    const genRecordNum = ref(5);
    const startAddRecord = ref(false); // 开始添加记录
    const stopAddRecord = ref(false); // 停止添加记录
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
      fieldIdTypeMap.value = getFieldIdTypeMap(fieldMetaList.value); // 获取字段id和字段类型的映射(Map)

      loading.value = false;
    });

    // 批量生成测试记录
    const genTestData = async () => {
      loading.value = true;
      const tableId = formData.value.table;
      let allTableRecordList = await getTableAllRecordList(tableId); // 获取表的所有（详细）记录
      if (!allTableRecordList || allTableRecordList.length === 0) {
        loading.value = false;
        return alert("请先添加一条模板记录");
      }
      console.log(allTableRecordList)
      allTableRecordList = filterFormulaField(allTableRecordList); // 剔除记录中公式类型字段
      const table = await bitable.base.getTableById(tableId);

      startAddRecord.value = true; // 开始添加记录

      for (let i = 0; i < genRecordNum.value && startAddRecord.value; i++) {
        // 停止添加记录
        if (stopAddRecord.value) {
          startAddRecord.value = false;
          stopAddRecord.value = false;
          break;
        }
        let newRecord = randomTimeRecord(allTableRecordList[0], fieldIdTypeMap.value); // 随机生成一条记录(时间字段随机)
        // HACK： 不能处理公式字段类型
        await table.addRecord(newRecord);
      }
      loading.value = false;
    };

    // **************************** 事件 ****************************
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

    // 停止添加记录
    const stopAddRecordEvent = () => {
      stopAddRecord.value = true;
    };

    // **************************** 封装方法 ****************************
    // 获取字段id和字段类型的映射(Map)
    const getFieldIdTypeMap = (fieldMetaList) => {
      if (!fieldMetaList || fieldMetaList.length === 0) return {};
      let fieldIdTypeMap = {};
      fieldMetaList.forEach((field) => {
        fieldIdTypeMap[field.id] = field.type;
      });
      return fieldIdTypeMap;
    };

    // 获取表的所有（详细）记录
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

    // 剔除记录中公式类型字段（以及返回信息字段、完成配置）
    const filterFormulaField = (recordList) => {
      if (!recordList || recordList.length === 0) return [];
      let filterFormulaFieldList = [];
      filterFormulaFieldList = recordList.map((record) => {
        let fields = record.fields;
        let filterFields = {};
        for (let field_id in fields) {
          // 过滤掉公式类型字段（以及返回信息字段、完成配置）
          if (
            fieldIdTypeMap.value[field_id] !== FieldType.FORMULA &&
            !inArray(NotGenFieldIDs, field_id)
          ) {
            filterFields[field_id] = fields[field_id];
          }
        }
        return {
          fields: filterFields,
        };
      });
      return filterFormulaFieldList;
    };

    return {
      formData,
      tableMetaList,
      fieldMetaList,
      fieldIdTypeMap,
      genRecordNum,
      startAddRecord,
      stopAddRecord,
      loading,

      getFieldIdTypeMap,
      genTestData,
      changeTableEvent,
      filterFormulaField,
      stopAddRecordEvent,
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
      <el-form-item label="生成记录数" size="large">
        <el-input-number v-model="genRecordNum" :min="1" :max="1000" />
      </el-form-item>
      <el-button type="primary" plain size="large" @click="genTestData"
        >批量生成</el-button
      >
    </el-form>
  </div>

  <!-- 关闭按钮 -->
  <div class="close_button" v-show="startAddRecord && loading">
    <el-button type="primary" plain size="large" @click="stopAddRecordEvent"
      >停止创建</el-button
    >
  </div>
</template>

<style scoped lang="less">
.form_container {
  // 表单
  .form {
    &:deep(.el-form-item__label) {
      font-size: 14px;
      color: var(--el-text-color-primary);
      margin-bottom: 8px;
    }
    &:deep(.el-form-item__content) {
      font-size: 14px;
    }
  }
}

// 关闭按钮
.close_button {
  position: fixed;
  top: 55%;
  left: 43%;
}
</style>