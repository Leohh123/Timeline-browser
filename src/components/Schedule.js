import { Box, Divider, IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import { formatTime } from "../common/Utils";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { Api, createFormData } from "../common/ApiTool";
import axios from "axios";
import { DAY_CHAR } from "../common/Utils";

class Schedule extends React.Component {
  handleJump(o) {
    if (window.confirm(`确定要跳转至阶段【${o.title}】吗？`)) {
      axios({
        method: "POST",
        url: Api("/stage/jump"),
        data: createFormData({
          pid: o.id,
        }),
      }).then(({ data: { code, message, data } }) => {
        if (code !== 0) {
          alert(message);
          return;
        }
        this.props.onFetch();
      });
    }
  }

  renderPlan(o, disabled = false) {
    return (
      <Box sx={{ borderLeft: "3px solid grey" }} pl={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography color="text.secondary">
              计划于 {formatTime(o.clock)}
              {disabled && `（星期${DAY_CHAR[o.day]}限定）`}
            </Typography>
            <Typography>{o.title}</Typography>
          </Box>
          <IconButton onClick={() => this.handleJump(o)}>
            <KeyboardDoubleArrowRightIcon />
          </IconButton>
        </Stack>
      </Box>
    );
  }

  render() {
    return (
      <Stack direction="column" justifyContent="center" alignItems="stretch" spacing={2} mx={4}>
        {/* <Typography variant="h5" sx={{ fontVariant: "all-small-caps" }}>
          Seer
        </Typography> */}
        <Divider>可用计划</Divider>
        {this.props.planList["enabled"].length
          ? this.props.planList["enabled"].map((o) => this.renderPlan(o))
          : "（无）"}
        <Divider>不可用计划</Divider>
        {this.props.planList["disabled"].length
          ? this.props.planList["disabled"].map((o) => this.renderPlan(o, true))
          : "（无）"}
      </Stack>
    );
  }
}

export default Schedule;
