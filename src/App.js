import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ShutterSpeedIcon from "@mui/icons-material/ShutterSpeed";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import Timeline from "./components/Timeline";
import Dashboard from "./components/Dashboard";
import Misc from "./components/Misc";
import axios from "axios";
import { Api } from "./common/ApiTool";
import { formatDate, timeOfDate } from "./common/Utils";
import { getCookie } from "./common/CookieTool";
import { Backdrop, CircularProgress } from "@mui/material";
import Schedule from "./components/Schedule";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const EMPTY_STAGE = { title: "", estimated: "", actual: "" };

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      objs: [],
      stageNow: EMPTY_STAGE,
      stageNext: EMPTY_STAGE,
      taskNow: null,
      lastUpdateTime: "",
      isFetching: true,
    };
  }

  lookBack() {
    const MS_DAY = 60 * 60 * 24;
    const MS_TODAY = timeOfDate(new Date()) / 1000;

    const lookDays = parseInt(getCookie("range")) || 2;

    const from = MS_TODAY - (lookDays - 1) * MS_DAY;
    const to = MS_TODAY + MS_DAY;

    return axios.get(Api("/obj/list"), { params: { from, to } });
  }

  fetchData(callback = null) {
    this.setState({ isFetching: true });
    axios
      .all([
        this.lookBack(),
        axios.get(Api("/stage/now")),
        axios.get(Api("/stage/next")),
        axios.get(Api("/task/now")),
        axios.get(Api("/plan/list")),
      ])
      .then(
        axios.spread(
          (
            { data: { data: objsData } },
            { data: { data: stageNowData } },
            { data: { data: stageNextData } },
            { data: { data: taskNowData } },
            { data: { data: planListData } }
          ) => {
            // console.log(planListData);
            this.setState({
              objs: objsData,
              stageNow: stageNowData,
              stageNext: stageNextData,
              taskNow: taskNowData,
              lastUpdateTime: formatDate(new Date(), "HH:MM:SS"),
              planList: planListData,
            });
            this.setState({ isFetching: false });
            if (callback) {
              callback();
            }
          }
        )
      );
  }

  componentDidMount() {
    this.fetchData();
    axios.get(Api("/record")).then();
    // setInterval(() => {
    //   console.log(this.state);
    // }, 5000);
  }

  render() {
    return (
      <Box sx={{ pb: 7 }} ref={this.props.reff}>
        <TabPanel value={this.props.value} index={0}>
          <Timeline
            objs={this.state.objs}
            lastUpdateTime={this.state.lastUpdateTime}
            onFetch={(callback) => this.fetchData(callback)}
          />
        </TabPanel>
        <TabPanel value={this.props.value} index={1}>
          <Dashboard
            stageNow={this.state.stageNow}
            stageNext={this.state.stageNext}
            taskNow={this.state.taskNow}
            onFetch={(callback) => this.fetchData(callback)}
          />
        </TabPanel>
        <TabPanel value={this.props.value} index={2}>
          <Schedule
            planList={this.state.planList}
            onFetch={(callback) => this.fetchData(callback)}
          />
        </TabPanel>
        <TabPanel value={this.props.value} index={3}>
          <Misc onFetch={(callback) => this.fetchData(callback)} />
        </TabPanel>
        <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
          <Tabs
            value={this.props.value}
            onChange={(e, v) => this.props.setValue(v)}
            variant="fullWidth"
          >
            <Tab icon={<ShutterSpeedIcon />} label="时间线" />
            <Tab icon={<LibraryBooksIcon />} label="仪表盘" />
            <Tab icon={<FlightTakeoffIcon />} label="预知者" />
            <Tab icon={<AutoAwesomeIcon />} label="碎纸屑" />
          </Tabs>
        </Paper>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={this.state.isFetching}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    );
  }
}

function withScroll(Component) {
  function WrappedComponent(props) {
    const [value, setValue] = React.useState(0);
    const ref = React.useRef(null);

    React.useEffect(() => {
      if (value === 0) {
        window.scrollTo(0, document.body.scrollHeight);
      } else {
        window.scrollTo(0, 0);
      }
    }, [value]);
    return <Component {...props} value={value} setValue={setValue} reff={ref} />;
  }
  return WrappedComponent;
}

export default withScroll(App);
