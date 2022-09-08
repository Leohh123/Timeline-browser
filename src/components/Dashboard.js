import {
  Button,
  Divider,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { formatDate, formatDuration, formatMilliseconds } from "../common/Utils";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { Api, createFormData } from "../common/ApiTool";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hour: 0,
      minute: 0,
      title: "",
      intervalId: null,
      countText: "00:00:00",
    };
  }

  componentDidMount() {
    const updateCount = (id) => {
      if (this.props.taskNow) {
        let d = new Date(this.props.taskNow.head);
        let text = formatMilliseconds(new Date() - d);
        this.setState({ countText: text });
        // console.log("updateCount", id, this.state.intervalId, this.state, new Date() - d);
      }
    };
    const f = () => {
      let id = setInterval(() => {
        if (this.state.intervalId === id) {
          updateCount(id);
        } else {
          clearInterval(id);
        }
      }, 1000);
      return id;
    };
    this.setState({ intervalId: f() });
  }

  handleGo() {
    if (window.confirm(`准备好进入下一阶段了吗？\n下一阶段：【${this.props.stageNext.title}】`)) {
      axios.post(Api("/stage/go")).then(({ data: { code, message, data } }) => {
        if (code !== 0) {
          alert(message);
          return;
        }
        this.props.onFetch();
      });
    }
  }

  renderStage() {
    return (
      <>
        <Typography variant="h5" sx={{ fontVariant: "all-small-caps" }}>
          Stage
        </Typography>
        <Typography>当前阶段：{this.props.stageNow.title}</Typography>
        <Typography color="text.secondary">
          计划时间：{formatDate(new Date(this.props.stageNow.estimated))}-
          {formatDate(new Date(this.props.stageNext.estimated))}
        </Typography>
        <Typography color="text.secondary">
          开始时间：{formatDate(new Date(this.props.stageNow.actual))}
        </Typography>
        <Button
          variant="outlined"
          disabled={this.props.taskNow !== null}
          onClick={() => this.handleGo()}
        >
          进入下一阶段
        </Button>
      </>
    );
  }

  handleStart() {
    if (this.state.title === "") {
      alert("你还没说要干嘛呢~");
      return;
    }
    axios({
      method: "POST",
      url: Api("/task/start"),
      data: createFormData({
        title: this.state.title,
        estimated: this.state.hour * 60 + this.state.minute,
      }),
    }).then(({ data: { code, message, data } }) => {
      if (code !== 0) {
        alert(message);
        return;
      }
      this.setState({ title: "" });
      this.props.onFetch();
    });
  }

  handleFinish() {
    if (window.confirm("真的【完成】任务了吗？")) {
      axios.post(Api("/task/finish")).then(({ data: { code, message, data } }) => {
        if (code !== 0) {
          alert(message);
          return;
        }
        this.props.onFetch();
      });
    }
  }

  handleCancel() {
    if (window.confirm("确定要【取消】任务吗（危")) {
      axios.post(Api("/task/cancel")).then(({ data: { code, message, data } }) => {
        if (code !== 0) {
          alert(message);
          return;
        }
        this.props.onFetch();
      });
    }
  }

  renderTaskStart() {
    return (
      <>
        <Typography variant="h5" sx={{ fontVariant: "all-small-caps" }}>
          Task
        </Typography>
        <TextField
          label="要做什么呢？"
          variant="outlined"
          value={this.state.title}
          onChange={(ev) => this.setState({ title: ev.target.value })}
        />
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
          <Typography>预计用时</Typography>
          <Select
            value={this.state.hour}
            onChange={(ev) => this.setState({ hour: ev.target.value })}
          >
            {[...Array(5)].map((e, i) => (
              <MenuItem value={i} key={`h${i}`}>
                {i}
              </MenuItem>
            ))}
          </Select>
          <Typography>时</Typography>
          <Select
            value={this.state.minute}
            onChange={(ev) => this.setState({ minute: ev.target.value })}
          >
            {[...Array(12)].map((e, i) => (
              <MenuItem value={i * 5} key={`m${i * 5}`}>
                {i * 5}
              </MenuItem>
            ))}
          </Select>
          <Typography>分</Typography>
        </Stack>
        <Button variant="outlined" onClick={() => this.handleStart()}>
          开始任务
        </Button>
      </>
    );
  }

  renderTaskRunning() {
    return (
      <>
        <Typography variant="h5" sx={{ fontVariant: "all-small-caps" }}>
          Task
          <IconButton aria-label="delete" onClick={() => this.handleCancel()}>
            <DeleteIcon />
          </IconButton>
        </Typography>
        <Typography>当前任务：{this.props.taskNow.title}</Typography>
        <Typography color="text.secondary">
          预计用时：{formatDuration(this.props.taskNow.estimated)}
        </Typography>
        <Typography color="text.secondary">已用时：</Typography>
        <Stack direction="column" justifyContent="center" alignItems="center">
          <Typography variant="h3" color="text.secondary">
            {this.state.countText}
          </Typography>
        </Stack>
        <Button variant="outlined" onClick={() => this.handleFinish()}>
          完成任务
        </Button>
      </>
    );
  }

  render() {
    return (
      <Stack direction="column" justifyContent="center" alignItems="stretch" spacing={2} mx={4}>
        {this.renderStage()}
        <Divider></Divider>
        {this.props.taskNow === null ? this.renderTaskStart() : this.renderTaskRunning()}
      </Stack>
    );
  }
}

export default Dashboard;
