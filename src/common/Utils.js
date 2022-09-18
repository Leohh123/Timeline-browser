import {
  amber,
  blue,
  blueGrey,
  brown,
  common,
  cyan,
  deepOrange,
  deepPurple,
  green,
  grey,
  indigo,
  lightBlue,
  lightGreen,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
} from "@mui/material/colors";

function timeOfDate(date) {
  return new Date(date.toDateString()).getTime();
}

function formatDate(date, fmt = "HH:MM") {
  if (!(date instanceof Date)) {
    return "";
  }
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(), // 年
    "m+": (date.getMonth() + 1).toString(), // 月
    "d+": date.getDate().toString(), // 日
    "H+": date.getHours().toString(), // 时
    "M+": date.getMinutes().toString(), // 分
    "S+": date.getSeconds().toString(), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, "0"));
    }
  }
  return fmt;
}

const iso8601DurationRegex =
  /(-)?P(?:([.,\d]+)Y)?(?:([.,\d]+)M)?(?:([.,\d]+)W)?(?:([.,\d]+)D)?T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?/;

function formatDuration(iso8601Duration, fmt = "HH:MM:SS") {
  if (!iso8601Duration) {
    return "";
  }
  let matches = iso8601Duration.match(iso8601DurationRegex);
  // console.log("matches", matches);
  let d = {
    sign: matches[1] === undefined ? "+" : "-",
    years: matches[2] === undefined ? 0 : matches[2],
    months: matches[3] === undefined ? 0 : matches[3],
    weeks: matches[4] === undefined ? 0 : matches[4],
    days: matches[5] === undefined ? 0 : matches[5],
    hours: matches[6] === undefined ? 0 : matches[6],
    minutes: matches[7] === undefined ? 0 : matches[7],
    seconds: matches[8] === undefined ? 0 : matches[8],
  };
  // console.log("d", d);
  let ret;
  const opt = {
    "Y+": d.years, // 年
    "m+": d.months, // 月
    "d+": d.days, // 日
    "H+": d.hours, // 时
    "M+": d.minutes, // 分
    "S+": parseInt(d.seconds).toString(), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, "0"));
    }
  }
  return fmt;
}

function formatTime(time) {
  return time.split(":").slice(0, -1).join(":");
}

function pad2(x) {
  if (x < 10) return "0" + x;
  return x.toString();
}

function formatMilliseconds(x) {
  x = Math.floor(x / 1000);
  let s = x % 60;
  x = Math.floor(x / 60);
  let m = x % 60;
  x = Math.floor(x / 60);
  return `${pad2(x)}:${pad2(m)}:${pad2(s)}`;
}

const DAY_CHAR = ["一", "二", "三", "四", "五", "六", "日"];

const COLORS = [
  amber,
  blue,
  blueGrey,
  brown,
  // common,
  cyan,
  deepOrange,
  deepPurple,
  green,
  // grey,
  indigo,
  lightBlue,
  lightGreen,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
];

// let cnt = 0;

function selectCommentColor(name) {
  // return COLORS[cnt++ % COLORS.length];
  if (name === "Leohh") {
    return blue;
  }
  let hash = 0;
  let str = encodeURI(name);
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i);
  }
  return COLORS[hash % COLORS.length];
}

export {
  timeOfDate,
  formatDate,
  formatDuration,
  formatTime,
  formatMilliseconds,
  DAY_CHAR,
  selectCommentColor,
};
