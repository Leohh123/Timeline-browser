import { Button, Divider, Link, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import Config from "../common/Config";
import cookies from "../common/CookieTool";

class Misc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: cookies.get("token"),
      range: parseInt(cookies.get("range")) || 2,
    };
  }

  handleSaveToken() {
    cookies.set("token", this.state.token);
    alert("记住了Token喵");
  }

  handleSaveRange() {
    cookies.set("range", this.state.range.toString());
    alert("记住了Range喵");
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
          Backdoor
        </Typography>
        <Link href={Config.ADMIN_HREF}>悄悄滴这边走qwq</Link>
      </Stack>
    );
  }
}

export default Misc;
