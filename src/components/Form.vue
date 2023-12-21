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
      for (let i = 0; i < 10; i++) {
        // HACK： 不能处理公式字段类型
        let res = await table.addRecord({
          fields: {
            fldXhCCwo9: null,
            fldhuZmV9q: null,
            fldCHbehxw: null,
            // fldFUbiEei: [
            //   {
            //     text: "https://tournament-img.farlight84miraclegames.com/tournament-data/kv/cgijc3nj46motp2cb620.png",
            //     type: "text",
            //   },
            // ],
            // fld9Ta2hAi: [
            //   {
            //     text: "https://tournament-img.farlight84miraclegames.com/tournament-data/head/ch2vid8rikp8u8jckmn0.png",
            //     type: "text",
            //   },
            // ],
            // fldpw2qxnA: null,
            // fldlHXJ5vl: null,
            // fldb2jbYdH: [
            //   {
            //     text: "320,160,80,80,40,40,40,40",
            //     type: "text",
            //   },
            // ],
            // fld9WzekYs: null,
            // fld493UeJ7: null,
            // fldLt7RAVV: null,
            // fldNqSvyLX: null,
            // fldsut6r4t: [
            //   {
            //     text: "1",
            //     type: "text",
            //   },
            // ],
            // fldOM5SuWj: null,
            // fldTMDAHOr: null,
            // fld64l5IAL: [
            //   {
            //     text: "测试集群",
            //     type: "text",
            //   },
            // ],
            // fld7D5RTwk: null,
            // fldyxwBqBg: [
            //   {
            //     text: '{"id":"[赛制_BO1] Test 钻800", "name": "Test", "cluster_id": "1",\n  "reward_rules"\n  : "320,160,80,80,40,40,40,40", "reward_join": null, "register_start_time": "2023-08-28 20:20:00", "register_end_time": "2023-08-28 20:40:00", "start_time": "2023-08-29 14:00:00", "pre_end_time": null, "final_start_time": null, "banner_file": null, "banner_name": null, "head_file": "https://tournament-img.farlight84miraclegames.com/tournament-data/head/ch2vid8rikp8u8jckmn0.png", "head_name": "Beau美金", "kv_file": "https://tournament-img.farlight84miraclegames.com/tournament-data/kv/cgijc3nj46motp2cb620.png", "kv_name": "new底图", "division": "FCCA", "design": "赛制_BO1", "clan_level": null, "clan_rank_rule": null, "clan_extend_rule": null, "register_min_clan_member": "1", "reward_type": "钻800", "clan_num_rule": "8,15", "mode_name": "大逃杀-四排-日落城", "register_disabled": "否",\n  "publish_result_delay": "24小时",\n  "publish_result_delay_s2": "不自动结算",\n  "luck_draw_rule": "&&&"\n   }',
            //     type: "text",
            //   },
            // ],
            // fld1wVq6Ex: null,
            // fld4zchhQS: null,
            // fldnaMRj7F: null,
            // fldwXB9mmG: null,
            // fldl9kRMds: null,
            fldwm5RDMO: null,
            // fldywxlMPG: 5,
            // fldpLzQJhy: null,
            // fldPgBnpnL: null,
            // fldWvOfcKU: null,
            // flduxJVpep: [
            //   {
            //     text: "[赛制_BO1] Test 钻800",
            //     type: "text",
            //   },
            // ],
            // fld3aadamZ: [
            //   {
            //     text: "FCCA",
            //     type: "text",
            //   },
            // ],
            fldnKn0uBX: null,
            fldLy8WjvU: {
              id: "opt0SzP8DQ",
              text: "否",
            },
            fldD4uEEIY: {
              id: "opteFkqkF1",
              text: "24小时",
            },
            fldlwPZqCt: {
              id: "optfWnajLJ",
              text: "大逃杀-四排-日落城",
            },
            fld5ePSFsN: {
              id: "optHEM3lKu",
              text: "ASIA(UTC+8)",
            },
            fldgKaHPQn: {
              id: "opttV1C84U",
              text: "Beau美金",
            },
            fldjdTiyN5: {
              id: "optIjKfdHJ",
              text: "new底图",
            },
            fldtt8Rbf4: {
              id: "optAzWpFZP",
              text: "不自动结算",
            },
            fldVtX7HQX: {
              id: "optmKAsaY9",
              text: "钻800",
            },
            fldlwjR3hH: {
              id: "optDDUVAPS",
              text: "1",
            },
            fldimHHs0m: {
              id: "optNfLfnjB",
              text: "赛制_BO1",
            },
            fld4M5GsgL: {
              id: "optEXKIL6d",
              text: "否",
            },
            fldnUIIgZV: {
              id: "optSZDQ3UJ",
              text: "BO1",
            },
            fldSVoO4ZU: {
              id: "optkY8nrk3",
              text: "8,15",
            },
            fldQtoBuC7: [
              {
                id: "optBExMGi2",
                text: "移动端",
              },
            ],
            fld4cKJtfO: [
              {
                type: "text",
                text: "Test",
              },
            ],
            fldyTn6xIi: [
              {
                type: "text",
                text: "2023-12-24 14:00:00",
              },
            ],
            fldE17cYeQ: [
              {
                type: "text",
                text: "2023-12-24 20:20:00",
              },
            ],
            fldrKlOy0b: [
              {
                type: "text",
                text: "2023-12-24 20:40:00",
              },
            ],
            fldGHiMiB1: [
              {
                type: "text",
                text: "2023-12-24",
              },
            ],
            fldSXz820g: [
              {
                id: "ou_980b348879926f666f361924d76b366a",
                name: "李壮志",
                enName: "Leo Li",
                en_name: "Leo Li",
              },
            ],
          },
        });
        console.log(res);
      }
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