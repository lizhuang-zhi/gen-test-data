/* 
    单条记录不需生成的字段ID集合
*/
export const NotGenFieldIDs = ["fldlHXJ5vl", "fldnKn0uBX"];


/* 
    需要进行随机生成的字段ID集合
    目前只支持文本时间字段
*/
export const RandomGenFieldIDs = ["fldE17cYeQ", "fldrKlOy0b", "fldyTn6xIi", "fldpw2qxnA", "fldhuZmV9q"]

/* 
    字段类型
*/
export const FieldType = {
    // 文本字段
    TEXT: 1,
    // 数字字段
    NUMBER: 2,
    // 单选字段
    SINGLE_SELECT: 3,
    // 多选字段
    MULTI_SELECT: 4,
    // 时间字段
    TIME: 5,
    // 公式字段
    FORMULA: 20,
    // 双向关联字段
    DOUBLE_RELATION: 21,
    // 人员字段
    PERSONNEL: 1004,
}