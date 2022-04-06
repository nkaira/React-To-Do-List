import { connect } from "react-redux";
import React from "react";
import { Route, Routes } from "react-router-dom";

import ToDoList from "components/ToDoList/ToDoList";
import TaskDetail from "components/TaskDetail/TaskDetail";
import { setTasksAction } from "store/tasks/tasksActions";
import { setPageAction, setFilterStatus } from "store/filter/filterActions";
import Storage from "utils/storage";
import { withUseRouter } from "hoc/withUseRouter";
import styles from "./app.module.scss";

class App extends React.Component {

    componentDidMount() {
        const tasks = Storage.getItem('tasks');

        if (tasks?.length > 0) {
            this.props.setTasksAction(tasks);
        };

        const currentPage = this.props.searchParams.get('page');

        if (currentPage) {
            this.props.setPageAction(currentPage);
        };

        const status = this.props.searchParams.get('status');

        if (status) {
            this.props.setFilterStatus(status);
        };
    };

    render() {
        return (
            <div className={styles.header}>
                <h1 className={styles.title}>To Do List</h1>
                <Routes>
                    <Route path='/' element={<ToDoList />} />
                    <Route path='/:taskId' element={<TaskDetail />} />
                </Routes>
            </div>
        )
    };
};

export default withUseRouter(connect(null, {
    setPageAction, setTasksAction, setFilterStatus
})(App));