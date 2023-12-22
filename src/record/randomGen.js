import { formatDate } from "@/utils/time.js";
import { RandomGenFieldIDs } from "@/record/field.js";

// 时间字段随机累加
/* 
    @param timeStrVal: 时间字段值
    @param addTime: 累加时间（单位: h或者m或者s）
    @return resultTimeStr: 累加后的时间字符串（格式：yyyy-MM-dd hh:mm:ss）
*/
export function timeFieldRandomAdd(timeStrVal, addTime) {
    if (!timeStrVal) return timeStrVal;
    if (!addTime) return timeStrVal;
    if (!addTime.includes("h") && !addTime.includes("m") && !addTime.includes("s")) {
        return new Error("累加时间格式错误, 请包含h或者m或者s");
    }
    let addTimeNumMs = 0;  // 累加时间ms

    // 分离数字
    let addTimeNum = parseInt(addTime.slice(0, -1));
    if (isNaN(addTimeNum)) {
        return new Error("时间数字格式错误");
    }
    // 将h、m、s转为ms
    if (addTime.includes("h")) {
        addTimeNumMs = addTimeNum * 60 * 60 * 1000;
    } else if (addTime.includes("m")) {
        addTimeNumMs = addTimeNum * 60 * 1000;
    } else if (addTime.includes("s")) {
        addTimeNumMs = addTimeNum * 1000;
    }

    // 将timeStrVal转为时间戳
    let timeStrValMs = new Date(timeStrVal).getTime();
    // 累加时间戳
    let resultTimeMs = timeStrValMs + addTimeNumMs;
    // 将时间戳转为时间字符串yyyy-MM-dd hh:mm:ss
    let resultTimeStr = formatDate(new Date(resultTimeMs));
    return resultTimeStr;
}


// 对单条记录的时间字段随机统一累加
/* 
    @param record: 源记录对象
    @return resultRecord: 随机累加时间后的记录对象
*/
export function randomTimeRecord(record) {
    if (!record) return record;
    let fields = record.fields;
    let resultRecord = {
        fields: {}
    };
    let randomNum = Math.floor(Math.random() * 100) + 1;  // 生成1-100的随机数
    let randomUnit = randomTimeUnit();  // 随机返回单位h、m、s
    for (let field_id in fields) {
        if (RandomGenFieldIDs.includes(field_id)) {
            // TODO：如果是时间类型的字段, 无法处理，这里只处理了文本类型的时间
            resultRecord.fields[field_id] = [
                {
                    text: timeFieldRandomAdd(fields[field_id][0].text, randomNum + randomUnit),
                    type: "text"
                }
            ]
        } else {
            resultRecord.fields[field_id] = fields[field_id];
        }
    }
    return resultRecord;
}

/* 
    @return timeUnit: 随机返回单位h、m、s
*/
export function randomTimeUnit() {
    let randomNum = Math.floor(Math.random() * 3);
    return ["h", "m", "s"][randomNum];
}