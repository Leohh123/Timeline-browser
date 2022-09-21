import { Button, Divider, Link, Stack, TextField, ThemeProvider, Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import { Api, createFormData } from "../common/ApiTool";
import Config from "../common/Config";
import { getCookie, setCookie } from "../common/CookieTool";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { COMMENT_THEME, selectCommentColor } from "../common/Utils";

class Misc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: getCookie("token"),
      range: parseInt(getCookie("range")) || 2,
      name: getCookie("name"),
      comment: "",
    };
  }

  handleSaveToken() {
    setCookie("token", this.state.token);
    alert("记住了Token喵");
  }

  handleSaveRange() {
    setCookie("range", this.state.range.toString());
    alert("记住了Range喵");
  }

  handleAddComment() {
    if (this.state.comment.trim() === "") {
      alert("嗯...想说些什么呢？");
      return;
    }
    if (window.confirm("确定要把纸条贴上去吗？")) {
      setCookie("name", this.state.name);
      axios({
        method: "POST",
        url: Api("/comment/add"),
        data: createFormData({
          name: this.state.name,
          content: this.state.comment,
        }),
      }).then(({ data: { code, message, data } }) => {
        if (code !== 0) {
          alert(message);
          return;
        }
        this.props.onFetch(() => {
          alert("贴...贴上去了！快去看看吧~");
        });
      });
    }
  }

  get nameFieldColor() {
    let color = selectCommentColor(this.state.name.trim());
    console.log(color, this.state.name);
    return color[700];
  }

  render() {
    return (
      <Stack direction="column" justifyContent="center" alignItems="stretch" spacing={2} mx={4}>
        <Typography gutterBottom variant="h5" sx={{ fontVariant: "all-small-caps" }}>
          Token
        </Typography>
        <TextField
          label="来者何人？对暗号！"
          variant="outlined"
          value={this.state.token}
          onChange={(ev) => this.setState({ token: ev.target.value })}
        />
        <Button variant="outlined" onClick={() => this.handleSaveToken()}>
          就是这样喵
        </Button>
        <Divider></Divider>
        <Typography gutterBottom variant="h5" sx={{ fontVariant: "all-small-caps" }}>
          Range
        </Typography>
        <TextField
          label="想看多少天的？"
          variant="outlined"
          type="number"
          value={this.state.range}
          onChange={(ev) => this.setState({ range: ev.target.value })}
        />
        <Button variant="outlined" onClick={() => this.handleSaveRange()}>
          没错没错喵
        </Button>
        <Divider></Divider>
        <Typography gutterBottom variant="h5" sx={{ fontVariant: "all-small-caps" }}>
          Message
        </Typography>
        <ThemeProvider theme={COMMENT_THEME}>
          <TextField
            label="叫什么名字呢？"
            variant="outlined"
            value={this.state.name}
            color={this.state.name.trim() === "" ? "primary" : this.nameFieldColor}
            onChange={(ev) => this.setState({ name: ev.target.value })}
          />
        </ThemeProvider>
        <TextField
          label="留个纸条吧~"
          variant="outlined"
          multiline
          maxRows={4}
          value={this.state.comment}
          onChange={(ev) => this.setState({ comment: ev.target.value })}
        />
        <Button variant="outlined" onClick={() => this.handleAddComment()}>
          贴到墙上喵
        </Button>
        <Divider></Divider>
        <Typography gutterBottom variant="h5" sx={{ fontVariant: "all-small-caps" }}>
          Backdoor
        </Typography>
        <Link href={Config.ADMIN_HREF}>悄悄滴这边走</Link>
        <Divider></Divider>
        <Typography gutterBottom variant="h5" sx={{ fontVariant: "all-small-caps" }}>
          About
        </Typography>
        <Stack direction="row" alignItems="center">
          <Typography color="text.secondary">Developed by Leohh</Typography>
          <FavoriteBorderIcon sx={{ fontSize: "1rem", px: 0.5, color: "text.secondary" }} />
          <Typography color="text.secondary">2022</Typography>
        </Stack>
      </Stack>
    );
  }
}

export default Misc;
