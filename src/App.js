import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ShutterSpeedIcon from "@mui/icons-material/ShutterSpeed";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Timeline from "./components/Timeline";
import Dashboard from "./components/Dashboard";
import Misc from "./components/Misc";
import axios from "axios";
import { Api } from "./common/ApiTool";
import { formatDate, timeOfDate } from "./common/Utils";
import cookies from "./common/CookieTool";
import { Backdrop, CircularProgress } from "@mui/material";

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
// const EMPTY_TASK = { title: "", head: "", tail: "", estimated: "", actual: null, state: 0 };

// function App() {
//   const [objs, setObjs] = React.useState([]);
//   const [stageNow, setStageNow] = React.useState(EMPTY_STAGE);
//   const [stageNext, setStageNext] = React.useState(EMPTY_STAGE);
//   const [taskNow, setTaskNow] = React.useState(null);
//   const [lastUpdateTime, setLastUpdateTime] = React.useState("");
//   const [token, setToken] = React.useState("");

//   const lookBack = () => {
//     const MS_DAY = 60 * 60 * 24;
//     const MS_TODAY = timeOfDate(new Date()) / 1000;

//     const lookDays = parseInt(cookies.get("look_days")) || 2;

//     const from = MS_TODAY - (lookDays - 1) * MS_DAY;
//     const to = MS_TODAY + MS_DAY;

//     return axios.get(Api("/obj/list"), { params: { from, to } });
//   };

//   const fetchData = () => {
//     axios
//       .all([
//         lookBack(),
//         axios.get(Api("/stage/now")),
//         axios.get(Api("/stage/next")),
//         axios.get(Api("/task/now")),
//       ])
//       .then(
//         axios.spread(
//           (
//             { data: objsData },
//             { data: stageNowData },
//             { data: stageNextData },
//             { data: taskNowData }
//           ) => {
//             console.log(objsData, stageNowData, stageNextData, taskNowData);
//             setObjs(objsData);
//             setStageNow(stageNowData);
//             setStageNext(stageNextData);
//             setTaskNow(taskNowData);
//             setLastUpdateTime(formatDate(new Date(), "HH:MM:SS"));
//           }
//         )
//       );
//   };

//   const [value, setValue] = React.useState(0);
//   const ref = React.useRef(null);

//   React.useEffect(() => {
//     if (value === 0) {
//       window.scrollTo(0, document.body.scrollHeight);
//     } else {
//       window.scrollTo(0, 0);
//     }
//   }, [value]);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   return (
//     <Box sx={{ pb: 7 }} ref={ref}>
//       <TabPanel value={value} index={0}>
//         <Timeline objs={objs} lastUpdateTime={lastUpdateTime} onFetch={() => this.fetchData()} />
//       </TabPanel>
//       <TabPanel value={value} index={1}>
//         <Dashboard stageNow={stageNow} stageNext={stageNext} taskNow={taskNow} token={token} />
//       </TabPanel>
//       <TabPanel value={value} index={2}>
//         <Misc token={token} setToken={setToken} />
//       </TabPanel>
//       <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
//         <Tabs
//           value={value}
//           onChange={handleChange}
//           aria-label="icon label tabs example"
//           variant="fullWidth"
//         >
//           <Tab icon={<ShutterSpeedIcon />} label="时间线" />
//           <Tab icon={<LibraryBooksIcon />} label="仪表盘" />
//           <Tab icon={<AutoAwesomeIcon />} label="碎纸屑" />
//         </Tabs>
//       </Paper>
//     </Box>
//   );
// }

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

    const lookDays = parseInt(cookies.get("range")) || 2;

    const from = MS_TODAY - (lookDays - 1) * MS_DAY;
    const to = MS_TODAY + MS_DAY;

    return axios.get(Api("/obj/list"), { params: { from, to } });
  }

  fetchData() {
    this.setState({ isFetching: true });
    axios
      .all([
        this.lookBack(),
        axios.get(Api("/stage/now")),
        axios.get(Api("/stage/next")),
        axios.get(Api("/task/now")),
      ])
      .then(
        axios.spread(
          (
            { data: { data: objsData } },
            { data: { data: stageNowData } },
            { data: { data: stageNextData } },
            { data: { data: taskNowData } }
          ) => {
            // console.log(objsData, stageNowData, stageNextData, taskNowData);
            this.setState({
              objs: objsData,
              stageNow: stageNowData,
              stageNext: stageNextData,
              taskNow: taskNowData,
              lastUpdateTime: formatDate(new Date(), "HH:MM:SS"),
            });
            this.setState({ isFetching: false });
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
            onFetch={() => this.fetchData()}
          />
        </TabPanel>
        <TabPanel value={this.props.value} index={1}>
          <Dashboard
            stageNow={this.state.stageNow}
            stageNext={this.state.stageNext}
            taskNow={this.state.taskNow}
            onFetch={() => this.fetchData()}
          />
        </TabPanel>
        <TabPanel value={this.props.value} index={2}>
          <Misc />
        </TabPanel>
        <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
          <Tabs
            value={this.props.value}
            onChange={(e, v) => this.props.setValue(v)}
            aria-label="icon label tabs example"
            variant="fullWidth"
          >
            <Tab icon={<ShutterSpeedIcon />} label="时间线" />
            <Tab icon={<LibraryBooksIcon />} label="仪表盘" />
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
