import React, { useState, useEffect } from "react";
import { PermContactCalendarOutlined, EditOutlined } from "@mui/icons-material";
import { Avatar, Card, IconButton } from "@mui/material";
import TextField from "@mui/material/TextField";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers";

import { TimePicker } from "@mui/x-date-pickers";
import { Select } from "@mui/material";

import MenuItem from "@mui/material/MenuItem";

import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";

// redux
import { useSelector, useDispatch } from "react-redux";
import {
  getUser,
  addTask,
  updateTask,
  deleteTask,
} from "../redux/actions/taskActions";

// material list
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";

const Task = () => {
  // dispatch
  const dispatch = useDispatch();
  const [value, setValue] = useState();
  const [task_time, setTaskTime] = useState();
  const [assigned, setAssigned] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [desc, setDesc] = useState("");
  const [operations, setOperations] = useState("view");
  const [dense, setDense] = React.useState(false);

  const [selectedItem, setSelectedItem] = useState({});

  const { tasks, dropdownUser, user } = useSelector(
    (state) => state.taskReducer
  );

  const handleChange = (event) => {
    setAssigned(event.target.value);
  };
  const handleShowForm = () => {
    setOperations("create");
    if (dropdownUser.length > 0) {
      setShowForm(!showForm);
    }
  };

  const handleCloseForm = () => {
    setOperations("view");
    setShowForm(!showForm);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setOperations("edit");
    setDesc(item.task_msg);
    setValue(new Date(item.task_date));
    setTaskTime(item.task_time);

    setAssigned(item.assigned_user);

    setShowForm(!showForm);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    let data = {
      company_id: user.company_id,
      token: user.token,
      taskId: item.id,
    };

    setTimeout(() => {
      dispatch(deleteTask(data));
    }, 2000);

    setShowForm(false);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const date = new Date();

    const offset = date.getTimezoneOffset();

    const timeZone = -offset * 60;

    let data = {
      dataObj: {
        assigned_user: assigned,
        task_date: moment(value).format("YYYY-MM-DD"),
        task_time: new Date(task_time).getTime(),
        is_completed: 0,
        time_zone: timeZone,
        task_msg: desc,
      },
      company_id: user.company_id,
      token: user.token,
      taskId: selectedItem.id,
    };
    dispatch(updateTask(data));
    setShowForm(!showForm);
    setOperations("view");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const date = new Date();

    const offset = date.getTimezoneOffset();

    const timeZone = -offset * 60;
    let data = {
      dataObj: {
        assigned_user: assigned,
        task_date: moment(value).format("YYYY-MM-DD"),
        task_time: new Date(task_time).getTime(),
        is_completed: 0,
        time_zone: timeZone,
        task_msg: desc,
      },
      company_id: user.company_id,
      token: user.token,
    };

    dispatch(addTask(data));
    setOperations("view");

    setTimeout(() => {
      setShowForm(false);
    }, 2000);
  };

  useEffect(() => {
    dispatch(getUser());
  }, []);

  return (
    <div className="wrapper">
      <Card sx={{ bgcolor: "rgb(237, 247, 252)" }}>
        <div className="taskContainer">
          <div className="taskHeader">
            {operations === "create" ? (
              <div className="taskBoard">
                <p>Create Task</p>
              </div>
            ) : operations === "edit" ? (
              <div className="taskBoard">
                <p>Update Task</p>
              </div>
            ) : (
              <div className="taskBoard">
                <p>Tasks</p>
                <p style={{ marginLeft: "5px" }}>{tasks.length}</p>
              </div>
            )}

            {showForm ? (
              <div onClick={handleCloseForm} className="actionWrapper">
                <p className="plusIcon">x</p>
              </div>
            ) : (
              <div onClick={handleShowForm} className="actionWrapper">
                <p className="plusIcon">+</p>
              </div>
            )}
          </div>
          {showForm ? (
            <div className="taskBody">
              <form>
                <div className="descForm">
                  <label style={{ marginLeft: "2px", fontSize: "20px" }}>
                    Task Description
                  </label>
                  <div className="textInput">
                    <IconButton
                      sx={{ position: "absolute", right: "3%", top: "3%" }}
                      aria-label="settings"
                    >
                      <PermContactCalendarOutlined sx={{ fontSize: "40px" }} />
                    </IconButton>
                    <TextField
                      id="outlined-password-input"
                      autoComplete="current-password"
                      sx={{ width: "100%" }}
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                    />
                  </div>
                </div>
                <div className="timeWrapper">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      className="datePick"
                      value={value}
                      onChange={(newValue) => {
                        setValue(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      sx={{ width: "60px" }}
                      value={task_time}
                      onChange={(newValue) => {
                        setTaskTime(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </div>

                <div>
                  <div className="selectWrapper">
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <label style={{ marginLeft: "2px", fontSize: "20px" }}>
                        Assign User
                      </label>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={assigned}
                        onChange={handleChange}
                        sx={{ width: "680px" }}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {/* <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem> */}
                        {dropdownUser &&
                          dropdownUser.map((dropDown) => (
                            <MenuItem key={dropDown.id} value={dropDown.value}>
                              {dropDown.label}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>

                <div className="buttonWrapper">
                  <Stack spacing={2} direction="row">
                    <Button variant="text">Cancel</Button>
                    {operations === "create" ? (
                      <Button
                        onClick={handleSubmit}
                        sx={{
                          paddingX: "30px",
                          backgroundColor: "rgb(71, 187, 127)",
                        }}
                        variant="contained"
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        onClick={handleUpdate}
                        sx={{
                          paddingX: "30px",
                          backgroundColor: "rgb(71, 187, 127)",
                        }}
                        variant="contained"
                      >
                        Update
                      </Button>
                    )}
                  </Stack>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <List dense={dense}>
                {tasks.length > 0 &&
                  dropdownUser.length > 0 &&
                  tasks.map((task) => {
                    return (
                      <ListItem
                        key={task.id}
                        secondaryAction={
                          <>
                            <IconButton
                              onClick={() => handleEdit(task)}
                              edge="end"
                              aria-label="delete"
                              sx={{ marginRight: "5px" }}
                            >
                              <EditOutlined />
                            </IconButton>

                            <IconButton
                              onClick={() => handleDelete(task)}
                              edge="end"
                              aria-label="delete"
                            >
                              <DeleteIcon sx={{ color: "red" }} />
                            </IconButton>
                          </>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <FolderIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={task.task_msg}
                          secondary={task.task_date}
                        />
                      </ListItem>
                    );
                  })}
              </List>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Task;
