import { Alert, AlertTitle, Box, Divider, Rating, Stack, Typography } from "@mui/material";
import React from "react";
import {
  formatDate,
  formatDuration,
  formatMilliseconds,
  selectCommentColor,
  timeOfDate,
} from "../common/Utils";
// import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
// import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
// import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import SlowMotionVideoIcon from "@mui/icons-material/SlowMotionVideo";
// import PendingActionsIcon from "@mui/icons-material/PendingActions";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
// import LightIcon from "@mui/icons-material/Light";
// import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

class Timeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  momentOfObj(o) {
    switch (o.component) {
      case "stage":
        return o.actual;

      case "task":
        return o.head;

      case "comment":
        return o.moment;

      default:
        break;
    }
  }

  get procObjs() {
    let res = [];
    let timestamp = 0;
    let studyTaskSum = 0;
    for (const o of this.props.objs) {
      let t = timeOfDate(new Date(this.momentOfObj(o)));
      if (t !== timestamp) {
        if (timestamp !== 0) {
          res.push({ component: "summary", taskSum: studyTaskSum });
          studyTaskSum = 0;
        }
        timestamp = t;
        res.push({ component: "divider", text: formatDate(new Date(t), "YYYY/mm/dd") });
      }
      if (o.component === "task" && o.type === 1 && o.actual !== null) {
        studyTaskSum += new Date(o.tail) - new Date(o.head);
      }
      res.push(o);
    }
    return res;
  }

  calcRating(ms) {
    let hour = ms / (1000 * 60 * 60);
    if (hour >= 12) {
      return 5;
    }
    if (hour >= 10) {
      return 4;
    }
    if (hour >= 8) {
      return 3;
    }
    if (hour >= 6) {
      return 2;
    }
    if (hour >= 4) {
      return 1;
    }
    return 0;
  }

  renderObj(o) {
    switch (o.component) {
      case "stage":
        return (
          <Box sx={{ borderLeft: "3px solid grey" }} pl={1}>
            <Typography color="text.secondary">
              {formatDate(new Date(o.actual))}（原定{formatDate(new Date(o.estimated))})
            </Typography>
            <Typography>{o.title}</Typography>
          </Box>
        );

      case "task":
        return (
          <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
            {
              [
                <SlowMotionVideoIcon color="secondary" />,
                <TaskAltIcon color="success" />,
                <HighlightOffIcon color="error" />,
              ][o.state]
            }
            <Box>
              <Typography color="text.secondary">{formatDate(new Date(o.head))} 开始</Typography>
              <Typography>{o.title}</Typography>
              <Typography color="text.secondary">
                预计用时：{formatDuration(o.estimated)}
              </Typography>
              {o.state === 0 ? (
                <Typography color="text.secondary">进行中</Typography>
              ) : (
                <>
                  <Typography color="text.secondary">
                    实际用时：{formatDuration(o.actual)}
                  </Typography>
                  <Typography color="text.secondary">
                    {formatDate(new Date(o.tail))} 结束
                  </Typography>
                </>
              )}
            </Box>
          </Stack>
        );

      case "comment":
        const color = selectCommentColor(o.name);
        return (
          <Box
            sx={{ borderLeft: `3px solid ${color[100]}`, backgroundColor: color[50] }}
            px={1}
            py={0.5}
          >
            <Stack direction="row" justifyContent="flex-start" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {o.content}
              </Typography>
            </Stack>
            {o.name !== "Leohh" && (
              <Stack direction="row" justifyContent="flex-end" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {o.name}，{formatDate(new Date(o.moment), "HH:MM")}
                </Typography>
              </Stack>
            )}
          </Box>
        );

      case "summary":
        return (
          <Alert icon={<AutoFixHighIcon fontSize="inherit" />} severity="info">
            <AlertTitle>今日总结</AlertTitle>
            <Typography>净学习时长：{formatMilliseconds(o.taskSum)}</Typography>
            <Stack direction="row" justifyContent="flex-start" alignItems="center">
              <Typography>评级：</Typography>
              <Rating size="small" value={this.calcRating(o.taskSum)} readOnly />
            </Stack>
          </Alert>
        );

      case "divider":
        return <Divider>{o.text}</Divider>;

      default:
        break;
    }
  }

  render() {
    return (
      <Stack direction="column" justifyContent="center" alignItems="stretch" spacing={2} mx={4}>
        {this.procObjs.map((o) => this.renderObj(o))}
      </Stack>
    );
  }
}

export default Timeline;
