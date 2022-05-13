import {
  ADD_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  GET_ALL_TASKS,
  GET_USER,
  GET_DROPDOWN_USER,
} from "../types/taskTypes";
import axios from "axios";

export const getAllTasks = (result) => {
  return (dispatch) => {
    let serviceUrl = `https://stage.api.sloovi.com/task/lead_465c14d0e99e4972b6b21ffecf3dd691?company_id=${result.company_id}`;
    let headers = {
      Authorization: `Bearer ${result.token}`,

      "Content-Type": "application/json",
    };
    axios.get(serviceUrl, { headers }).then((res) => {
      dispatch({
        type: GET_ALL_TASKS,
        payload: res.data.results,
      });
    });
  };
};

export const getUser = () => {
  return (dispatch) => {
    let serviceUrl = "";
    let postUserData = {
      email: "smithwills1989@gmail.com",
      password: "12345678",
    };

    serviceUrl = "https://stage.api.sloovi.com/login";
    let headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    axios.post(serviceUrl, postUserData, headers).then((res) => {
      dispatch({
        type: GET_USER,
        payload: res.data.results,
      });
      dispatch(getDropdownUser(res.data.results));
      dispatch(getAllTasks(res.data.results));
    });
  };
};

export const getDropdownUser = (result) => {
  return (dispatch) => {
    let serviceUrl = "";

    serviceUrl = `https://stage.api.sloovi.com/team?product=outreach&company_id=${result.company_id}`;
    let headers = {
      Authorization: `Bearer ${result.token}`,

      "Content-Type": "application/json",
    };
    axios.get(serviceUrl, { headers }).then((res) => {
      let opt = res.data.results.data;
      let opts = [];

      opt.forEach((element) => {
        let newObj = {
          value: `${element.id} `,
          label: `${element.first} ${element.last}`,
          icon: element.icon,
          id: element.id,
        };
        opts.push(newObj);
      });
      dispatch({
        type: GET_DROPDOWN_USER,
        payload: opts,
      });
    });
  };
};

export const addTask = (data) => {
  return (dispatch) => {
    let serviceUrl = `https://stage.api.sloovi.com/task/lead_465c14d0e99e4972b6b21ffecf3dd691?company_id=${data.company_id}`;

    let headers = {
      Authorization: `Bearer ${data.token}`,

      "Content-Type": "application/json",
    };

    const newData = {
      assigned_user: data.dataObj.assigned_user.trim(),
      task_date: data.dataObj.task_date,
      task_time: data.dataObj.task_time,
      is_completed: 0,
      time_zone: data.dataObj.time_zone,
      task_msg: data.dataObj.task_msg,
    };

    axios
      .post(serviceUrl, newData, { headers })
      .then((res) => {
        dispatch({
          type: ADD_TASK,
          payload: res.data.results,
        });
      })
      .catch(function (error) {});
  };
};

export const deleteTask = (data) => {
  return (dispatch) => {
    let serviceUrl = `https://stage.api.sloovi.com/task/lead_465c14d0e99e4972b6b21ffecf3dd691/${data.taskId}?company_id=${data.company_id}`;

    let headers = {
      Authorization: `Bearer ${data.token}`,

      "Content-Type": "application/json",
    };

    axios
      .delete(serviceUrl, { headers })
      .then((res) => {
        dispatch({
          type: DELETE_TASK,
          payload: data,
        });
        window.location.reload();
      })
      .catch(function (error) {});
  };
};

export const updateTask = (data) => {
  return (dispatch) => {
    let serviceUrl = `https://stage.api.sloovi.com/task/lead_465c14d0e99e4972b6b21ffecf3dd691/${data.taskId}?company_id=${data.company_id}`;

    let headers = {
      Authorization: `Bearer ${data.token}`,

      "Content-Type": "application/json",
    };

    axios
      .put(serviceUrl, data.dataObj, { headers })
      .then((res) => {
        dispatch({
          type: UPDATE_TASK,
          payload: res.data.results,
        });
      })
      .catch(function (error) {});
  };
};
